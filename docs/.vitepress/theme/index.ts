/**
 * 主题入口。
 *
 * 1. 通过 Layout 的 `layout-top` 插槽，在全站每一页顶部挂一条常驻声明，
 *    说明内容由 AI 辅助生成 —— 这是本站最重要的免责信息，因此放在最显眼的位置。
 * 2. 挂载自定义样式，其余沿用 VitePress 默认主题。
 *
 * 关于 Mermaid：`withMermaid`（见 config.mts）会在构建时把 ```mermaid 代码块
 * 转成 <Mermaid> 组件，并自动向 VitePress 客户端 app 注册该组件，
 * 因此这里**不需要**再手动 app.component('Mermaid', ...)。
 */

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
// KaTeX 的样式表 —— 渲染器换成了 KaTeX（见 config.mts），
// 这张 CSS 必须显式引入，否则公式会退化成挤在一起的裸 HTML（缺字形度量与字体）。
// 放在 ./style.css 之前，好让后者的微调能覆盖它。
import 'katex/dist/katex.min.css'
import './style.css'

export default {
  extends: DefaultTheme,

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
