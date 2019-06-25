"use strict";

var headers = document.querySelectorAll("#content h2, #content h3, #content h4");
headers.forEach((e) => { e.innerHTML += `<a href="#${e.id}" class="hash-tag">#</a>`; });
headers.forEach((e) => {
  e.onmouseover = () => { e.querySelector(".hash-tag").classList = "hash-tag visible"; };
  e.onmouseout  = () => { e.querySelector(".hash-tag").classList = "hash-tag"; };
});

var headerPositions = Array.from(headers).map((e) =>
  e.getBoundingClientRect().top + window.pageYOffset - e.ownerDocument.documentElement.clientTop);

function sidebarHeader(i) { return "sidebar-header-" + i.toString(); }
document.querySelectorAll("#sidebar-ul a").forEach((e, i) => { e.id = sidebarHeader(i); });

function getHeaderIndex(pos) {
  for (var i = 0; i < headerPositions.length; i++) {
    if (headerPositions[i] > pos) { return i - 1; }
  }
  return headerPositions.length - 1;
}

window.onscroll = function() {
  document.querySelectorAll("#sidebar-ul a").forEach((e) => { e.className = "inactive"; });
  var headerIndex = getHeaderIndex(window.pageYOffset);
  if (headerIndex >= 0) {
    document.getElementById(sidebarHeader(headerIndex)).className = "active";
  }
};
