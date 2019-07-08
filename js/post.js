'use strict';

(function () {
  const headers = document.querySelectorAll('#content h2, #content h3, #content h4');
  addHashTags(headers);
  updateSidebar(headers);
  updateFootnotes();
})();

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
  const footnoteList  = document.querySelector('.footnotes');
  if (!(footnoteList === null)) {
    const footnoteItems = getFootnotesItems(footnoteList.querySelectorAll('li'));
    footnoteList.remove();
    updateFnref(footnoteItems);
    updateFnlist(footnoteItems);
  }
}

function getFootnotesItems(li) {
  const footnotes = Array.from(li).reduce((obj, e) => (obj[e.id] = e, obj), {});
  const makeBackref = (href, count) => {
    if (count === 1) {
      return `<span class="backref"><a href="#${href}">^</a></span>`;
    } else {
      const hrefList = [href].concat(Array.from({length: count-1}, (_, i) => `${href}:${i+1}`))
          .map((e, i) => `<a href="#${e}">${String.fromCharCode(97+i)}</a>`);
      return `<span class="backref">${hrefList.join('')}</span>`;
    }
  };
  const newFootnotes = {};
  for (const [id, val] of Object.entries(footnotes)) {
    const text = val.innerHTML.match(/<p>(.+?)&nbsp;<a href="#(.+?)"/)[1];
    const hrefCount = val.querySelectorAll('a.reversefootnote').length;
    newFootnotes[id] = {
      text: text,
      HTML: `<li id="${id}">${makeBackref(id.replace('fn:', 'fnref:'), hrefCount)}${text}</li>`,
    };
  }
  return newFootnotes;
}

function updateFnref(footnoteItems) {
  const makeFnref = (sup, href, num, tooltip) =>
    `<sup${sup} class="fnref">` +
      `<a href="#${href}">[${num}]</a>` +
      `<div class="tooltip">${tooltip}</div>` +
    `</sup>`;
  document.querySelectorAll('sup[id^="fnref:"]').forEach((e) => {
    e.outerHTML = e.outerHTML.replace(
        /<sup(.+?)><a href="#(.+?)"(.+?)>(.+?)<\/a><\/sup>/g,
        (_, p1, p2, p3, p4) => makeFnref(p1, p2, p4, footnoteItems[p2].text));
  });
}

function updateFnlist(footnoteItems) {
  document.querySelector('#footnotes').innerHTML =
    `<ol>${Object.values(footnoteItems).map((e) => e.HTML).join('')}</ol>`;
}
