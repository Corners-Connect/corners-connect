/* ───────────────────────────────────────────────────────────────────────────
   nav.js — the rail.

   Collapsed it is a 56 px strip of icons. Hovered it slides open and floats
   over the page, because that is a glance and nobody is reading underneath.
   PINNED it pushes the page instead, because a pinned bar that covers half the
   screen is worse than no bar at all. Key B pins it, and it is remembered.

   On a phone it becomes a bar along the bottom, which is where a thumb is.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
"use strict";

var I = {
  today:   "M12 3v2m0 14v2m9-9h-2M5 12H3m14.5-6.5l-1.4 1.4M7.9 16.1l-1.4 1.4m0-11.9l1.4 1.4m8.2 8.2l1.4 1.4M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  close:   "M9 12.5l2.2 2.2L15.5 10M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  pdca:    "M20 11.5A8 8 0 006.3 6.3L4 8.5M4 12.5a8 8 0 0013.7 5.2L20 15.5M4 4v4.5h4.5M20 20v-4.5h-4.5",
  activity:"M3 12h4l2.5-7 4 14 2.5-7h5",
  product: "M12 2.8l8 4.4v9.6l-8 4.4-8-4.4V7.2zM4.3 7.3L12 11.6l7.7-4.3M12 11.6V21",
  audience:"M4 9v6h3.5L13 19V5L7.5 9zm13.5-2a6 6 0 010 10M16 10a2.5 2.5 0 010 4",
  operations:"M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zm7.6-2a7.6 7.6 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 00-2-1.2L14.9 4h-4l-.4 2.5a7.6 7.6 0 00-2 1.2l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 000 2.4l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 002 1.2l.4 2.5h4l.4-2.5a7.6 7.6 0 002-1.2l2.3 1 2-3.4-2-1.5c.05-.4.08-.8.08-1.2z",
  cash:    "M3 17l5.5-5.5 3.5 3.5L21 6M21 6h-5m5 0v5",
  teams:   "M16.5 20v-1.6a3.4 3.4 0 00-3.4-3.4H6.4A3.4 3.4 0 003 18.4V20m13.9-16.2a3.4 3.4 0 010 6.6M21 20v-1.6a3.4 3.4 0 00-2.6-3.3M13.1 7.4a3.4 3.4 0 11-6.8 0 3.4 3.4 0 016.8 0z",
  mastery: "M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z",
  setup:   "M4 7h10m3 0h3M4 17h3m3 0h10M14 4.5v5M7 14.5v5"
};

var PAGES = [
  { g: "Every session" },
  { id: "today",      label: "Today", badge: true },
  { id: "close",      label: "The close" },
  { g: "The work" },
  { id: "pdca",       label: "PDCA" },
  { id: "activity",   label: "Activity" },
  { id: "cash",       label: "Cash flow" },
  { g: "Departments" },
  { id: "product",    label: "Product" },
  { id: "audience",   label: "Audience" },
  { id: "operations", label: "Operations" },
  { g: "The company" },
  { id: "teams",      label: "Teams" },
  { id: "mastery",    label: "Mastery" },
  { id: "setup",      label: "Setup" }
];

function icon(id){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '+
         'stroke-linecap="round" stroke-linejoin="round"><path d="'+(I[id]||"")+'"/></svg>';
}

var NAV = {};

NAV.build = function (go) {
  var riel = document.createElement("aside");
  riel.className = "riel";
  riel.innerHTML =
    '<a class="riel__marca" href="#today">' +
      '<span class="riel__mono">' +
        '<svg viewBox="-160 -160 320 320" aria-hidden="true">' +
          '<g transform="translate(-118 0)">' +
            '<path d="M 0 0 Q 118 -132 236 0 Q 118 132 0 0 Z" fill="#5A422F"/>' +
            '<circle cx="118" cy="0" r="30.4" fill="#A8DDFB"/></g></svg>' +
      '</span>' +
      '<span class="riel__logo"><b>CORNERS.</b>' +
        '<span class="riel__firma">the company board</span></span>' +
    '</a>' +
    '<nav class="riel__nav">' +
      '<a class="riel__it" href="city.html" title="Open Corners City">' + icon('product') + '<span class="riel__et">Corners City ↗</span></a>' +
      PAGES.map(function (p) {
        if (p.g) return '<span class="riel__grupo">' + p.g + '</span>';
        return '<button class="riel__it" data-go="' + p.id + '">' + icon(p.id) +
               '<span class="riel__et">' + p.label + '</span>' +
               (p.badge ? '<span class="riel__badge" id="navBadge"></span>' : '') + '</button>';
      }).join("") +
    '</nav>' +
    '<div class="riel__pie">' +
      '<span class="riel__sello" id="navSello" hidden title="The rows on this board are placeholders">' +
        '<i></i><span class="riel__et">Sample data</span></span>' +
    '</div>' +
    '<button class="riel__fijar" id="rielFijar" title="Keep it open (key B)" aria-label="Pin the rail">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M9 6l6 6-6 6"/></svg></button>';

  document.body.insertBefore(riel, document.body.firstChild);
  document.body.classList.add("con-riel");

  riel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (!b) return;
    location.hash = "#" + b.dataset.go;
    go(b.dataset.go);
  });

  var pin = function (v) {
    document.body.classList.toggle("riel-fijo", v);
    try { localStorage.setItem("dip-riel", v ? "1" : "0"); } catch (e) {}
  };
  var open = false;
  try { open = localStorage.getItem("dip-riel") === "1"; } catch (e) {}
  pin(open);
  document.getElementById("rielFijar").onclick = function () {
    pin(!document.body.classList.contains("riel-fijo"));
  };
  addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "b" || e.key === "B") pin(!document.body.classList.contains("riel-fijo"));
  });
};

NAV.paint = function (active, alarmCount) {
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.classList.toggle("on", b.dataset.go === active);
  });
  var badge = document.getElementById("navBadge");
  if (badge){ badge.textContent = alarmCount || ""; badge.hidden = !alarmCount; }
  var sello = document.getElementById("navSello");
  if (sello) sello.hidden = !(window.DIP && window.DIP.company && window.DIP.company.sample !== false);
};

window.NAV = NAV;
})();
