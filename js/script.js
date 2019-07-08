'use strict';

(function () {
  const span = (className, e) => `<span class="${className}">${e}</span>`;
  const TEX   = `T${span('e', 'e')}X`;
  const LA    = `L${span('a', 'a')}`;
  const LATEX = LA + TEX;
  const TWO_E = `2${span('epsilon', '&epsilon;')}`;
  const LOGO  = {
    'TeX':      TEX,
    'LaTeX':    LATEX,
    'LaTeXe':   `${LATEX}&thinsp;${TWO_E}`,
    'LaTeX3':   `${LATEX}3`,
    '(La)TeX':  `${span('rkern', '(')}${LA}${span('rparen-kern', ')')}${TEX}`,
    'ConTeXt':  `Co${span('rkern', 'n')}${TEX}t`,
    'pdfTeX':   `pdf${TEX}`,
    'pdfLaTeX': `pdf${LATEX}`,
    'XeTeX':    `X${span('xe-e xe-e-kern', 'e')}${TEX}`,
    'XeLaTeX':  `X${span('xe-e', 'e')}${LATEX}`,
    'LuaTeX':   `Lu${span('rkern', 'a')}${TEX}`,
    'LuaLaTeX': `Lua${LATEX}`,
    'upTeX':    `u${span('rkern', 'p')}${TEX}`,
    'upLaTeX':  `up${LATEX}`,
    'ApTeX':    `A${span('rkern', 'p')}${TEX}`,
    'CTeX':     `C${TEX}`,
    '2e':       TWO_E,
  };
  const replacePunct = (str) =>
    str .replace(/(——|……)/g,                         span('zh-punct', '$1'))
        .replace(/([，、：；。！？])([（『「《〈])/g,    span('zh-punct-kern', '$1') + '$2')
        .replace(/([）』」》〉])([，、：；。！？])/g,    span('zh-punct-kern', '$1') + '$2')
        .replace(/([，、：；。！？）』」》〉])(<sup)/g,  span('zh-punct-kern', '$1') + '$2')
        .replace(/([）』」》〉])([（『「《])/g,          span('zh-lrpunct-kern', '$1') + '$2')
        .replace(/^([（『「《〈])/g,                     span('zh-punct-bound', '$1'));
  const replaceLogo = (str) =>
    str.replace(/\$((?:pdf|Xe|Lua|up|Ap)*(?:La)*TeX[3e]*|\(La\)TeX|ConTeXt|CTeX|2e)\$/g,
        (_, name) => span('tex-logo', LOGO[name]));
  const replaceLogoH1 = (str) =>
    str.replace(/((?:pdf|Xe|Lua|up|Ap)*(?:La)*TeX[3e]*|\(La\)TeX|ConTeXt|CTeX|2e)/g,
        (_, name) => span('tex-logo', LOGO[name]));
  document.body.querySelectorAll('h2, h3, h4, p, li, figcaption, td, th').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogo(e.innerHTML)));
  document.body.querySelectorAll('h1').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogoH1(e.innerHTML)));
})();
