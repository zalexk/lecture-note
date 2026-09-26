/**
 * 主题入口。
 *
 * 1. 通过 Layout 的 `layout-top` 插槽，在全站每一页顶部挂一条常驻声明，
 *    说明内容由 AI 辅助生成 —— 这是本站最重要的免责信息，因此放在最显眼的位置。
 * 2. 注册 **惰性** 的 Mermaid 组件（见下）。
 * 3. 挂载自定义样式，其余沿用 VitePress 默认主题。
 *
 * 关于 Mermaid 的**惰性**注册 —— 这是刻意的设计，不是漏写：
 *
 * `withMermaid()` 那条路会往 VitePress 客户端入口静态注入
 * `import Mermaid from 'vitepress-plugin-mermaid/Mermaid.vue'`，于是 mermaid 核心
 * 连同它动态引用的 37 个图形 chunk 全被打进 **app chunk**；而 VitePress 的
 * `resolvePageImports()` 会把 `appChunk.dynamicImports` 原样写成
 * `<link rel="modulepreload">`，结果是**每一页**（含一张图都没有的首页）
 * 都白拉约 1.08 MB 图形代码。
 *
 * 这里改成 `defineAsyncComponent`：引用位置落在 **theme chunk** 上，
 * 而 `resolvePageImports()` 只读 app chunk 与 page chunk、不递归 theme chunk，
 * 于是这些 chunk 只在「真正画图的那一页、渲染到那张图时」才下载。
 *
 * 配套改动在 `config.mts`（不再用 `withMermaid`，见那里的 `mermaidConfigShim`）。
 */

import { defineAsyncComponent, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
// KaTeX 的样式表 —— 渲染器换成了 KaTeX（见 config.mts），
// 这张 CSS 必须显式引入，否则公式会退化成挤在一起的裸 HTML（缺字形度量与字体）。
// 放在 ./style.css 之前，好让后者的微调能覆盖它。
import 'katex/dist/katex.min.css'
import './style.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    // ```mermaid 代码块由 config.mts 的 `MermaidMarkdown` 转成 <Mermaid> 标签，
    // 这里把同名组件注册上。用异步组件，让 mermaid 的下载推迟到
    // 页面里真的出现 <Mermaid> 的那一刻。
    //
    // `suspensible: false` 是**必须**的，不是可选优化：
    // `MermaidMarkdown` 会把每个代码块包在 `<Suspense>` 里（fallback 是 "Loading..."）。
    // 默认的异步组件会把自己交给最近的 Suspense 管，于是 SSR 阶段一旦解析不出来
    // （实测 dev 模式下就会），产物里落下的就是 `Loading...`，而注水时 Suspense
    // 不会重新触发那个异步依赖 ⇒ **dev 下图形永远不出现**（生产构建恰好能解析，
    // 所以这个坑只在 dev 暴露）。设成 false 后组件自己管加载态、不等 Suspense。
    app.component(
      'Mermaid',
      defineAsyncComponent({
        loader: () => import('vitepress-plugin-mermaid/Mermaid.vue'),
        suspensible: false,
      })
    )
  },

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () =>
        h('div', { class: 'ai-notice', role: 'note' }, [
          h('span', { class: 'ai-notice-badge' }, 'AI 生成'),
          // 宽屏文案
          h(
            'span',
            { class: 'ai-notice-text ai-notice-text--full' },
            '本站笔记由 AI 辅助整理，可能存在错误 —— 请以课件与教材原文为准。'
          ),
          // 窄屏文案（由 CSS 切换，避免固定高度下被截断）
          h(
            'span',
            { class: 'ai-notice-text ai-notice-text--short' },
            '可能存在错误，请以课件原文为准'
          ),
        ]),
    })
  },
}
