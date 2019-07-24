'use strict';

// Helper functions
const nodeListToObject = (nodeList) =>
  Array.from(nodeList).reduce((obj, e) => (obj[e.id] = e, obj), {});

(function () {
  updatePunctLogo();

  // For posts only.
  if (!(document.querySelector('.post-sidebar') === null)) {
    const headers = document.querySelectorAll('#content h2, #content h3, #content h4');
    addHashTags(headers);
    updateSidebar(headers);
    updateFootnotes();
  }
})();

function updatePunctLogo(d) {
  const span = (className, e) => `<span class="${className}">${e}</span>`;
  const TEX   = `T${span('e', 'e')}X`;
  const LA    = `L${span('a', 'a')}`;
  const LATEX = LA + TEX;
  const E_    = `${span('epsilon', '&epsilon;')}${span('rkern', '-')}`;
  const TWO_E = `2${span('two-e-epsilon', '&epsilon;')}`;
  const LOGO  = {
    'TeX':      TEX,
    'LaTeX':    LATEX,
    'LaTeXe':   `${LATEX}&thinsp;${TWO_E}`,
    'LaTeX3':   `${LATEX}3`,
    '(La)TeX':  `${span('rkern', '(')}${LA}${span('rparen-kern', ')')}${TEX}`,
    'ConTeXt':  `Co${span('rkern', 'n')}${TEX}t`,
    'eTeX':     `${E_}${TEX}`,
    'pdfTeX':   `pdf${TEX}`,
    'pdfLaTeX': `pdf${LATEX}`,
    'XeTeX':    `X${span('xe-e xe-e-kern', 'e')}${TEX}`,
    'XeLaTeX':  `X${span('xe-e', 'e')}${LATEX}`,
    'LuaTeX':   `Lu${span('rkern', 'a')}${TEX}`,
    'LuaLaTeX': `Lua${LATEX}`,
    'pTeX':     `${span('rkern', 'p')}${TEX}`,
    'pLaTeX':   `p${LATEX}`,
    'upTeX':    `u${span('rkern', 'p')}${TEX}`,
    'upLaTeX':  `up${LATEX}`,
    'ApTeX':    `A${span('rkern', 'p')}${TEX}`,
    'BibTeX':   `B${span('bib-ib rkern', 'ib')}${TEX}`,
    'CTeX':     `C${TEX}`,
    'MacTeX':   `Ma${span('rkern', 'c')}${TEX}`,
    '2e':       TWO_E,
  };
  const replacePunct = (str) =>
    str .replace(/(——|……)/g,                         span('zh-punct', '$1'))
        .replace(/([，、：；。！？])([（『「《〈])/g,    span('zh-punct-kern', '$1') + '$2')
        .replace(/([）』」》〉])([，、：；。！？])/g,    span('zh-punct-kern', '$1') + '$2')
        .replace(/([，、：；。！？）』」》〉])(<sup)/g,  span('zh-punct-kern', '$1') + '$2')
        .replace(/([）』」》〉])([（『「《])/g,          span('zh-lrpunct-kern', '$1') + '$2')
        .replace(/^([（『「《〈])/g,                     span('zh-punct-bound', '$1'))
        // No-break thin space
        .replace(/\\,/g, '\u2060\u2009\u2060');
  const patternH1 =
    /((?:e|pdf|Xe|Lua|p|up|Ap)*(?:La)*TeX[3e]*|\(La\)TeX|ConTeXt|BibTeX|CTeX|MacTeX|2e)/g;
  const pattern = new RegExp(`\\\$${patternH1.source}\\\$`, 'g');
  const replaceLogo = (str) =>
    str.replace(pattern, (_, name) => span('tex-logo', LOGO[name]));
  const replaceLogoH1 = (str) =>
    str.replace(patternH1, (_, name) => span('tex-logo', LOGO[name]));
  document.querySelectorAll('h2, h3, h4, p, li, figcaption, td, th').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogo(e.innerHTML)));
  document.querySelectorAll('h1').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogoH1(e.innerHTML)));
}

function addHashTags(headers) {
  headers.forEach((e) => {
    e.innerHTML += `<a href='#${e.id}' class='hash-tag'>#</a>`;
    e.onmouseover = () => e.querySelector('.hash-tag').classList = 'hash-tag visible';
    e.onmouseout  = () => e.querySelector('.hash-tag').classList = 'hash-tag';
  });
}

function updateSidebar(headers) {
  const headerPositions = Array.from(headers).map((e) =>
    e.getBoundingClientRect().top + window.pageYOffset - e.ownerDocument.documentElement.clientTop);
  const sidebarHeader = (i) => 'sidebar-header-' + i.toString();
  const getHeaderIndex = (pos) => {
    for (let i = 0; i < headerPositions.length; i++) if (headerPositions[i] > pos) return i - 1;
    return headerPositions.length - 1;
  };
  document.querySelectorAll('#sidebar-ul a').forEach((e, i) => e.id = sidebarHeader(i));
  window.onscroll = () => {
    document.querySelectorAll('#sidebar-ul a').forEach((e) => e.className = 'inactive');
    const headerIndex = getHeaderIndex(window.pageYOffset);
    if (headerIndex >= 0) document.getElementById(sidebarHeader(headerIndex)).className = 'active';
  };
}

function updateFootnotes() {
  const oldFnList = document.querySelector('.footnotes');
  if (!(oldFnList === null)) {
    const newFnList = document.querySelector('#footnotes');
    const fnItems = getFnItems(oldFnList, newFnList);
    oldFnList.remove();
    updateFnref(fnItems);
    updateFnlist(fnItems);
  }
}

function getFnItems(oldFnList, newFnList) {
  const fn = nodeListToObject(oldFnList.querySelectorAll('li[id^="fn:"]'));
  if (!(newFnList.innerHTML === '')) {
    const replaceFn = nodeListToObject(newFnList.querySelectorAll('li[id^="fn:"]'));
    Object.keys(replaceFn).forEach((i) => fn[i] = replaceFn[i]);
  }
  const makeBackref = (href, count) => {
    if (count === 1) {
      return `<span class="backref"><a href="#${href}">^</a></span>`;
    } else {
      const hrefList = [href].concat(Array.from({length: count-1}, (_, i) => `${href}:${i+1}`))
          .map((e, i) => `<a href="#${e}">${String.fromCharCode(97+i)}</a>`);
      return `<span class="backref">${hrefList.join('')}</span>`;
    }
  };
  const newFn = {};
  for (const [id, val] of Object.entries(fn)) {
    const match = val.innerHTML.match(/<p>(.+?)&nbsp;<a href="#fnref(.+?)"/);
    const text = match === null ? val.innerHTML : match[1];
    const hrefCount = Math.max(1, val.querySelectorAll('a.reversefootnote').length);
    newFn[id] = {
      text: text,
      HTML: `<li id="${id}">${makeBackref(id.replace('fn:', 'fnref:'), hrefCount)}${text}</li>`,
    };
  }
  return newFn;
}

function updateFnref(fnItems) {
  const makeFnref = (sup, href, num, tooltip) =>
    `<sup${sup} class="fnref">` +
      `<a href="#${href}">[${num}]</a>` +
      `<div class="tooltip">${tooltip}</div>` +
    `</sup>`;
  document.querySelectorAll('sup[id^="fnref:"]').forEach((e) => {
    e.outerHTML = e.outerHTML.replace(
        /<sup(.+?)><a href="#(.+?)"(.+?)>(.+?)<\/a><\/sup>/g,
        (_, p1, p2, p3, p4) => makeFnref(p1, p2, p4, fnItems[p2].text));
  });
}

function updateFnlist(fnItems) {
  document.querySelector('#footnotes').innerHTML =
    `<ol>${Object.values(fnItems).map((e) => e.HTML).join('')}</ol>`;
}
