import { defineConfig } from 'vitepress'
import { MermaidMarkdown } from 'vitepress-plugin-mermaid'
import mathKatexModule from '@vscode/markdown-it-katex'
import { courses, sidebar } from './courses.mts'

// `@vscode/markdown-it-katex` 是 CJS 产物（exports.default = plugin），两种取法都兜一下
const mathKatex = (mathKatexModule as any).default ?? mathKatexModule

/**
 * 把 LaTeX 源码塞进 HTML 属性前的转义。
 *
 * 只转这四个字符就够：`&` 与 `"` 决定属性边界，`<` `>` 防止属性值被当成标签解析。
 * 换行不转 —— 块级公式的源码里本来就有换行，属性值允许换行，转成 `&#10;` 反而
 * 让客户端拿到一堆字符实体。
 */
function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const repoUrl = 'https://github.com/zalexk/lecture-note'

/**
 * 站点部署根路径（交给 VitePress 的 `base`）。
 *
 * 同一份源码要同时喂两个托管平台，而两者要求的 `base` **不一样**：
 *
 * - **GitHub Pages 项目站点** —— 地址形如 `https://<user>.github.io/lecture-note/`，
 *   站点挂在子路径下，`base` 必须是 `'/lecture-note/'`。这是本站的默认值。
 * - **Vercel / Netlify / 自定义域名** —— 站点挂在**根路径**
 *   `https://lecture-note-ten.vercel.app/`，`base` 必须是 `'/'`。
 *
 * 踩过的坑：在 Vercel 上沿用 `'/lecture-note/'` 时，构建出的 HTML 会把样式表、
 * 脚本、logo、字体全指向 `/lecture-note/assets/...`，而该路径在那个站点上**全部 404**
 * （实测 `/lecture-note/assets/style.*.css` → 404、`/assets/style.*.css` → 200），
 * 于是 CSS 与 JS 都加载不到，页面只剩裸 HTML —— 看起来就是「主题丢了、变成纯文字」。
 *
 * 判定顺序：
 *   1. `VITEPRESS_BASE` —— 显式覆盖，任何平台都能用（例如想在 Vercel 上也挂子路径）；
 *   2. `VERCEL` —— Vercel 构建时自动注入的环境变量，存在即说明在 Vercel 上 ⇒ `'/'`；
 *   3. 兜底 `'/lecture-note/'` —— GitHub Pages 项目站点。
 *
 * GitHub Actions 的构建环境里没有 `VERCEL`，所以那条路仍拿到子路径，两个平台互不干扰。
 */
const SITE_BASE =
  process.env.VITEPRESS_BASE ?? (process.env.VERCEL ? '/' : '/lecture-note/')

/**
 * Microsoft Clarity 的站点 ID（项目设置 → Setup → 安装代码里的 `clarity.ms/tag/<ID>`）。
 * 换站点只改这一处，下面的接入片段会跟着变。
 */
const CLARITY_PROJECT_ID = 'yog83wchao'

/**
 * Microsoft Clarity 官方接入片段，原样内联进每个页面的 `<head>`。
 *
 * 几点说明：
 * - 用 VitePress `head` 的 `['script', {}, <code>]` 形式写**内联脚本**——第三个元素是
 *   `<script>` 的 innerHTML，不会被转义，所以不用改写成外部文件。
 * - 片段自己 `createElement('script')` 并 `async=1` 去拉 `https://www.clarity.ms/tag/<ID>`，
 *   所以它对首屏是**非阻塞**的，也不会拖慢 `vitepress build`（构建期只是把这段字符串抄进 HTML）。
 * - 放 `<head>` 是官方要求：Clarity 需要在页面脚本执行前打好桩（`window.clarity` 队列），
 *   否则组件挂载阶段的早期事件会丢。
 * - ⚠️ 内联即**所有环境都生效**，包括 `npm run docs:dev` 与 `vitepress preview` 起的
 *   localhost 页面。本地预览的访问同样会被记为会话，混进真实数据里。
 *   若只想让线上（GitHub Pages）上报，把下面的 `head` 条目换成 `transformHead`
 *   并按 `process.env.NODE_ENV !== 'production'` 跳过即可。
 */
const claritySnippet =
  '(function(c,l,a,r,i,t,y){' +
  'c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};' +
  't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;' +
  'y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);' +
  `})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`

/**
 * mermaid 的全局设置。
 *
 * 这份对象与 `withMermaid()` 内部用的默认值一致：
 * - `securityLevel: 'loose'` —— 图里允许嵌 `<img>` / `<a>`；
 * - `startOnLoad: false` —— 本站是组件挂载后手动 render，不扫全页。
 *
 * 它由下面的 `mermaidConfigShim()` 喂给 `virtual:mermaid-config` 模块，
 * 而那个模块正是 `Mermaid.vue` 读取配置的唯一入口。
 */
const mermaidSettings = {
  securityLevel: 'loose',
  startOnLoad: false,
}

const MERMAID_CONFIG_ID = 'virtual:mermaid-config'

/**
 * 一个只有 10 行的 Vite 插件，只做一件事：提供 `virtual:mermaid-config`。
 *
 * ## 为什么不用 `withMermaid()`
 *
 * `withMermaid()` 除了注册 markdown 规则，还会往
 * `vitepress/dist/client/app/index.js` 里**静态**注入这一句：
 *
 *     import Mermaid from 'vitepress-plugin-mermaid/Mermaid.vue'
 *     app.component("Mermaid", Mermaid)
 *
 * 于是整个 mermaid 核心被打进 **app chunk**，而 mermaid 核心又是靠
 * 动态 `import()` 去加载 37 个图形定义（flowchart / sequence / gantt …）的，
 * 这些动态目标会记在 `appChunk.dynamicImports` 上。VitePress 的
 * `resolvePageImports()`（node/chunk-*.js）直接把
 * `appChunk.dynamicImports` 展开成 `<link rel="modulepreload">`，
 * 于是**每一页**——包括连一张图都没有的首页和课程概览页——都要预拉
 * 约 1.08 MB 的图形代码。实测改前 L6 单页首屏 3780 KB，其中 mermaid 占 1081 KB。
 *
 * ## 换成什么
 *
 * 这里只保留虚拟模块（组件不在这里注册），组件改由 `theme/index.ts` 用
 * `defineAsyncComponent` 注册。引用位置从 app chunk 挪到了 **theme chunk**，
 * 而 `resolvePageImports()` 只读 app chunk 与 page chunk、**不递归 theme chunk**
 * —— 这一点可以直接验证：本地搜索索引那个 chunk 也是 theme 侧动态引入的，
 * 它从来没有出现在任何页面的 preload 列表里。
 *
 * 结果：这 37 个 chunk 从「每页无条件预加载」变成
 * 「只有真正画图的那一页、在渲染到那张图时才下载」。
 */
function mermaidConfigShim() {
  const resolved = '\0' + MERMAID_CONFIG_ID
  return {
    name: 'mermaid-config-shim',
    resolveId(id: string) {
      if (id === MERMAID_CONFIG_ID) return resolved
    },
    load(id: string) {
      if (id === resolved) {
        return `export default ${JSON.stringify(mermaidSettings)}`
      }
    },
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Lecture Notes',
  description: 'CUHK-Shenzhen 课程笔记归档',
  base: SITE_BASE,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    // Microsoft Clarity 行为分析（见文件顶部 claritySnippet 注释）
    ['script', {}, claritySnippet],
  ],

  markdown: {
    // 数学层：用 KaTeX，**不用** VitePress 内置的 `math: true`。
    // 内置那条路固定走 markdown-it-mathjax3，有两个问题：
    //   ① 它输出 SVG，把每条公式的字形路径内联进 HTML —— 本站 L6 单页曾因此到 4.3 MB；
    //   ② 它只吐 <mjx-container> 而不注入配套 CSS，行内公式的基线得自己兜（配错就是整体抬高）。
    // KaTeX 输出 HTML + 共享字体文件，配套 CSS 一句 import 就能带上（见 theme/index.ts）。
    config(md) {
      // mermaid 的 fence 规则：```mermaid 代码块 → <Mermaid> 组件。
      // 必须**最先**注册 —— 它内部会 `bind` 住当时的 renderer.rules.fence
      // 再包一层，注册晚了会把前面别人装好的 fence 处理吞掉。
      // 原本由 `withMermaid()` 代劳，现在手工接线（原因见 mermaidConfigShim 注释）。
      MermaidMarkdown(md, { class: 'mermaid' })

      md.use(mathKatex, { output: 'html' })

      // 为什么是 `output: 'html'` 而不是默认的 `htmlAndMathml`：
      // 默认会把**每个公式渲染两遍** —— 一份 <span class="katex-mathml">（给读屏软件，
      // 靠 katex.min.css 裁成 1px 不可见）＋ 一份 <span class="katex-html">（眼睛看到的）。
      // 实测 STA2002 L5：2,873 个公式因此产生 31,883 个 MathML 节点，占全页 119,462 个
      // 节点的 26.7%；而且划选复制时两遍都进剪贴板，同一个公式在文本里凭空出现两次
      // （`Xˉ±zα/2sn` 后面紧跟一遍 `Xˉ ±z α/2 n s`）。
      // 关掉之后视觉零变化（katex-html 那半逐字节相同），代价是读屏软件失去数学语义。
      //
      // ⚠️ 关掉 MathML 的同时也关掉了 <annotation>（里面存的就是原始 LaTeX 源码），
      // 于是「复制出 LaTeX」这件事没了着落 —— 下面把源码挂成 data-tex 属性补回来。
      for (const rule of [
        'math_inline',
        'math_block',
        'math_inline_block',
        'math_inline_bare_block',
      ] as const) {
        const original = md.renderer.rules[rule]
        if (!original) continue
        md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
          const html = original(tokens, idx, options, env, self)
          const tex = escapeAttr(tokens[idx].content.trim())
          // ⚠️ 两个坑，都是踩过才写下的：
          // ① 匹配串必须带结尾的 `>`。只写 `<span class="katex"` 会命中
          //    `<span class="katex-display"` 的前缀，把块级公式的外层包裹切开，
          //    产出 `data-tex="…">-display">` 这种畸形标签。
          // ② 替换值必须用**函数**返回。字符串形式的 replace 会把 `$&`、`$'`、`$\``
          //    当成特殊模式：TeX 里 `$A$` 后跟被转义的 `&quot;` 正好拼出 `$&`，
          //    于是 `$&quot;` 被替换成「匹配到的内容 + quot;」，属性值当场撕裂
          //    （表现为 Vue 报 "Attribute name cannot contain U+0022"）。
          return html.replace(
            '<span class="katex">',
            () => `<span class="katex" data-tex="${tex}">`
          )
        }
      }

      // GitHub alert（`> [!IMPORTANT] 标题`）的标题走的是另一条路：VitePress 的
      // gitHubAlertsPlugin 把 core 规则切出来的 meta.title **原样**插进 HTML，
      // 不像 `::: tip 标题` 那样调 md.renderInline()。于是标题里的 `$...$`
      // 不会被 KaTeX 处理，页面上直接露出 LaTeX 源码（正文里的同一公式却是好的）。
      // 这里把标题先过一遍 renderInline 再交给原渲染器，markup 仍由 VitePress 生成。
      const alertOpen = md.renderer.rules.github_alert_open
      if (alertOpen) {
        md.renderer.rules.github_alert_open = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          const title = md.renderInline(token.meta.title, env)
          // 传克隆体而不是改 token.meta：同一份 token 可能被渲染多次（dev 热更新、
          // 搜索索引），就地改写会让第二次拿到已渲染的 HTML 再渲染一遍。
          const patched = Object.assign(Object.create(Object.getPrototypeOf(token)), token, {
            meta: { ...token.meta, title },
          })
          return alertOpen([patched], 0, options, env, self)
        }
      }
    },
    // 文中的裸 HTML（如 <br/>）照常渲染
    html: true,
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '课程',
        items: courses.map((c) => ({
          text: `${c.code} ${c.name}`,
          link: `/${c.dir}/`,
        })),
      },
      { text: 'GitHub', link: repoUrl },
    ],

    sidebar,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索笔记',
            buttonAriaLabel: '搜索笔记',
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清空查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一节', next: '下一节' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    externalLinkIcon: true,

    socialLinks: [{ icon: 'github', link: repoUrl }],

    footer: {
      message: '本站笔记由 AI 辅助整理，可能存在错误，请以课件与教材原文为准',
      copyright: '仅供学习交流使用',
    },
  },

  // ---- vitepress-plugin-mermaid（手工接线，见文件顶部 mermaidConfigShim）----
  vite: {
    plugins: [mermaidConfigShim()],

    // 下面两项原本由 `withMermaid()` 自动写入，改成手工接线后必须自己带上：
    // - optimizeDeps：mermaid 是运行时才 import 这些包的，不预打包的话
    //   dev 首次画图会触发依赖重优化 → 整页刷新一次；
    // - resolve.alias：mermaid 引的是 dayjs 的 CJS 路径和 cytoscape 的 **UMD** 构建，
    //   后者在 SSR 下取不到 default 导出，构建会直接失败。
    optimizeDeps: {
      include: [
        '@braintree/sanitize-url',
        'dayjs',
        'debug',
        'cytoscape-cose-bilkent',
        'cytoscape',

        // ⚠️ 以下三项**不在** `withMermaid()` 的默认清单里，是实测补上的（2026-09-26）。
        // 它们都是 mermaid 的传递依赖里的 **CJS-only** 包（package.json 既无
        // `"type": "module"` 也无 `module`/`exports` 的 import 分支），dev 下 Vite 会把它们
        // 当源码原样下发、没有 CJS→ESM 的 default 互操作，浏览器直接报
        //   `does not provide an export named 'default'`
        // ⇒ 整个 `import('.../Mermaid.vue')` **reject**，dev 下图形永远不出现。
        // 症状很有迷惑性：mermaid 位置只剩一个 `<!---->` 占位符，而控制台**只有 favicon 404**。
        //
        // 排查手法（可复跑）：在页面里手跑
        //   import('/lecture-note/@fs/.../vitepress-plugin-mermaid/dist/Mermaid.vue')
        // 用 Promise.race 加超时，就能把 reject 的原文逼出来。
        //
        // 生产构建走 rollup、有 commonjs 互操作，所以**只有 dev 会踩到**。
        'fastdom',
        // 注意要连**子路径**一起写：mermaid 同时引了 `fastdom` 与
        // `fastdom/extensions/fastdom-promised.js`，只加前者的话后者照样炸。
        'fastdom/extensions/fastdom-promised.js',
        // 架构图用的 fcose 布局；不加的话只有画架构图时才炸，更难发现。
        'cytoscape-fcose',
      ],
    },

    resolve: {
      alias: {
        'dayjs/plugin/advancedFormat.js': 'dayjs/esm/plugin/advancedFormat',
        'dayjs/plugin/customParseFormat.js': 'dayjs/esm/plugin/customParseFormat',
        'dayjs/plugin/isoWeek.js': 'dayjs/esm/plugin/isoWeek',
        // ⚠️ 这一条 `withMermaid()` 的作者漏了（另外三条都有）。只有甘特图会引它，
        // 所以平时不炸；不补的话画甘特图时会撞上面同一类 CJS default 报错。
        'dayjs/plugin/duration.js': 'dayjs/esm/plugin/duration',
        'cytoscape/dist/cytoscape.umd.js': 'cytoscape/dist/cytoscape.esm.js',
      },
    },
  },
})
