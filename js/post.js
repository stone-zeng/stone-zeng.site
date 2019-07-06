'use strict';

(function (d) {
  // Add hash-tags
  const headers         = d.querySelectorAll('#content h2, #content h3, #content h4');
  const headerPositions = Array.from(headers).map((e) =>
    e.getBoundingClientRect().top + window.pageYOffset - e.ownerDocument.documentElement.clientTop);
  headers.forEach((e) => {
    e.innerHTML += `<a href='#${e.id}' class='hash-tag'>#</a>`;
    e.onmouseover = () => e.querySelector('.hash-tag').classList = 'hash-tag visible';
    e.onmouseout  = () => e.querySelector('.hash-tag').classList = 'hash-tag';
  });
  // Dynamic sidebar
  const sidebarHeader = (i) => 'sidebar-header-' + i.toString();
  const getHeaderIndex = (pos) => {
    for (let i = 0; i < headerPositions.length; i++) if (headerPositions[i] > pos) return i - 1;
    return headerPositions.length - 1;
  };
  d.querySelectorAll('#sidebar-ul a').forEach((e, i) => e.id = sidebarHeader(i));
  window.onscroll = () => {
    d.querySelectorAll('#sidebar-ul a').forEach((e) => e.className = 'inactive');
    const headerIndex = getHeaderIndex(window.pageYOffset);
    if (headerIndex >= 0) d.getElementById(sidebarHeader(headerIndex)).className = 'active';
  };
})(document);
