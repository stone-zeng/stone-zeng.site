import type MarkdownIt from 'markdown-it'

const plugin = (md: MarkdownIt) => {
  const text = md.renderer.rules.text!
  md.renderer.rules.text = (...args) =>
    text(...args).replace(
      /(\p{Ideo})([（［〈《「『【〔〖〘])/gu,
      '<span class="cjk-kern">$1</span>$2',
    )

  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) =>
    fence(...args).replace(
      /([\p{Ideo}\u2E80-\u312F\uFF00-\uFFEF]+)/gu,
      '<span class="cjk-code">$1</span>',
    )
}

export default plugin
