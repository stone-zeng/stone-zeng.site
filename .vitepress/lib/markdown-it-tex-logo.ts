import type MarkdownIt from 'markdown-it'

const span = (className: string, el: string) => `<span class="${className}">${el}</span>`

const _TEX = `T${span('tex-e', 'e')}X`
const _LA = `L${span('la-a', 'a')}`
const _E = span('epsilon', '&epsilon;') + span('rkern', '-')
const TEX = span('tex-logo shy', _TEX)
const LATEX = span('tex-logo shy', _LA + _TEX)
const TWO_E = span('tex-logo shy', '2' + span('two-e-epsilon', '&epsilon;'))

const texLogo = {
  TeX: TEX,
  LaTeX: LATEX,
  // LaTeXe: `${LATEX}&thinsp;${TWO_E}`,
  LaTeX3: `${LATEX}3`,
  '(La)TeX': span('tex-logo', `(${_LA})`) + TEX,
  ConTeXx: `Con${TEX}t`,
  // eTeX: span('tex-logo', _E) + span('tex-logo', _TEX),
  pdfTeX: `pdf${TEX}`,
  pdfLaTeX: `pdf${LATEX}`,
  XeTeX: span('tex-logo', 'X' + span('xe-e xe-e-kern', 'e')) + span('tex-logo', _TEX),
  XeLaTeX: span('tex-logo', 'X' + span('xe-e', 'e')) + LATEX,
  LuaTeX: `Lua${TEX}`,
  LuaHBTeX: 'Lua' + span('tex-logo shy', 'HB') + TEX,
  LuaLaTeX: `Lua${LATEX}`,
  pTeX: 'p' + span('tex-logo', _TEX),
  pLaTeX: 'p' + span('tex-logo', _LA + _TEX),
  upTeX: `up${TEX}`,
  upLaTeX: `up${LATEX}`,
  ApTeX: `Ap${TEX}`,
  BibTeX: span('tex-logo', 'B' + span('bib-ib', 'ib')) + TEX,
  CTeX: 'C' + span('tex-logo', _TEX),
  MacTeX: `Mac${TEX}`,
  MiKTeX: `MiK${TEX}`,
  // '2e': TWO_E,
}

const texLogoPattern = new RegExp(
  `\\\\(${Object.keys(texLogo)
    .join('|')
    .replace(/([\(\)])/g, '\\$1')})\\b`,
  'g',
)

const plugin = (md: MarkdownIt) => {
  const text = md.renderer.rules.text!
  md.renderer.rules.text = (...args) =>
    text(...args).replace(texLogoPattern, (_, m) => texLogo[m as keyof typeof texLogo])
}

export default plugin
