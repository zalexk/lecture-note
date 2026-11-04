/**
 * 划选复制时，把公式还原成 LaTeX。
 *
 * 背景：`config.mts` 把 KaTeX 切成了 `output: 'html'`（去掉 MathML 那一半，省 29% 的
 * DOM 节点），连带 `<annotation>` 里的 LaTeX 源码也没了。于是浏览器默认复制出来的是
 * KaTeX 的视觉拆字：`\bar{X}\pm z_{\alpha/2}\frac{s}{\sqrt{n}}` 会变成
 * `Xˉ ±z α/2 n s` —— 分式与根号的结构信息全丢，粘出去没法用。
 *
 * 做法：
 *   1. 构建期给每个公式挂 `data-tex="<原始 LaTeX>"`（见 config.mts，一个属性 = 1 个节点，
 *      相比保留整棵 MathML 子树便宜得多）；
 *   2. 运行期接管 `copy` 事件：把选区克隆两份，在克隆体里用 `$...$` 替换掉公式节点，
 *      分别写进剪贴板的 `text/plain` 与 `text/html`。
 *
 * ⚠️ 为什么必须自己写 `text/html`（2026-11-04 实测）：
 * 一旦对 `copy` 事件调用 `preventDefault()`，浏览器默认的写入会被**整个**取消，
 * 包括 `text/html`。实测剪贴板格式：
 *   - 命中拦截（选区含公式）→ `["text/plain"]`，粘到 Word / 飞书只剩纯文本，
 *     段落、加粗、列表全丢；
 *   - 未命中（选区不含公式）→ `["text/plain","text/html"]`，富文本照旧。
 * 所以这里补一份 `text/html`：公式位置换成 `$...$` 纯文本（KaTeX 的标记离开
 * katex.css 在 Word 里本来就是散的，不如直接给 LaTeX 源码），其余结构原样保留。
 *
 * 选区里没有公式时直接 return，不干预普通复制。
 */

const COPY_EVENT = 'copy'

/** 剪贴板纯文本里的公式写法：块级用 `$$`，行内用 `$` */
function toTexSnippet(el: Element): string {
  const tex = el.getAttribute('data-tex') ?? ''
  const isDisplay = el.closest('.katex-display') !== null
  return isDisplay ? `\n$$\n${tex}\n$$\n` : `$${tex}$`
}

/** 剪贴板 HTML 里的公式写法：换行在 HTML 里会被折叠，改用 <br> 撑开 */
function toTexHtml(el: Element): string {
  const tex = escapeHtml(el.getAttribute('data-tex') ?? '')
  const isDisplay = el.closest('.katex-display') !== null
  return isDisplay ? `<br>$$<br>${tex}<br>$$` : `$${tex}$`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * 克隆当前选区，并把其中每个带 `data-tex` 的公式换成 `render()` 的结果。
 * 复制两次选区是因为两种格式需要不同的替换产物，不能共用一份克隆体。
 */
function rewriteSelection(range: Range, render: (el: Element) => string, asHtml: boolean) {
  const fragment = range.cloneContents()
  const formulas = fragment.querySelectorAll('.katex[data-tex]')
  if (formulas.length === 0) return null

  formulas.forEach((el) => {
    if (asHtml) {
      // 用临时容器把 <br> 之类的标记解析成真节点，再整体替换
      const holder = document.createElement('span')
      holder.innerHTML = render(el)
      el.replaceWith(...Array.from(holder.childNodes))
    } else {
      el.replaceWith(document.createTextNode(render(el)))
    }
  })

  if (!asHtml) return fragment.textContent ?? ''

  const holder = document.createElement('div')
  holder.appendChild(fragment)
  return holder.innerHTML
}

export function installCopyTex(): void {
  if (typeof document === 'undefined') return

  document.addEventListener(COPY_EVENT, (event) => {
    const e = event as ClipboardEvent
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return

    const clipboard = e.clipboardData
    if (!clipboard) return

    const range = selection.getRangeAt(0)

    // 先探一下有没有公式：没有就放行，让浏览器按默认方式写剪贴板
    if (!range.cloneContents().querySelector('.katex[data-tex]')) return

    const plain = rewriteSelection(range, toTexSnippet, false)
    const html = rewriteSelection(range, toTexHtml, true)
    if (plain === null) return

    clipboard.setData('text/plain', plain)
    if (html !== null) clipboard.setData('text/html', html)
    e.preventDefault()
  })
}
