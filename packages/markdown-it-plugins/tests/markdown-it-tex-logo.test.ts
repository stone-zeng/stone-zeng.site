import { test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'

import MarkdownItTeXLogo from '../src/tex-logo'

const md = new MarkdownIt()
md.use(MarkdownItTeXLogo)

const logos = String.raw`
- \TeX
- \LaTeX
- \LaTeXe
- \LaTeX3
- \\(La)TeX
- \ConTeXt
- \eTeX
- \pdfTeX
- \pdfLaTeX
- \XeTeX
- \XeLaTeX
- \LuaTeX
- \LuaHBTeX
- \LuaLaTeX
- \pTeX
- \pLaTeX
- \upTeX
- \upLaTeX
- \ApTeX
- \BibTeX
- \CTeX
- \MacTeX
- \MiKTeX
- \2e
`

test('Logos', () => {
  expect(md.render(logos)).toMatchSnapshot()
})

test('Logos in list', () => {
  expect(
    md.render(String.raw`
- [\TeX](https://www.latex-project.org) and \TeX and \LaTeX
- *\pdfTeX*
  - Happy \`TeX\`ing!
  - Happy \TeX\ing!
  - Happy \2e!
  - Happy **\\(La)TeX!**
`),
  ).toMatchSnapshot()
})
