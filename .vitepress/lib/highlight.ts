import { getHighlighter } from 'shiki'

const languages = [
  {
    id: 'wolfram',
    scopeName: 'source.wolfram',
    grammar: import('./languages/wolfram.tmLanguage.json'),
    aliases: ['wl'],
  },
  {
    id: 'latex-expl3',
    scopeName: 'text.tex.latex.expl3',
    grammar: import('./languages/LaTeX-Expl3.tmLanguage.json'),
  },
]

// See https://github.com/vuejs/vitepress/issues/1067
export const highlight = async () => {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
  })

  // @ts-ignore
  languages.forEach(highlighter.loadLanguage)

  const preRE = /^<pre.*?>/
  const vueRE = /-vue$/
  return (str: string, lang: string) => {
    const vPre = vueRE.test(lang) ? '' : 'v-pre'
    lang = lang.replace(vueRE, '')
    const codeToHtml = (theme: string, className: string) =>
      highlighter
        .codeToHtml(str, { lang, theme })
        .replace(preRE, `<pre ${vPre}>`)
        .replace(/^<pre/, `<pre class="${className}"`)
    return codeToHtml('github-light', 'vp-code-light') + codeToHtml('github-dark', 'vp-code-dark')
  }
}
