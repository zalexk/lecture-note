/**
 * 主题入口。
 *
 * 这里只挂载自定义样式，其余沿用 VitePress 默认主题。
 *
 * 关于 Mermaid：`withMermaid`（见 config.mts）会在构建时把 ```mermaid 代码块
 * 转成 <Mermaid> 组件，并自动向 VitePress 客户端 app 注册该组件，
 * 因此这里**不需要**再手动 app.component('Mermaid', ...)。
 */

import DefaultTheme from 'vitepress/theme'
import './style.css'

export default DefaultTheme
