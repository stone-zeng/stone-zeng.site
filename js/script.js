const TEX_LOGO     = 'T<span class="e">e</span>X';
const LATEX_LA     = 'L<span class="a">a</span>';
const LATEX_LOGO   = LATEX_LA + TEX_LOGO;
const LATEX_2E     = '2<span class="epsilon">ε</span>';
const TEX_LOGO_MAP = new Map([
  ['TeX',      TEX_LOGO],
  ['LaTeX',    LATEX_LOGO],
  ['LaTeXe',   LATEX_LOGO + ' ' + LATEX_2E],
  ['LaTeX3',   LATEX_LOGO + '3'],
  ['(La)TeX',  '<span class="rkern">(</span>' + LATEX_LA + '<span class="rparen-kern">)</span>' + TEX_LOGO],
  ['ConTeXt',  'Co<span class="rkern">n</span>' + TEX_LOGO + 't'],
  ['pdfTeX',   'pdf' + TEX_LOGO],
  ['pdfLaTeX', 'pdf' + LATEX_LOGO],
  ['XeTeX',    'X<span class="xe-e xe-e-kern">e</span>' + TEX_LOGO],
  ['XeLaTeX',  'X<span class="xe-e">e</span>' + LATEX_LOGO],
  ['LuaTeX',   'Lu<span class="rkern">a</span>' + TEX_LOGO],
  ['LuaLaTeX', 'Lua' + LATEX_LOGO],
  ['upTeX',    'u<span class="rkern">p</span>' + TEX_LOGO],
  ['upLaTeX',  'up' + LATEX_LOGO],
  ['ApTeX',    'A<span class="rkern">p</span>' + TEX_LOGO],
  ['CTeX',     'C' + TEX_LOGO],
  ['2e',       LATEX_2E],
]);
const ZH_PUNCT_MAP = ([
  [/([，、：；。！？])([（「《])/g,                         '<span class="zh-punct-kern">$1</span>$2'],
  [/([）」》])([，、：；。！？]|<span class="zh-punct">)/g, '<span class="zh-punct-kern">$1</span>$2'],
  [/([）」》])([（「《])/g,                                 '<span class="zh-lrpunct-kern">$1</span>$2'],
  [/^[（「《]/g,                                            '<span class="zh-punct-bound">$1</span>'],
]);

function tex_logo_replacer(match, name, offset, string) {
  return '<span class="tex-logo">' + TEX_LOGO_MAP.get(name) + '</span>';
}

var elements = document.body.querySelectorAll(
  "h1, h2, h3, h4, p, ul, ol, dl, blockquote, figure, table");
for (var i = 0; i < elements.length; i++) {
  elements[i].innerHTML = elements[i].innerHTML.replace(
    /\$((?:pdf|Xe|Lua|up|Ap)*(?:La)*TeX[3e]*|\(La\)TeX|ConTeXt|CTeX|2e)\$/g, tex_logo_replacer);
  for (var j in ZH_PUNCT_MAP) {
    elements[i].innerHTML = elements[i].innerHTML.replace(
      ZH_PUNCT_MAP[j][0], ZH_PUNCT_MAP[j][1]);
  }
}

var h1_elements = document.body.querySelectorAll("h1");
for (var i = 0; i < elements.length; i++) {
  elements[i].innerHTML = elements[i].innerHTML.replace(
    /((?:pdf|Xe|Lua|up|Ap)*(?:La)*TeX[3e]*|\(La\)TeX|ConTeXt|CTeX|2e)/g, tex_logo_replacer);
}
