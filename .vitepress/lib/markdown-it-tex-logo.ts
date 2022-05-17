import MarkdownIt from 'markdown-it';
import StateInline from 'markdown-it/lib/rules_inline/state_inline';
import Token from 'markdown-it/lib/token';

const span = (className, e) => `<span class="tex-logo-${className}">${e}</span>`;

const TEX = `T${span('e', 'e')}X`;
const LA = `L${span('a', 'a')}`;
const LATEX = LA + TEX;
const E_ = `${span('epsilon', '&epsilon;')}${span('rkern', '-')}`;
const TWO_E = `2${span('two-e-epsilon', '&epsilon;')}`;
const TEX_LOGO = {
  TeX: TEX,
  LaTeX: LATEX,
  LaTeXe: `${LATEX}&thinsp;${TWO_E}`,
  LaTeX3: `${LATEX}3`,
  '(La)TeX': `${span('rkern', '(')}${LA}${span('rparen-kern', ')')}${TEX}`,
  ConTeXt: `Co${span('rkern', 'n')}&shy;${TEX}t`,
  eTeX: `${E_}${TEX}`,
  pdfTeX: `pdf&shy;${TEX}`,
  pdfLaTeX: `pdf&shy;${LATEX}`,
  XeTeX: `X&#x2060;${span('xe-e xe-e-kern', 'e')}&#x2060;${TEX}`,
  XeLaTeX: `X&#x2060;${span('xe-e', 'e')}${LATEX}`,
  LuaTeX: `Lu${span('rkern', 'a')}&shy;${TEX}`,
  LuaHBTeX: `LuaHB&shy;${TEX}`,
  LuaLaTeX: `Lua&shy;${LATEX}`,
  pTeX: `${span('rkern', 'p')}${TEX}`,
  pLaTeX: `p${LATEX}`,
  upTeX: `u${span('rkern', 'p')}&shy;${TEX}`,
  upLaTeX: `up&shy;${LATEX}`,
  ApTeX: `A${span('rkern', 'p')}&shy;${TEX}`,
  BibTeX: `B${span('bib-ib rkern', 'ib')}${TEX}`,
  CTeX: `C${TEX}`,
  MacTeX: `Ma${span('rkern', 'c')}&shy;${TEX}`,
  MiKTeX: `MiK&shy;${TEX}`,
  '2e': TWO_E,
};

const TEX_LOGO_PATTERN = new RegExp(
  `^(${Object.keys(TEX_LOGO)
    .join('|')
    .replace(/([\(\)])/g, '\\$1')})\\b`
);

const parseTexLogo = (state: StateInline, silent: boolean) => {
  if (state.src[state.pos] !== '\\' || state.pos + 1 >= state.posMax) return false;

  state.pos += 1;
  const match = state.src.slice(state.pos).match(TEX_LOGO_PATTERN);

  if (!match) return false;

  const content = match[0];
  let token = state.push('tex_logo_open', 'span', 1);
  token.attrPush(['class', 'tex-logo']);

  token = state.push('tex_logo_text', '', 0);
  token.content = content;

  token = state.push('tex_logo_close', 'span', -1);
  state.pos += content.length;

  return true;
};

const texLogoRenderer = (tokens: Token[], idx: number) => {
  const content = tokens[idx].content;
  return TEX_LOGO[content] || content;
};

const plugin = (md: MarkdownIt) => {
  md.inline.ruler.before('escape', 'tex_logo', parseTexLogo);
  md.renderer.rules['tex_logo_text'] = texLogoRenderer;
};

export default plugin;
