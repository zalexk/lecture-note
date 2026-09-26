import { defineConfig } from 'vitepress'
import { MermaidMarkdown } from 'vitepress-plugin-mermaid'
import mathKatexModule from '@vscode/markdown-it-katex'
import { courses, sidebar } from './courses.mts'

// `@vscode/markdown-it-katex` 是 CJS 产物（exports.default = plugin），两种取法都兜一下
const mathKatex = (mathKatexModule as any).default ?? mathKatexModule

const repoUrl = 'https://github.com/zalexk/lecture-note'

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
  base: '/lecture-note/',
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

      md.use(mathKatex)
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
