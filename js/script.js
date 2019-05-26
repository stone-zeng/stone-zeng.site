const TEX_LOGO     = 'T<span class="e">e</span>X';
const __LA         = 'L<span class="a">a</span>';
const LATEX_LOGO   = __LA + TEX_LOGO;
const __2_EPSILON  = '2<span class="epsilon">ε<span>';
const TEX_LOGO_MAP = new Map([
  ['TeX',      TEX_LOGO],
  ['LaTeX',    LATEX_LOGO],
  ['LaTeXe',   LATEX_LOGO + ' ' + __2_EPSILON],
  ['LaTeX3',   LATEX_LOGO + '3'],
  ['(La)TeX',  '<span class="rkern">(</span>' + __LA + '<span class="rparen-kern">)</span>' + TEX_LOGO],
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
  ['2e',       __2_EPSILON],
]);
var tex_logo = document.getElementsByClassName("tex-logo");
for (var i = 0; i < tex_logo.length; i++) {
  var logo_replaced = TEX_LOGO_MAP.get(tex_logo[i].textContent);
  if (logo_replaced) {
    tex_logo[i].innerHTML = '<span style="color: blue;">' + logo_replaced + '</span>';
    tex_logo[i].innerHTML = logo_replaced;
  }
}
