'use strict';

// Helper functions
const nodeListToObject = (nodeList) =>
  Array.from(nodeList).reduce((obj, e) => (obj[e.id] = e, obj), {});

const TeXLogoPatternH1 =
  /((?:e|pdf|Xe|Lua|p|up|Ap)*(?:La)*TeX[3e]*|(?:\(La\)|Bib|C|LuaHB|Mac|MiK)TeX|ConTeXt|2e)/g;
const TeXLogoPattern = new RegExp(`\\\$\\\\+${TeXLogoPatternH1.source}\\\$`, 'g');

(function () {
  updateMeta();
  updateDescription();
  if (document.querySelector('.post-sidebar') === null) {
    updatePunctLogo();
  } else {
    // Posts.
    const headers = document.querySelectorAll('#content h2, #content h3, #content h4');
    wordCount();
    addHashTags(headers);
    updateSidebar(headers);
    updateFootnotes();
    updatePunctLogo();
    updateTable();
    updateHighlight();
    document.addEventListener('DOMContentLoaded', () => {
      updateMath();
      updateImage();
    });
    fixHash();
  }
})();

function updateMeta() {
  document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach(
      (e) => e.content = e.content.replace(TeXLogoPattern, '$1'));
  document.querySelectorAll('script[type="application/ld+json"]').forEach(
      (e) => e.innerHTML = e.innerHTML.replace(TeXLogoPattern, '$1'));
}

function updateDescription() {
  document.querySelectorAll('.post-list li p').forEach((e) => {
    e.innerHTML = e.innerHTML.replace(/`(.+?)`/g, '<code class="highlighter-rouge">$1</code>');
  });
}

function updatePunctLogo() {
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
    'ConTeXt':  `Co${span('rkern', 'n')}&shy;${TEX}t`,
    'eTeX':     `${E_}${TEX}`,
    'pdfTeX':   `pdf&shy;${TEX}`,
    'pdfLaTeX': `pdf&shy;${LATEX}`,
    'XeTeX':    `X&#x2060;${span('xe-e xe-e-kern', 'e')}&#x2060;${TEX}`,
    'XeLaTeX':  `X&#x2060;${span('xe-e', 'e')}${LATEX}`,
    'LuaTeX':   `Lu${span('rkern', 'a')}&shy;${TEX}`,
    'LuaHBTeX': `LuaHB&shy;${TEX}`,
    'LuaLaTeX': `Lua&shy;${LATEX}`,
    'pTeX':     `${span('rkern', 'p')}${TEX}`,
    'pLaTeX':   `p${LATEX}`,
    'upTeX':    `u${span('rkern', 'p')}&shy;${TEX}`,
    'upLaTeX':  `up&shy;${LATEX}`,
    'ApTeX':    `A${span('rkern', 'p')}&shy;${TEX}`,
    'BibTeX':   `B${span('bib-ib rkern', 'ib')}${TEX}`,
    'CTeX':     `C${TEX}`,
    'MacTeX':   `Ma${span('rkern', 'c')}&shy;${TEX}`,
    'MiKTeX':   `MiK&shy;${TEX}`,
    '2e':       TWO_E,
  };
  const replacePunct = (str) =>
    str .replace(/(——|……)/g, span('zh-punct', '$1'))
        .replace(/([）』」》〉】])([，、：；。！？（『「《〈【])/g,
            span('zh-punct-kern', '$1') + '$2')
        .replace(/([，、：；。！？])([（『「《〈【])/g,
            span('zh-punct-kern', '$1') + '$2')
        .replace(/([，、：；。！？）』」》〉】])(<sup)/g,
            span('zh-punct-kern', '$1') + '$2')
        .replace(/([，、：；。！？）』」》〉】])(<a href=".+">[（『「《〈【])/g,
            span('zh-punct-kern', '$1') + '$2')
        .replace(/^([（『「《〈【])/g,
            span('zh-punct-bound', '$1'))
        .replace(/(\^<\/a><\/span><a href=".+">|<li>)([（『「《〈【])/g,
            '$1' + span('zh-punct-bound', '$2'))
        // No-break thin space
        // `\<space>` -> `\u2060\u2009\u2060`
        // U+2060: Word joiner, U+2009: Thin space
        .replace(/\\ /g, '\u2060\u2009\u2060');
  const replaceLogo = (str) =>
    str.replace(TeXLogoPattern, (_, name) => span('tex-logo', LOGO[name]));
  const replaceLogoH1 = (str) =>
    str.replace(TeXLogoPatternH1, (_, name) => span('tex-logo', LOGO[name]));
  document.querySelectorAll('h2, h3, h4, p, li, figcaption, td, th').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogo(e.innerHTML)));
  document.querySelectorAll('h1, .post-navigation').forEach((e) =>
    e.innerHTML = replacePunct(replaceLogoH1(e.innerHTML)));
}

function wordCount() {
  let count = 0;
  document.querySelector('#post-content').innerText
      // eslint-disable-next-line max-len
      .split(/\s+|\[\d+\]|[，。．；：、！？–—…（）《》【】「」\,\.\;\:\!\?\-\\\/\(\)\[\]\{\}\<\>\@\#\$\%\^\&\*\+\=\_]/g)
      .filter((e) => e !== '')
      .forEach((e) => {
        if (e.toLowerCase() !== e.toUpperCase() || e.replace(/\d/g, '') === '') {
          count++;
        } else {
          count += e.length;
        }
      });
  const countStr = (count / 1000).toFixed(1) + '&thinsp;k';
  document.querySelector('#word-count-placeholder').innerHTML = countStr;
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
  if (oldFnList !== null) {
    const newFnList = document.querySelector('#footnotes');
    const fnItems = getFnItems(oldFnList, newFnList);
    oldFnList.remove();
    updateFnref(fnItems);
    updateFnlist(fnItems);
  }
}

function getFnItems(oldFnList, newFnList) {
  const fn = nodeListToObject(oldFnList.querySelectorAll('li[id^="fn:"]'));
  if (newFnList.innerHTML !== '') {
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
      `<span class="tooltip">${tooltip}</span>` +
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

function updateTable() {
  document.querySelectorAll('table').forEach((e) => {
    e.outerHTML = `<div class="table-wrapper">${e.outerHTML}</div>`;
  });
}

function updateHighlight() {
  document.querySelectorAll('pre:not(.highlight)').forEach((e) => {
    if (e.firstElementChild.className === 'language-_wl') {
      e.outerHTML = `<div class="language-wl highlighter-rouge"><div class="highlight">` +
        `<pre class="highlight"><code>${parseWolframLang(e.textContent)}</code></pre>` +
        `</div></div>`;
    }
  });
}

function updateMath() {
  // Kramdown will use MathJax by default.
  if (typeof katex !== 'undefined') {
    document.querySelectorAll('script[type="math/tex; mode=display"]').forEach((e) => {
      e.outerHTML = `$$\n${e.innerHTML.replace(/(\% <\!\[CDATA\[\n|\%\]\]>)/g, '')}\n$$`;
    });
    renderMathInElement(document.body, {
      delimiters: [
        {left: '\\[', right: '\\]', display: true},
        {left: '$', right: '$', display: false},
      ],
    });
    document.querySelectorAll('.katex-html').forEach((e) => {
      if (e.textContent === '') e.remove();
    });
  }
}

function updateImage() {
  if (typeof mediumZoom !== 'undefined') {
    mediumZoom('img:not(.tikz-cd)', {margin: 30, background: 'var(--bg-color)'});
  }
}

function fixHash() {
  // https://stackoverflow.com/a/17535094/
  const offsetAnchor = () => {
    if (location.hash.length !== 0) {
      window.scrollTo(window.scrollX, window.scrollY - 60);
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach((e) =>
    e.addEventListener('click', (event) => window.setTimeout(() => offsetAnchor(), 0)),
  );
  window.setTimeout(offsetAnchor, 0);
}
