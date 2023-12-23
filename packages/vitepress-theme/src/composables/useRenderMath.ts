import katex from 'katex'
import { onContentUpdated } from 'vitepress'

export const useRenderMath = () => {
  const renderMath = () => {
    const macros = {}
    const renderToString = (tex: string | null, displayMode: boolean) =>
      katex.renderToString(tex || '', {
        throwOnError: true,
        displayMode,
        macros,
      })
    document.querySelectorAll('[data-math]').forEach((el) => {
      el.outerHTML =
        el.tagName === 'DIV'
          ? `<p>${renderToString(el.textContent, true)}</p>`
          : renderToString(el.textContent, false)
    })
  }

  onContentUpdated(renderMath)
}
