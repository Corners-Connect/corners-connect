(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function elem(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(id) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }

  /* ================= artwork =================
     Flat vector scenes, drawn here rather than photographed: published pages can't
     load outside images, and these stay sharp at any size. Swap for real photos later. */

  var SKY = { dawn: ["#dbeafe", "#f3e8ff"], day: ["#dbeafe", "#eff6ff"], warm: ["#ffe8d6", "#ffd9c0"], dusk: ["#e0e7ff", "#fbcfe8"] };

  function art(scene, w, h) {
    var svg = '<svg class="art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + (SCENES[scene] ? SCENES[scene].alt : scene) + '">';
    svg += (SCENES[scene] || SCENES.city).draw();
    return svg + "</svg>";
  }
  function sky(pair, id) {
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + pair[0] + '"/><stop offset="1" stop-color="' + pair[1] + '"/></linearGradient></defs>' +
      '<rect width="320" height="180" fill="url(#' + id + ')"/>';
  }
  var uidArt = 0;
  function gid() { return "g" + (uidArt++); }

  var SCENES = {
    guggenheim: { alt: "The Guggenheim museum beside the river in Bilbao", draw: function () {
      var g = gid();
      return sky(SKY.dawn, g) +
        '<path d="M0 118q40-26 84-16t70-4 62-18 104 8v92H0z" fill="#cbd5e1" opacity=".55"/>' +
        '<path d="M28 132c14-30 26-8 40-34s26 6 44-12 30 10 48-6 34 8 50-4 40 6 58-2v58H28z" fill="#e2e8f0"/>' +
        '<path d="M40 128c16-22 24-2 38-24s24 8 42-8 28 12 46-4 32 10 48 0 36 8 54 2v42H40z" fill="#f1f5f9"/>' +
        '<rect y="146" width="320" height="34" fill="#93c5fd"/>' +
        '<path d="M0 150h320v6H0z" fill="#bfdbfe" opacity=".7"/>' +
        '<path d="M150 146V96m-8 50V104m16 42v-34" stroke="#94a3b8" stroke-width="2"/>' +
        '<circle cx="262" cy="42" r="16" fill="#fde68a"/>';
    } },
    surf: { alt: "Surfers on the beach at Sopelana", draw: function () {
      var g = gid();
      return sky(SKY.warm, g) +
        '<circle cx="250" cy="52" r="22" fill="#fb923c" opacity=".85"/>' +
        '<path d="M0 104h320v76H0z" fill="#38bdf8"/>' +
        '<path d="M0 104q40 14 80 0t80 0 80 0 80 0v14H0z" fill="#7dd3fc"/>' +
        '<path d="M0 138q50 10 100 2t120 4 100-6v42H0z" fill="#0ea5e9"/>' +
        '<path d="M0 156q60 12 120 2t200 2v20H0z" fill="#fcd34d"/>' +
        '<ellipse cx="96" cy="150" rx="26" ry="5" fill="#fff" opacity=".8"/>' +
        '<path d="M206 118c8-16 18-16 24 0s-4 22-12 22-20-6-12-22z" fill="#f8fafc"/>' +
        '<path d="M60 128l14-24 6 3-14 24z" fill="#1f2937"/>';
    } },
    mountains: { alt: "Green hills and a walking path outside the city", draw: function () {
      var g = gid();
      return sky(SKY.day, g) +
        '<path d="M0 120l70-64 44 40 40-30 60 54 106-44v104H0z" fill="#86efac"/>' +
        '<path d="M70 56l44 40-22 22-46-30z" fill="#bbf7d0"/>' +
        '<path d="M0 132l60-24 70 22 90-20 100 26v44H0z" fill="#4ade80"/>' +
        '<path d="M0 156l80-14 90 12 150-10v36H0z" fill="#22c55e"/>' +
        '<path d="M150 180c10-30 40-40 44-70" stroke="#fef3c7" stroke-width="5" fill="none" stroke-dasharray="9 7"/>' +
        '<circle cx="54" cy="40" r="14" fill="#fff" opacity=".9"/><circle cx="72" cy="40" r="18" fill="#fff" opacity=".9"/>';
    } },
    campus: { alt: "A modern university campus building", draw: function () {
      var g = gid();
      return sky(SKY.day, g) +
        '<rect x="24" y="66" width="120" height="88" rx="6" fill="#e2e8f0"/>' +
        '<rect x="156" y="42" width="66" height="112" rx="6" fill="#cbd5e1"/>' +
        '<rect x="232" y="84" width="64" height="70" rx="6" fill="#e2e8f0"/>' +
        '<g fill="#60a5fa">' +
        '<rect x="36" y="78" width="22" height="16" rx="2"/><rect x="68" y="78" width="22" height="16" rx="2"/><rect x="100" y="78" width="22" height="16" rx="2"/>' +
        '<rect x="36" y="104" width="22" height="16" rx="2"/><rect x="68" y="104" width="22" height="16" rx="2"/><rect x="100" y="104" width="22" height="16" rx="2"/>' +
        '<rect x="166" y="56" width="18" height="14" rx="2"/><rect x="194" y="56" width="18" height="14" rx="2"/>' +
        '<rect x="166" y="82" width="18" height="14" rx="2"/><rect x="194" y="82" width="18" height="14" rx="2"/>' +
        '<rect x="166" y="108" width="18" height="14" rx="2"/><rect x="194" y="108" width="18" height="14" rx="2"/>' +
        '<rect x="244" y="98" width="18" height="14" rx="2"/><rect x="270" y="98" width="18" height="14" rx="2"/></g>' +
        '<rect y="154" width="320" height="26" fill="#a7f3d0"/>' +
        '<circle cx="300" cy="140" r="16" fill="#34d399"/><rect x="297" y="140" width="6" height="16" fill="#065f46"/>' +
        '<circle cx="18" cy="142" r="14" fill="#34d399"/><rect x="15" y="142" width="6" height="14" fill="#065f46"/>';
    } },
    oldtown: { alt: "Balconied houses in the old town", draw: function () {
      var g = gid();
      return sky(SKY.dusk, g) +
        '<g>' +
        '<rect x="10" y="54" width="52" height="126" fill="#fda4af"/>' +
        '<rect x="66" y="72" width="48" height="108" fill="#fdba74"/>' +
        '<rect x="118" y="46" width="54" height="134" fill="#fcd34d"/>' +
        '<rect x="176" y="66" width="50" height="114" fill="#a5b4fc"/>' +
        '<rect x="230" y="56" width="52" height="124" fill="#f9a8d4"/>' +
        '<rect x="286" y="78" width="34" height="102" fill="#fdba74"/></g>' +
        '<g fill="#1e293b" opacity=".65">' +
        '<rect x="20" y="72" width="12" height="18" rx="2"/><rect x="40" y="72" width="12" height="18" rx="2"/>' +
        '<rect x="20" y="104" width="12" height="18" rx="2"/><rect x="40" y="104" width="12" height="18" rx="2"/>' +
        '<rect x="76" y="90" width="12" height="18" rx="2"/><rect x="94" y="90" width="12" height="18" rx="2"/>' +
        '<rect x="128" y="64" width="14" height="20" rx="2"/><rect x="150" y="64" width="14" height="20" rx="2"/>' +
        '<rect x="128" y="100" width="14" height="20" rx="2"/><rect x="150" y="100" width="14" height="20" rx="2"/>' +
        '<rect x="186" y="84" width="12" height="18" rx="2"/><rect x="204" y="84" width="12" height="18" rx="2"/>' +
        '<rect x="240" y="74" width="14" height="20" rx="2"/><rect x="262" y="74" width="14" height="20" rx="2"/>' +
        '<rect x="294" y="96" width="14" height="18" rx="2"/></g>' +
        '<g fill="#fff" opacity=".55"><rect x="16" y="96" width="40" height="4" rx="2"/><rect x="124" y="90" width="44" height="4" rx="2"/><rect x="236" y="100" width="42" height="4" rx="2"/></g>' +
        '<rect y="164" width="320" height="16" fill="#334155" opacity=".18"/>';
    } },
    bridge: { alt: "A white footbridge over the river", draw: function () {
      var g = gid();
      return sky(SKY.dawn, g) +
        '<rect y="120" width="320" height="60" fill="#60a5fa"/>' +
        '<path d="M0 132q80 10 160 0t160 0v10H0z" fill="#93c5fd" opacity=".8"/>' +
        '<path d="M10 122q150-70 300-24" stroke="#f8fafc" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<path d="M22 124q140-56 276-18" stroke="#e2e8f0" stroke-width="3" fill="none"/>' +
        '<g stroke="#cbd5e1" stroke-width="1.6">' +
        '<path d="M60 108v14M100 96v22M140 88v30M180 84v36M220 86v36M260 92v32"/></g>' +
        '<rect x="0" y="118" width="320" height="6" fill="#f1f5f9"/>';
    } },
    plaza: { alt: "An arcaded square with café tables", draw: function () {
      var g = gid();
      return sky(SKY.warm, g) +
        '<rect x="0" y="40" width="320" height="94" fill="#fde9cf"/>' +
        '<g fill="#fff7ed">' +
        '<path d="M14 134V92a16 16 0 0132 0v42z"/><path d="M62 134V92a16 16 0 0132 0v42z"/><path d="M110 134V92a16 16 0 0132 0v42z"/>' +
        '<path d="M158 134V92a16 16 0 0132 0v42z"/><path d="M206 134V92a16 16 0 0132 0v42z"/><path d="M254 134V92a16 16 0 0132 0v42z"/></g>' +
        '<g fill="#b45309" opacity=".5"><rect x="20" y="52" width="16" height="22" rx="2"/><rect x="68" y="52" width="16" height="22" rx="2"/><rect x="116" y="52" width="16" height="22" rx="2"/><rect x="164" y="52" width="16" height="22" rx="2"/><rect x="212" y="52" width="16" height="22" rx="2"/><rect x="260" y="52" width="16" height="22" rx="2"/></g>' +
        '<rect y="134" width="320" height="46" fill="#e7d6bf"/>' +
        '<g fill="#0f766e"><circle cx="70" cy="150" r="9"/><circle cx="170" cy="154" r="9"/><circle cx="250" cy="150" r="9"/></g>' +
        '<g fill="#475569"><rect x="66" y="158" width="8" height="10"/><rect x="166" y="162" width="8" height="10"/><rect x="246" y="158" width="8" height="10"/></g>';
    } },
    stadium: { alt: "A football stadium lit at night", draw: function () {
      var g = gid();
      return sky(SKY.dusk, g) +
        '<ellipse cx="160" cy="130" rx="150" ry="52" fill="#e11d48" opacity=".14"/>' +
        '<path d="M40 138q120-52 240 0v22H40z" fill="#e2e8f0"/>' +
        '<path d="M56 136q104-42 208 0v10H56z" fill="#f8fafc"/>' +
        '<ellipse cx="160" cy="152" rx="86" ry="22" fill="#4ade80"/>' +
        '<ellipse cx="160" cy="152" rx="30" ry="9" fill="none" stroke="#f0fdf4" stroke-width="2"/>' +
        '<g stroke="#94a3b8" stroke-width="3"><path d="M52 120V86M268 120V86"/></g>' +
        '<g fill="#fef08a"><rect x="40" y="74" width="24" height="12" rx="3"/><rect x="256" y="74" width="24" height="12" rx="3"/></g>';
    } },
    city: { alt: "A city skyline", draw: function () {
      var g = gid();
      return sky(SKY.day, g) +
        '<g fill="#cbd5e1"><rect x="16" y="86" width="42" height="94"/><rect x="70" y="62" width="34" height="118"/><rect x="116" y="98" width="46" height="82"/><rect x="174" y="74" width="38" height="106"/><rect x="224" y="94" width="44" height="86"/><rect x="280" y="70" width="34" height="110"/></g>' +
        '<g fill="#60a5fa" opacity=".75"><rect x="24" y="96" width="10" height="12"/><rect x="40" y="96" width="10" height="12"/><rect x="78" y="74" width="10" height="12"/><rect x="88" y="96" width="10" height="12"/><rect x="126" y="110" width="10" height="12"/><rect x="142" y="110" width="10" height="12"/><rect x="182" y="86" width="10" height="12"/><rect x="196" y="108" width="10" height="12"/><rect x="234" y="106" width="10" height="12"/><rect x="250" y="106" width="10" height="12"/><rect x="288" y="82" width="10" height="12"/></g>' +
        '<rect y="164" width="320" height="16" fill="#94a3b8" opacity=".35"/>';
    } },
    pintxos: { alt: "Small plates on a bar counter", draw: function () {
      var g = gid();
      return sky(SKY.warm, g) +
        '<rect y="104" width="320" height="76" fill="#b45309" opacity=".2"/>' +
        '<rect y="118" width="320" height="10" fill="#92400e" opacity=".35"/>' +
        '<g><circle cx="60" cy="96" r="22" fill="#f8fafc"/><circle cx="60" cy="92" r="11" fill="#fca5a5"/>' +
        '<circle cx="130" cy="96" r="22" fill="#f8fafc"/><circle cx="130" cy="92" r="11" fill="#86efac"/>' +
        '<circle cx="200" cy="96" r="22" fill="#f8fafc"/><circle cx="200" cy="92" r="11" fill="#fcd34d"/>' +
        '<circle cx="270" cy="96" r="22" fill="#f8fafc"/><circle cx="270" cy="92" r="11" fill="#fdba74"/></g>' +
        '<g fill="#a16207"><rect x="58" y="70" width="3" height="16" rx="1.5"/><rect x="128" y="70" width="3" height="16" rx="1.5"/><rect x="198" y="70" width="3" height="16" rx="1.5"/><rect x="268" y="70" width="3" height="16" rx="1.5"/></g>';
    } }
  };

  /* Real photos where we have one (Wikimedia Commons, CC/CC0), the drawing otherwise. */
  var CITY_PHOTO = {
    bilbao: "bilbao_guggenheim", sansebastian: "sansebastian", barcelona: "barcelona", madrid: "madrid",
    valencia: "valencia", granada: "granada", sevilla: "sevilla", salamanca: "salamanca", lisbon: "lisbon", porto: "porto"
  };
  var GUIDE_PHOTO = { g1: "pintxos", g2: "bilbao_sopelana", g3: "bilbao_guggenheim", g4: "gaztelugatxe", g5: "cooking_class", g6: "la_rioja", g7: "kayak" };

  function hasPhoto(id) { return !!(window.CORNERS_PHOTOS && window.CORNERS_PHOTOS[id]); }
  function photoAlt(id) {
    var c = (window.CORNERS_CREDITS || []).filter(function (x) { return x.id === id; })[0];
    if (c && c.alt) return c.alt;
    return c ? c.title.replace(/\.(jpg|jpeg)$/i, "").replace(/_/g, " ") : "Photo";
  }
  function pic(photoId, fallbackScene) {
    if (hasPhoto(photoId)) {
      return '<img class="art" src="' + window.CORNERS_PHOTOS[photoId] + '" alt="' + photoAlt(photoId).replace(/"/g, "") + '" loading="lazy">';
    }
    return art(fallbackScene || "city");
  }
  function picBox(photoId, fallbackScene, cls) {
    var d = document.createElement("div");
    d.className = "art-box" + (cls ? " " + cls : "");
    d.innerHTML = pic(photoId, fallbackScene);
    return d;
  }

  var CITY_ART = {
    bilbao: "guggenheim", sansebastian: "surf", barcelona: "city", madrid: "plaza",
    valencia: "surf", granada: "mountains", sevilla: "plaza", salamanca: "oldtown",
    lisbon: "oldtown", porto: "bridge"
  };
  var GUIDE_ART = { g1: "pintxos", g2: "surf", g3: "guggenheim", g4: "mountains", g5: "pintxos", g6: "mountains", g7: "bridge" };

  function artBox(scene, cls) {
    var d = document.createElement("div");
    d.className = "art-box" + (cls ? " " + cls : "");
    d.innerHTML = art(scene);
    return d;
  }

  /* ================= state ================= */

  var KEY = "corners.demo.v2";
  var state = {
    prefs: { lang: "english-courses", budget: 2, setting: "historic", vibe: "laidback", weather: "warm", priorities: [] },
    ranked: false, shortlist: [], compare: ["bilbao"], destination: null, prep: [],
    votes: {}, saves: [], joins: ["language"], checks: ["c1", "c2"], posts: [], going: {},
    profile: { name: "Chiara", role: "Erasmus" }
  };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // Older saved answers (or none) get normalised to the survey's shape.
  (function () {
    var d = { lang: "english-courses", budget: 2, setting: "historic", vibe: "laidback", weather: "warm", priorities: [] };
    var p = Object.assign({}, d, state.prefs || {});
    p.budget = parseInt(p.budget, 10);
    if (!(p.budget >= 1 && p.budget <= 4)) p.budget = 2;
    if (["english-only", "english-courses", "immersion"].indexOf(p.lang) < 0) p.lang = "english-courses";
    if (["metropolis", "historic", "coastal", "college"].indexOf(p.setting) < 0) p.setting = "historic";
    if (["vibrant", "laidback", "cozy"].indexOf(p.vibe) < 0) p.vibe = "laidback";
    if (["warm", "fourseasons", "any"].indexOf(p.weather) < 0) p.weather = "warm";
    p.priorities = (p.priorities || []).map(function (k) { return k === "outdoors" ? "outdoor" : k; });
    if (!Array.isArray(p.priorities)) p.priorities = [];
    state.prefs = p;
  })();

  // #demo opens the app already set up in Bilbao, for showing it without any setup.
  if (/demo/.test(location.hash)) {
    state.prefs = { lang: "immersion", budget: 2, setting: "coastal", vibe: "cozy", weather: "fourseasons", priorities: ["food", "outdoor"] };
    state.destination = "bilbao";
    state.ranked = true;
    state.finished = true;
    state.shortlist = ["bilbao", "sansebastian", "porto"];
    state.compare = ["bilbao", "sansebastian", "porto"];
    state.joins = ["language", "surf", "travel"];
    state.saves = ["r1", "r7", "r12"];
    state.checks = ["c1", "c2", "c3"];
    state.going = { language: true };
    state.profile = { name: "Chiara", role: "Erasmus" };
  }

  /* ================= cities =================
     Figures are demo estimates for a student, per month, gathered for this build.
     Replace with sourced data before anyone makes a decision on them. */

  var ACTS = [
    { k: "surf", s: "Surfing", c: "var(--h7)" },
    { k: "hike", s: "Hiking and mountains", c: "var(--h5)" },
    { k: "beach", s: "Beach life", c: "var(--h8)" },
    { k: "night", s: "Nightlife", c: "var(--h10)" },
    { k: "art", s: "Museums and art", c: "var(--h9)" },
    { k: "food", s: "Food", c: "var(--h2)" },
    { k: "football", s: "Football", c: "var(--h4)" },
    { k: "ski", s: "Skiing", c: "var(--h6)" },
    { k: "immersion", s: "Language immersion", c: "var(--h3)" },
    { k: "buzz", s: "Big-city buzz", c: "var(--h1)" }
  ];

  var CITIES = [
    {
      id: "bilbao", name: "Bilbao", country: "Spain", region: "Basque Country", pop: "346,000",
      tag: "Green coast, surf, and the best food in Spain", a: "#4E9BFF", b: "#1B3A6B", live: true,
      size: "mid", climate: "mild", lang: "spanish", ef: 553, erasmus: 1185, erasmusNote: "Bilbao plus Leioa, where UPV/EHU's Bizkaia campus is registered", safety: 51.4, academic: 4,
      acts: { surf: 5, hike: 5, beach: 4, night: 3, art: 4, food: 5, football: 5, ski: 2, immersion: 4, buzz: 3 },
      cost: { rent: 450, meal: 18, transport: 21.4, tNote: "Gazte Oro, under 26, if you register in Bizkaia" },
      jul: 25.4, jan: 13.5, rainMm: 1158, rainDays: 124,
      langs: "Spanish and Basque",
      unis: [["UPV/EHU", "Public. Main Bizkaia campus is Leioa, 10 km out"], ["University of Deusto", "Private, in the city itself"], ["Mondragon", "Business and design, Zorrotzaurre"]],
      air: "seasonal", airNote: "One summer-only route to Newark. Otherwise connect through Madrid or a European hub.",
      why: ["Metro line 1 to Sopela: surf beaches about 30 minutes from the centre", "Mundaka, regarded as Europe's best left-hand wave, is 40 minutes by train", "The Guggenheim had 1,305,003 visitors in 2025"],
      warn: "Its Numbeo safety score is the weakest here, but that clashes with Basque official crime statistics and rests on 23 contributors. Treat it as noise."
    },
    {
      id: "sansebastian", name: "San Sebastián", country: "Spain", region: "Basque Country", pop: "188,000",
      tag: "A beach in the middle of town, and the food capital", a: "#34CCB3", b: "#0F3B4F",
      size: "small", climate: "mild", lang: "spanish", ef: 550, efRegion: true, erasmus: 143, erasmusNote: "A severe undercount: UPV/EHU registers most of its exchange students under Leioa, near Bilbao", safety: 69.2, academic: 3,
      acts: { surf: 5, hike: 5, beach: 5, night: 3, art: 3, food: 5, football: 4, ski: 2, immersion: 4, buzz: 3 },
      cost: { rent: 500, meal: 15, transport: 13, tNote: "No monthly pass: trips get cheaper as you go, and are free after 50 a month if you're under 26" },
      jul: 25.1, jan: 13.2, rainMm: 1747, rainDays: 143,
      langs: "Spanish and Basque",
      unis: [["UPV/EHU", "Gipuzkoa campus"], ["Deusto", "San Sebastián campus"], ["Tecnun", "Engineering"]],
      air: "none", airNote: "No long-haul flights. Use Bilbao, 1 h 20 by bus, or Biarritz in France, 35 minutes.",
      why: ["La Concha: 1,350 m of sand in the middle of the city", "Zurriola is the surf beach, also in town", "19 Michelin stars within 25 km, including three three-star restaurants", "The film festival runs every September, as term starts"],
      warn: "The wettest city on this list: 1,747 mm a year, nearly five times Salamanca."
    },
    {
      id: "barcelona", name: "Barcelona", country: "Spain", region: "Catalonia", pop: "1.6 million",
      tag: "Beach and big city at the same time", a: "#F59C5E", b: "#7A1F3D",
      size: "big", climate: "warm", lang: "spanish", ef: 566, erasmus: 4374, erasmusNote: "5,140 counting the campuses outside the city", safety: 47.8, academic: 5,
      acts: { surf: 3, hike: 4, beach: 5, night: 5, art: 5, food: 5, football: 5, ski: 3, immersion: 3, buzz: 5 },
      cost: { rent: 600, meal: 16, transport: 15.2, tNote: "T-jove: €45.50 for 90 days, all zones, under 31" },
      jul: 28.3, jan: 14.0, rainMm: 558, rainDays: 53,
      langs: "Spanish and Catalan",
      unis: [["Universitat de Barcelona", "Public, large, central"], ["UAB", "Public. Bellaterra campus, 20 km out"], ["Pompeu Fabra", "Public, genuinely central"], ["Ramon Llull", "Private, includes ESADE and Blanquerna"]],
      air: "direct", airNote: "Nonstop to Miami, JFK, Newark, Boston and LA, with more routes in summer.",
      why: ["Beach and mountains inside one metro map", "The Sagrada Família topped out in February 2026 as the world's tallest church", "The most expensive room rents on this list"],
      warn: "Housing is the problem here. All 10,000 licensed tourist flats are being phased out by 2028, the city reports rents up 62–68% over the decade, and Barcelona also had Spain's highest recorded crime rate in the first half of 2025."
    },
    {
      id: "madrid", name: "Madrid", country: "Spain", region: "Community of Madrid", pop: "3.3 million",
      tag: "The capital: museums, nightlife that doesn't stop", a: "#F58A93", b: "#4E2A8A",
      size: "big", climate: "hot", lang: "spanish", ef: 560, erasmus: 5205, erasmusNote: "7,137 counting Getafe, Leganés, Móstoles and Alcalá", safety: 70.4, academic: 5,
      acts: { surf: 1, hike: 4, beach: 1, night: 5, art: 5, food: 5, football: 5, ski: 4, immersion: 5, buzz: 5 },
      cost: { rent: 550, meal: 16, transport: 10, tNote: "Abono Joven: €10 a month, every zone in the region, ages 15–25" },
      jul: 32.8, jan: 10.0, rainMm: 416, rainDays: 59,
      langs: "Spanish",
      unis: [["Complutense", "Public, very large, in the city"], ["Autónoma de Madrid", "Public. Cantoblanco, 15 km north"], ["Carlos III", "Public, English tracks. Getafe and Leganés, not central"], ["Rey Juan Carlos", "Public, the region's second largest"], ["IE University", "Private, business"]],
      air: "hub", airNote: "Iberia's hub: nonstop to JFK, Miami, Chicago, Boston, Dallas and more. The best flight access in Spain.",
      why: ["The Prado, Reina Sofía and Thyssen within one walk, UNESCO-listed since 2021", "AVE trains run direct to Seville, Barcelona, Málaga and Valencia, so weekends are easy", "No beach, and you will feel that in July"],
      warn: "32.8 °C average July highs and no coast to escape to."
    },
    {
      id: "valencia", name: "Valencia", country: "Spain", region: "Valencian Community", pop: "800,000",
      tag: "Beach, bikes and a park where the river used to be", a: "#DDAE45", b: "#1F5F8A",
      size: "big", climate: "warm", lang: "spanish", ef: 564, erasmus: 4194, safety: 61.5, academic: 4,
      acts: { surf: 3, hike: 3, beach: 5, night: 4, art: 4, food: 5, football: 4, ski: 1, immersion: 5, buzz: 4 },
      cost: { rent: 380, meal: 16, transport: 14.9, tNote: "SUMA Jove, ages 15–30. Verified to 30 June 2026; a tariff update since then isn't published" },
      jul: 29.9, jan: 16.8, rainMm: 459, rainDays: 44,
      langs: "Spanish and Valencian",
      unis: [["Universitat de València", "Public, historic"], ["UPV", "Public, technical"]],
      air: "none", airNote: "No US nonstop yet: Montréal year-round, and Newark starts June 2027. Connect through Madrid or Barcelona.",
      why: ["European Green Capital 2024", "Malvarrosa beach is 15–20 minutes away on the tram", "Las Fallas, 15–19 March, is UNESCO-listed", "The warmest winters here: 16.8 °C January highs"]
    },
    {
      id: "granada", name: "Granada", country: "Spain", region: "Andalusia", pop: "230,000",
      tag: "Free tapas, the Alhambra, and a ski resort up the road", a: "#A6A8F7", b: "#3D2A6B",
      size: "small", climate: "hot", lang: "spanish", ef: 562, erasmus: 1929, erasmusNote: "In a city of 230,000, essentially all at one university", safety: 62.9, academic: 4,
      acts: { surf: 1, hike: 5, beach: 3, night: 5, art: 5, food: 5, football: 3, ski: 5, immersion: 5, buzz: 3 },
      cost: { rent: 401, meal: 14, transport: 24.6, tNote: "The only city here with no youth monthly pass: this is the standard one" },
      jul: 34.8, jan: 13.0, rainMm: 365, rainDays: 52,
      langs: "Spanish",
      unis: [["Universidad de Granada", "Public. Spain's top university for Erasmus+ funding, and its language centre runs a separate study-abroad stream"]],
      air: "none", airNote: "A regional airport only. Connect through Madrid, or fly to Málaga and take the bus (about 1 h 30).",
      why: ["Sierra Nevada is 32 km away: Europe's southernmost ski resort, open late November to late April", "The Alhambra takes about 2.6 million visitors a year, so book ahead", "The free tapa with every drink is still the rule here"]
    },
    {
      id: "sevilla", name: "Sevilla", country: "Spain", region: "Andalusia", pop: "680,000",
      tag: "Orange trees, flamenco, and serious heat", a: "#F090C8", b: "#7A1F3D",
      size: "mid", climate: "hot", lang: "spanish", ef: 535, erasmus: 1820, safety: 63.0, academic: 4,
      acts: { surf: 1, hike: 3, beach: 2, night: 5, art: 5, food: 5, football: 5, ski: 1, immersion: 5, buzz: 4 },
      cost: { rent: 370, meal: 12, transport: 8.8, tNote: "Tarjeta Joven, ages 16–29. A student pass (€11.40) has no age limit" },
      jul: 36.3, jan: 16.3, rainMm: 502, rainDays: 50,
      langs: "Spanish",
      unis: [["Universidad de Sevilla", "Public, historic centre"], ["Pablo de Olavide", "Public. Campus 12 km out, big US study-abroad unit"]],
      air: "none", airNote: "No long-haul flights. Connect through Madrid, Barcelona or Lisbon.",
      why: ["Semana Santa (29 Mar–5 Apr 2026) and Feria (21–26 Apr) land mid-spring-semester", "The cathedral, Alcázar and Archivo de Indias are one UNESCO site", "The accent will humble your Spanish"],
      warn: "The hottest city here: 36.3 °C average July highs, and a record of 46.6 °C."
    },
    {
      id: "salamanca", name: "Salamanca", country: "Spain", region: "Castile and León", pop: "144,000",
      tag: "A sandstone town that is almost entirely students", a: "#AFC455", b: "#2E4A1F",
      size: "small", climate: "hot", lang: "spanish", ef: 545, erasmus: 803, erasmusNote: "Separate from the 5,100 who come just for the Spanish-language courses", safety: 81.3, academic: 4,
      acts: { surf: 1, hike: 3, beach: 1, night: 4, art: 4, food: 4, football: 2, ski: 2, immersion: 5, buzz: 2 },
      cost: { rent: 300, meal: 13, transport: 7.34, tNote: "Abono joven, under 30, if you register in Salamanca" },
      jul: 30.8, jan: 9.5, rainMm: 356, rainDays: 62,
      langs: "Spanish",
      unis: [["Universidad de Salamanca", "Founded 1218, the oldest in Spain"], ["Pontificia de Salamanca", "Private, 322 incoming exchange students"]],
      air: "none", airNote: "No usable airport. Madrid-Barajas is 228 km: about 2–2¾ hours by coach or train.",
      why: ["The cheapest rooms on this list, at about €300", "The university's language school teaches over 7,000 international students a year", "The old city is UNESCO-listed and you can walk all of it", "The safest city here on Numbeo's index"],
      warn: "9.5 °C January highs, no coast, and the smallest city on the list."
    },
    {
      id: "lisbon", name: "Lisbon", country: "Portugal", region: "Lisbon", pop: "550,000",
      tag: "Hills, ocean light, and the cheapest flights anywhere", a: "#2EC7DB", b: "#1B3A6B",
      size: "big", climate: "warm", lang: "portuguese", ef: 612, erasmus: 5349, erasmusNote: "The most of any city in Europe", safety: 67.1, academic: 4,
      acts: { surf: 5, hike: 3, beach: 5, night: 5, art: 4, food: 4, football: 5, ski: 1, immersion: 2, buzz: 5 },
      cost: { rent: 550, meal: 15, transport: 0, tNote: "Free: every student up to and including 23, with proof of enrolment" },
      jul: 28.2, jan: 15.1, rainMm: 794, rainDays: 75,
      langs: "Portuguese, and English widely spoken",
      unis: [["Universidade de Lisboa", "Public, 19 schools, 4,121 incoming exchange students"], ["NOVA", "Public. Its business school is in Carcavelos, outside the city"], ["Iscte-IUL", "Public, social sciences, central"]],
      air: "hub", airNote: "TAP's hub: nonstop to Boston, JFK, Newark, Chicago, Miami and San Francisco.",
      why: ["Carcavelos beach is 20 minutes on the Cascais train", "Ericeira, 40 minutes away, is Europe's only World Surfing Reserve", "Sintra is a 40-minute train ride"],
      warn: "Rooms cost as much as Madrid's, and Portugal's own state reference for student housing support (€500) already sits below the market."
    },
    {
      id: "porto", name: "Porto", country: "Portugal", region: "North", pop: "230,000",
      tag: "River, bridges, cheap, and a beach on the tram line", a: "#72CF8E", b: "#1F4A3B",
      size: "mid", climate: "mild", lang: "portuguese", ef: 618, erasmus: 2192, safety: 66.2, academic: 4,
      acts: { surf: 5, hike: 3, beach: 4, night: 4, art: 4, food: 5, football: 5, ski: 1, immersion: 2, buzz: 3 },
      cost: { rent: 450, meal: 12, transport: 0, tNote: "Free under 23, and since July 2026 free for everyone living in the city" },
      jul: 24.3, jan: 14.0, rainMm: 1147, rainDays: 105,
      langs: "Portuguese, and English widely spoken",
      unis: [["Universidade do Porto", "Public, the largest in Portugal. 2,741 incoming exchange students in 2024/25"], ["Politécnico do Porto", "Public, eight schools"], ["Católica Porto", "Private, one campus of Universidade Católica Portuguesa"]],
      air: "direct", airNote: "Boston and Newark year-round; JFK and Canada seasonal. Winter arrivals may still route via Lisbon.",
      why: ["Matosinhos surf is 27 minutes away on the metro, for €1.85", "Numbeo puts Lisbon about 14% more expensive overall, with rents 31% higher", "The port cellars are walkable across the bridge, in the world's first demarcated wine region"],
      warn: "It rains like Bilbao: 1,147 mm a year. Pack for it."
    }
  ];

  /* Survey metrics. Housing, transit and tips are our own ratings, not measurements —
     tips counts are demo data for the pilot. Work rules are indicative: check your consulate. */
  /* Setting, vibe, climate and langEnv use the same vocabulary as the team's comparison
     prototype, so the two surveys rank on identical axes. Bilbao, Barcelona and Lisbon
     carry exactly the values that file uses. */
  var EXTRA = {
    bilbao: { setting: "coastal", settings: ["coastal", "historic"], vibe: "cozy", weather: "fourseasons", langEnv: "immersion", house: 4, transit: 5, tips: 128 },
    sansebastian: { setting: "coastal", settings: ["coastal", "historic"], vibe: "laidback", weather: "fourseasons", langEnv: "immersion", house: 2, transit: 4, tips: 41 },
    barcelona: { setting: "metropolis", settings: ["metropolis", "coastal"], vibe: "vibrant", weather: "warm", langEnv: "immersion", house: 1, transit: 5, tips: 96 },
    madrid: { setting: "metropolis", settings: ["metropolis"], vibe: "vibrant", weather: "fourseasons", langEnv: "immersion", house: 2, transit: 5, tips: 88 },
    valencia: { setting: "coastal", settings: ["coastal", "metropolis"], vibe: "laidback", weather: "warm", langEnv: "immersion", house: 3, transit: 4, tips: 57 },
    granada: { setting: "college", settings: ["college", "historic"], vibe: "vibrant", weather: "fourseasons", langEnv: "immersion", house: 4, transit: 3, tips: 49 },
    sevilla: { setting: "historic", settings: ["historic"], vibe: "vibrant", weather: "warm", langEnv: "immersion", house: 3, transit: 3, tips: 44 },
    salamanca: { setting: "college", settings: ["college", "historic"], vibe: "cozy", weather: "fourseasons", langEnv: "immersion", house: 5, transit: 3, tips: 22 },
    lisbon: { setting: "coastal", settings: ["coastal", "metropolis"], vibe: "vibrant", weather: "warm", langEnv: "english-courses", house: 1, transit: 4, tips: 63 },
    porto: { setting: "historic", settings: ["historic", "coastal"], vibe: "laidback", weather: "fourseasons", langEnv: "english-courses", house: 3, transit: 4, tips: 38 }
  };
  CITIES.forEach(function (c) { Object.assign(c, EXTRA[c.id] || {}); });

  var WORK = {
    Spain: "EU students: no limit. Non-EU on a student visa: part-time work allowed, widely cited as up to 30 h/week since the 2022 reform.",
    Portugal: "EU students: no limit. Non-EU students may work part-time with a student residence permit."
  };
  var HOUSE_LABEL = ["", "Very tight", "Tight", "Mixed", "Manageable", "Easy"];
  var TRANSIT_LABEL = ["", "Limited", "Basic", "Decent", "Good", "Excellent"];
  /* Bands and caps as set by the comparison prototype on 24 Sep. */
  var BUDGET_BAND = {
    1: { cap: 1300, label: "under €1,300" }, 2: { cap: 1600, label: "€1,300–€1,600" },
    3: { cap: 2000, label: "€1,600–€2,000" }, 4: { cap: 99999, label: "€2,000+" }
  };
  var FOOD_CITIES = ["bilbao", "sansebastian", "barcelona", "lisbon"];

  var byId = function (id) { return CITIES.filter(function (c) { return c.id === id; })[0]; };

  /* ================= matching ================= */

  // A month, built the same way for every city: rent + €250 food + transport + €150 for everything else.
  var FOOD = 250, OTHER = 150;
  function monthly(c) { return Math.round(c.cost.rent + FOOD + c.cost.transport + OTHER); }
  var AIR = { hub: 1, direct: .85, seasonal: .5, none: .3 };
  var AIR_LABEL = { hub: "Major hub", direct: "Some nonstops", seasonal: "Summer only", none: "Connect first" };
  function travelScore(c) { return AIR[c.air] || .3; }
  function costScore(c) { return clamp((1250 - monthly(c)) / 500, 0, 1); }
  // EF EPI 2025 city score → 0–1. Portugal sits ~50–80 points above every Spanish city.
  function engScore(c) { return clamp((c.ef - 500) / 140, 0, 1); }
  function engLabel(c) { return c.ef + (c.ef >= 600 ? " · very high" : c.ef >= 550 ? " · moderate" : " · lower"); }
  var PRIORITY = {
    safety: function (c) { return c.safety / 100; },
    nightlife: function (c) { return c.acts.night / 5; },
    afford: function (c) { return costScore(c); },
    food: function (c) { return c.acts.food / 5; },
    intl: function (c) { return clamp(c.erasmus / 5400, .05, 1); },
    outdoor: function (c) { return Math.max(c.acts.hike, c.acts.surf, c.acts.beach) / 5; }
  };

  /* Same weights and tie-breakers as the comparison prototype, so both rank alike. */
  function rawScore(c) {
    var p = state.prefs, s = 0;
    var cap = (BUDGET_BAND[p.budget] || BUDGET_BAND[2]).cap;
    var b = monthly(c);
    if (b <= cap) s += 4; else s -= Math.min(6, (b - cap) / 150);
    if (p.lang === c.langEnv) s += 3;
    if (p.lang === "english-only") s -= 2;
    if (p.setting === c.setting) s += 2;
    if (p.vibe === c.vibe) s += 2;
    if (p.weather === c.weather || p.weather === "any") s += 2;
    (p.priorities || []).forEach(function (k) {
      if (k === "safety") s += (c.safety - 55) / 12;
      if (k === "afford") s += (2100 - b) / 200;
      if (k === "nightlife" || k === "intl") s += (c.vibe === "vibrant" ? 1.5 : 0.5);
      if (k === "outdoor") s += (c.setting === "coastal" ? 1.5 : 0);
      if (k === "food") s += (FOOD_CITIES.indexOf(c.id) > -1 ? 1 : 0);
    });
    return s;
  }
  function matchScore(c) { return clamp(Math.round((rawScore(c) + 3) / 22 * 100), 5, 99); }

  function dims(c) {
    return [
      { k: "Monthly budget", v: "€" + monthly(c) + "/mo", w: costScore(c) },
      { k: "Housing", v: HOUSE_LABEL[c.house], w: c.house / 5 },
      { k: "Safety rating", v: c.safety.toFixed(0) + "/100", w: c.safety / 100 },
      { k: "Transit", v: TRANSIT_LABEL[c.transit], w: c.transit / 5 },
      { k: "Student tips", v: c.tips + " uploaded", w: clamp(c.tips / 130, .05, 1) },
      { k: "English (EF EPI)", v: engLabel(c), w: engScore(c) },
      { k: "Erasmus students", v: c.erasmus.toLocaleString("en-GB") + "/yr", w: clamp(c.erasmus / 5400, .08, 1) },
      { k: "Outdoors", v: c.acts.hike >= 4 || c.acts.surf >= 4 ? "Excellent" : c.acts.hike >= 3 ? "Good" : "Limited", w: Math.max(c.acts.hike, c.acts.surf, c.acts.beach) / 5 },
      { k: "Nightlife", v: ["Quiet", "Quiet", "Steady", "Busy", "Busy", "Relentless"][c.acts.night], w: c.acts.night / 5 },
      { k: "Culture and food", v: c.acts.food >= 5 ? "Exceptional" : "Strong", w: (c.acts.art + c.acts.food) / 10 },
      { k: "Academic fit", v: c.unis.length + (c.unis.length === 1 ? " university" : " universities"), w: c.academic / 5 },
      { k: "Flights home", v: AIR_LABEL[c.air], w: travelScore(c) }
    ];
  }

  /* ================= shell ================= */

  var VIEWS = {
    start: { t: "Corners", s: "Start here", m: "before" },
    match: { t: "Find your corner", s: "Optional survey", m: "before" },
    cities: { t: "Cities", s: "Ten in the demo", m: "before" },
    compare: { t: "Compare", s: "Side by side", m: "before" },
    city: { t: "City", s: "", m: "before" },
    prep: { t: "Get ready", s: "Before you leave", m: "before" },
    home: { t: "Today", s: "Bilbao", m: "there" },
    near: { t: "Nearby", s: "Anonymous · 5 km", m: "there" },
    recs: { t: "Recs", s: "Ranked by students", m: "there" },
    groups: { t: "Groups", s: "Find your people", m: "there" },
    guides: { t: "Guides", s: "Tours and experiences", m: "there" },
    trips: { t: "Weekends", s: "From Bilbao", m: "there" },
    prog: { t: "Your programme", s: "Example programme", m: "there" },
    me: { t: "Me", s: "Demo profile", m: null }
  };
  var TABS = {
    before: [["start", "i-guides", "Start"], ["match", "i-match", "Match"], ["cities", "i-cities", "Cities"], ["prep", "i-prep", "Ready"], ["me", "i-me", "Me"]],
    there: [["home", "i-home", "Today"], ["near", "i-near", "Nearby"], ["recs", "i-recs", "Recs"], ["trips", "i-trips", "Trips"], ["me", "i-me", "Me"]]
  };

  var mode = "before", current = "match";
  var tabsEl = $("[data-tabs]");

  var PILLS = {
    before: [["start", "Start here"], ["match", "Find your corner"], ["cities", "Cities"], ["compare", "Compare"], ["prep", "Get ready"], ["me", "Me"]],
    there: [["home", "Today"], ["near", "Nearby"], ["recs", "Recs"], ["groups", "Groups"], ["guides", "Guides"], ["trips", "Weekends"], ["prog", "Programme"], ["me", "Me"]]
  };

  function buildPills() {
    var box = $("[data-pills]");
    if (!box) return;
    box.textContent = "";
    PILLS[mode].forEach(function (p) {
      var b = elem("button", "pill-link" + (p[0] === current ? " is-on" : ""), p[1]);
      b.type = "button";
      b.dataset.go = p[0];
      box.appendChild(b);
    });
  }

  function buildTabs() {
    tabsEl.textContent = "";
    var blob = elem("span", "tabs__blob");
    blob.setAttribute("aria-hidden", "true");
    tabsEl.appendChild(blob);
    TABS[mode].forEach(function (t) {
      var b = elem("button", "tab" + (t[0] === current ? " is-on" : ""));
      b.dataset.go = t[0];
      b.appendChild(icon(t[1]));
      b.appendChild(elem("span", null, t[2]));
      tabsEl.appendChild(b);
    });
    moveBlob();
  }
  function moveBlob() {
    var blob = $(".tabs__blob"), on = $(".tab.is-on");
    if (!blob) return;
    if (!on) { blob.style.width = "0px"; return; }
    blob.style.width = on.offsetWidth + "px";
    blob.style.transform = "translateX(" + (on.offsetLeft - 6) + "px)";
  }
  function moveModeBlob() {
    var blob = $(".mode__blob"), on = $('.mode__b[aria-selected="true"]');
    if (!blob || !on) return;
    blob.style.width = on.offsetWidth + "px";
    blob.style.transform = "translateX(" + (on.offsetLeft - 5) + "px)";
  }

  function setMode(m, jump) {
    mode = m;
    $$(".mode__b").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.mode === m)); });
    moveModeBlob();
    buildTabs();
    buildPills();
    if (jump) go(m === "before" ? (state.ranked ? "cities" : "start") : "home");
  }

  function swap(name) {
    $$("[data-view]").forEach(function (v) {
      var on = v.dataset.view === name;
      v.hidden = !on;
      v.classList.toggle("is-on", on);
      if (on) $$(":scope > *", v).forEach(function (c, i) { c.style.setProperty("--i", i); });
    });
    var info = VIEWS[name] || VIEWS.match;
    var title = $("[data-top-title]");
    title.textContent = name === "city" && openCityId ? byId(openCityId).name : info.t;
    title.classList.remove("is-swap"); void title.offsetWidth; title.classList.add("is-swap");
    $("[data-top-eyebrow]").textContent = name === "city" && openCityId ? byId(openCityId).country : info.s;
    $("[data-back]").hidden = name !== "city";
    current = name;
    if (info.m && info.m !== mode) setMode(info.m, false);
    $$(".tab").forEach(function (b) { b.classList.toggle("is-on", b.dataset.go === name); });
    $$(".pill-link").forEach(function (b) { b.classList.toggle("is-on", b.dataset.go === name); });
    moveBlob();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function go(name, push) {
    if (!VIEWS[name] || name === current) return;
    if (push !== false) history.pushState({ v: name }, "", "#" + name);
    if (document.startViewTransition && !reduce) document.startViewTransition(function () { swap(name); });
    else swap(name);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go]");
    if (t) { e.preventDefault(); go(t.dataset.go); }
    var m = e.target.closest("[data-mode]");
    if (m) setMode(m.dataset.mode, true);
  });
  $("[data-back]").addEventListener("click", function () { go("cities"); });
  window.addEventListener("popstate", function () {
    if (sheetOpen) { closeSheet(true); return; }
    var name = (location.hash || "#match").slice(1);
    if (VIEWS[name] && name !== current) swap(name);
  });
  window.addEventListener("resize", function () { moveBlob(); moveModeBlob(); });

  /* ================= sheet ================= */

  var sheet = $("[data-sheet]"), scrim = $("[data-scrim]"), sheetBody = $("[data-sheet-body]");
  var sheetOpen = false, lastFocus = null;

  function openSheet(build) {
    lastFocus = document.activeElement;
    sheetBody.textContent = "";
    build(sheetBody);
    sheet.hidden = false; scrim.hidden = false;
    sheet.classList.remove("is-out"); scrim.classList.remove("is-out");
    sheet.style.translate = "";
    sheetOpen = true;
    document.body.style.overflow = "hidden";
    history.pushState({ sheet: 1 }, "", location.hash || "#" + current);
    var f = sheet.querySelector("button, textarea, input, a[href]");
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeSheet(fromPop) {
    if (!sheetOpen) return;
    sheetOpen = false;
    sheet.classList.add("is-out"); scrim.classList.add("is-out");
    document.body.style.overflow = "";
    setTimeout(function () { sheet.hidden = true; scrim.hidden = true; sheet.classList.remove("is-out", "is-drag"); }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    if (!fromPop && history.state && history.state.sheet) history.back();
  }
  scrim.addEventListener("click", function () { closeSheet(); });
  $("[data-sheet-close]").addEventListener("click", function () { closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheetOpen) closeSheet(); });
  (function () {
    var grab = $(".sheet__grab"), startY = 0, dy = 0, dragging = false;
    grab.addEventListener("pointerdown", function (e) { dragging = true; startY = e.clientY; dy = 0; sheet.classList.add("is-drag"); grab.setPointerCapture(e.pointerId); });
    grab.addEventListener("pointermove", function (e) { if (!dragging) return; dy = Math.max(0, e.clientY - startY); sheet.style.translate = "-50% " + dy + "px"; });
    grab.addEventListener("pointerup", function () { if (!dragging) return; dragging = false; sheet.classList.remove("is-drag"); sheet.style.translate = ""; if (dy > 110) closeSheet(); });
  })();

  var toastEl = $("[data-toast]"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.classList.remove("is-out");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.add("is-out"); setTimeout(function () { toastEl.hidden = true; }, 300); }, 2200);
  }

  /* ================= quiz ================= */

  $$("[data-one]").forEach(function (box) {
    var key = box.dataset.one;
    $$(".pick", box).forEach(function (b) {
      b.classList.toggle("is-on", String(state.prefs[key]) === b.dataset.v);
      b.setAttribute("aria-pressed", String(String(state.prefs[key]) === b.dataset.v));
      b.addEventListener("click", function () {
        state.prefs[key] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
        $$(".pick", box).forEach(function (o) {
          o.classList.toggle("is-on", o === b);
          o.setAttribute("aria-pressed", String(o === b));
        });
        save();
        if (key === "lang") langNote();
      });
    });
  });

  $$("[data-multi]").forEach(function (box) {
    var key = box.dataset.multi;
    var max = parseInt(box.dataset.max || "99", 10);
    $$(".pick", box).forEach(function (b) {
      var on = function () { return state.prefs[key].indexOf(b.dataset.v) > -1; };
      b.classList.toggle("is-on", on());
      b.setAttribute("aria-pressed", String(on()));
      b.addEventListener("click", function () {
        var arr = state.prefs[key];
        var i = arr.indexOf(b.dataset.v);
        if (i > -1) arr.splice(i, 1);
        else {
          if (arr.length >= max) arr.shift();
          arr.push(b.dataset.v);
        }
        save();
        $$(".pick", box).forEach(function (o) {
          var isOn = arr.indexOf(o.dataset.v) > -1;
          o.classList.toggle("is-on", isOn);
          o.setAttribute("aria-pressed", String(isOn));
        });
      });
    });
  });

  function langNote() {
    var box = $('[data-one="lang"]');
    if (!box) return;
    var note = $(".lang-note") || elem("p", "lang-note hint");
    note.className = "lang-note hint";
    if (state.prefs.lang === "english-only") {
      note.textContent = "None of the ten cities is in a native English-speaking country yet, so everything will score low on this. Porto and Lisbon come closest: Portugal ranks 6th in the world for English.";
      box.parentNode.appendChild(note);
    } else if (note.parentNode) note.parentNode.removeChild(note);
  }
  langNote();

  var skipBtn = $("[data-skip-survey]");
  if (skipBtn) skipBtn.addEventListener("click", function () { go("compare"); });

  $("[data-run-match]").addEventListener("click", function () {
    state.ranked = true; save();
    citySort = "match";
    renderCities();
    go("cities");
    setTimeout(function () {
      var top = CITIES.slice().sort(function (a, b) { return matchScore(b) - matchScore(a); })[0];
      toast("Top match: " + top.name + " at " + matchScore(top) + "%");
    }, 400);
  });

  /* ================= cities ================= */

  var citiesEl = $("[data-cities]"), citySort = "match";

  function cityCard(c) {
    var li = elem("li", "city" + (c.live ? " city--live" : ""));
    var thumb = elem("div", "city__thumb");
    thumb.innerHTML = pic(CITY_PHOTO[c.id], CITY_ART[c.id] || "city");
    if (c.live) thumb.appendChild(elem("span", "city__live", "LIVE"));

    var body = elem("div", "city__body");
    body.tabIndex = 0; body.setAttribute("role", "button");
    var name = elem("p", "city__name", c.name);
    name.appendChild(elem("small", null, c.country));
    body.appendChild(name);
    body.appendChild(elem("p", "city__tag", c.tag));
    var stats = elem("div", "city__stats");
    ["€" + monthly(c) + "/mo", "Room €" + c.cost.rent, c.jul + "° July", c.size === "big" ? "Big city" : c.size === "mid" ? "Mid-size" : "Small"]
      .forEach(function (s) { stats.appendChild(elem("span", null, s)); });
    body.appendChild(stats);
    var open = function () { openCity(c.id); };
    body.addEventListener("click", open);
    body.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });

    var right = elem("div", "city__right");
    var m = elem("div", "match match--sm");
    var pct = matchScore(c);
    m.style.setProperty("--p", pct + "%");
    m.appendChild(elem("span", null, pct + "%"));
    m.title = "Match with your answers";
    var cmp = elem("button", "city__cmp" + (state.compare.indexOf(c.id) > -1 ? " is-on" : ""), "VS");
    cmp.type = "button";
    cmp.setAttribute("aria-label", "Add " + c.name + " to compare");
    cmp.addEventListener("click", function (e) { e.stopPropagation(); toggleCompare(c.id); cmp.classList.toggle("is-on", state.compare.indexOf(c.id) > -1); });
    right.appendChild(m); right.appendChild(cmp);

    li.appendChild(thumb); li.appendChild(body); li.appendChild(right);
    return li;
  }

  function renderCities() {
    if (!citiesEl) return;
    var arr = CITIES.slice();
    if (citySort === "match") arr.sort(function (a, b) { return matchScore(b) - matchScore(a); });
    if (citySort === "cost") arr.sort(function (a, b) { return monthly(a) - monthly(b); });
    if (citySort === "safety") arr.sort(function (a, b) { return b.safety - a.safety; });
    if (citySort === "warm") arr.sort(function (a, b) { return (b.jul + b.jan) - (a.jul + a.jan); });
    citiesEl.textContent = "";
    arr.forEach(function (c, i) {
      var card = cityCard(c);
      citiesEl.appendChild(card);
      if (!reduce) card.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: i * 40, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
    var hint = $("[data-city-hint]");
    if (hint) {
      var top = arr[0];
      hint.textContent = state.ranked
        ? "Best match: " + top.name + " at " + matchScore(top) + "%. Tap any city to see why, or VS to compare."
        : "Answer six questions on Find your city and these get ranked for you.";
    }
  }
  $$("[data-csort]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-csort]").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      citySort = b.dataset.csort;
      renderCities();
    });
  });

  /* ================= landing ================= */

  var FEATURES = [
    ["nearby", "plaza", "Nearby", "Anonymous posts from students a few streets away. Ask anything, vote up what helps.", "near"],
    ["recs", "pintxos", "Recs", "Where to eat, train and go out, ranked by students who live there.", "recs"],
    ["groups", "mountains", "Groups", "Surf, hiking, language exchange, football. Find people by what you do.", "groups"]
  ];

  function photoCard(opts) {
    var card = elem("button", "pcard " + (opts.span || "b-3"));
    card.type = "button";
    card.innerHTML = pic(opts.photo, opts.scene);
    var scrim = elem("div", "pcard__scrim");
    var inner = elem("div", "pcard__in");
    if (opts.kicker) inner.appendChild(elem("p", "pcard__k", opts.kicker));
    inner.appendChild(elem("p", "pcard__t", opts.title));
    if (opts.text) inner.appendChild(elem("p", "pcard__p", opts.text));
    if (opts.buttons) {
      var cta = elem("div", "pcard__cta");
      opts.buttons.forEach(function (b) {
        var el2 = elem("span", "btn" + (b[2] ? " btn--line" : ""), b[0]);
        cta.appendChild(el2);
      });
      inner.appendChild(cta);
    }
    card.appendChild(scrim);
    card.appendChild(inner);
    if (opts.onClick) card.addEventListener("click", opts.onClick);
    return card;
  }

  function openCredits() {
    openSheet(function (box) {
      box.appendChild(elem("h2", null, "Photo credits"));
      box.appendChild(elem("p", null, "Photographs from Wikimedia Commons, used under the licence shown. Illustrations where no photo is listed are ours."));
      var ul = elem("ul", "credits-list");
      (window.CORNERS_CREDITS || []).forEach(function (c) {
        var li = elem("li");
        li.appendChild(elem("b", null, c.title.replace(/\.(jpg|jpeg)$/i, "")));
        li.appendChild(document.createTextNode(" — " + (c.artist || "unknown") + " · " + c.license));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    });
  }

  function renderLanding() {
    var box = $("[data-landing]");
    if (!box) return;
    box.textContent = "";
    var bil = byId("bilbao");
    var grid = elem("section", "bento");

    grid.appendChild(photoCard({
      span: "b-hero b-3", photo: "bilbao_ria", scene: "guggenheim",
      kicker: "Bilbao · autumn 2026",
      title: "A semester abroad, sorted.",
      text: "Choose the city, get ready to go, then find your feet once you land: what students nearby are saying, where to eat and train, groups to join, and weekends that fit your budget.",
      buttons: [["Find your city"], ["Look around Bilbao", null, true]],
      onClick: function () { go("match"); }
    }));

    grid.appendChild(photoCard({
      span: "b-2", photo: "granada", scene: "mountains",
      kicker: "Before you leave", title: "Compare ten cities",
      text: "Cost, safety, climate, English, Erasmus numbers. Real figures, ranked on what you actually want.",
      onClick: function () { go("cities"); }
    }));

    var nums = elem("article", "tcard tcard--tint b-3");
    var numHead = elem("div", "card__head");
    var numIco = elem("span", "ico ico--green");
    numIco.innerHTML = '<svg><use href="#i-cities"/></svg>';
    numHead.appendChild(numIco);
    numHead.appendChild(elem("p", "tcard__k", "The pilot city"));
    nums.appendChild(numHead);
    nums.appendChild(elem("p", "tcard__t", "Bilbao, by the numbers"));
    var mn = elem("div", "mini-nums");
    [["€" + monthly(bil), "a month, all in"], [bil.erasmus.toLocaleString("en-GB"), "Erasmus students a year"],
     [bil.jul + "°", "average July high"], ["€" + bil.cost.rent, "a room in a shared flat"]]
      .forEach(function (n) {
        var d = elem("div", "mini-num");
        d.appendChild(elem("b", null, n[0]));
        d.appendChild(elem("span", null, n[1]));
        mn.appendChild(d);
      });
    nums.appendChild(mn);
    var nb = elem("button", "btn btn--ghost", "See the city page");
    nb.addEventListener("click", function () { openCity("bilbao"); });
    nums.appendChild(nb);
    grid.appendChild(nums);

    [["b-2", "bilbao_casco", "plaza", "Nearby", "Anonymous posts from students a few streets away.", "near"],
     ["b-2", "pintxos", "pintxos", "Recs", "Where to eat, train and go out, ranked by students.", "recs"],
     ["b-2", "bilbao_sopelana", "surf", "Groups", "Surf, hiking, language exchange, football.", "groups"]]
      .forEach(function (f) {
        grid.appendChild(photoCard({
          span: f[0], photo: f[1], scene: f[2], kicker: "In the city", title: f[3], text: f[4],
          onClick: function () { setMode("there", false); go(f[5]); }
        }));
      });

    grid.appendChild(photoCard({
      span: "b-2", photo: "gaztelugatxe", scene: "mountains",
      kicker: "Weekends", title: "Trips that fit your budget",
      text: "Eight places from Bilbao, priced by travel, bed and food. Move the slider, watch them re-sort.",
      onClick: function () { setMode("there", false); go("trips"); }
    }));

    grid.appendChild(photoCard({
      span: "b-2", photo: "bilbao_sanmames", scene: "stadium",
      kicker: "Your programme", title: "Dates, paperwork, people to ask",
      text: "Key dates, the first-week checklist, and what everyone is asking about this week.",
      onClick: function () { setMode("there", false); go("prog"); }
    }));

    var unis = elem("article", "tcard b-4 landing-extra");
    var uniHead = elem("div", "card__head");
    var uniIco = elem("span", "ico ico--amber");
    uniIco.innerHTML = '<svg><use href="#i-prog"/></svg>';
    uniHead.appendChild(uniIco);
    uniHead.appendChild(elem("p", "tcard__k", "Where you'd study"));
    unis.appendChild(uniHead);
    unis.appendChild(elem("p", "tcard__t", "Bilbao's universities"));
    [["bilbao_ehu", "campus", bil.unis[0]], ["bilbao_deusto", "campus", bil.unis[1]], ["bilbao_artxanda", "city", bil.unis[2]]]
      .forEach(function (u) {
        var row = elem("div", "uni-row");
        row.appendChild(picBox(u[0], u[1], "shot"));
        var t = elem("div");
        t.appendChild(elem("b", null, u[2][0]));
        t.appendChild(elem("span", null, u[2][1]));
        row.appendChild(t);
        unis.appendChild(row);
      });
    grid.appendChild(unis);

    var ready = elem("article", "tcard b-2 landing-extra");
    var readyHead = elem("div", "card__head");
    var readyIco = elem("span", "ico ico--rose");
    readyIco.innerHTML = '<svg><use href="#i-prep"/></svg>';
    readyHead.appendChild(readyIco);
    readyHead.appendChild(elem("p", "tcard__k", "Before you fly"));
    ready.appendChild(readyHead);
    ready.appendChild(elem("p", "tcard__t", "Get ready"));
    ready.appendChild(elem("p", null, "Fifteen things in three phases: visa, housing, insurance, flights, and the ten words worth learning."));
    var rb = elem("button", "btn", "Open the checklist");
    rb.dataset.go = "prep";
    ready.appendChild(rb);
    grid.appendChild(ready);

    box.appendChild(grid);

    var credit = elem("p", "credit");
    credit.appendChild(document.createTextNode("Photos from Wikimedia Commons under CC licences. "));
    var cb = elem("button", null, "See the credits");
    cb.type = "button";
    cb.addEventListener("click", openCredits);
    credit.appendChild(cb);
    credit.appendChild(document.createTextNode(". Figures: rents from idealista, climate from AEMET, Erasmus numbers from the European Commission."));
    box.appendChild(credit);
  }

  function renderLandingOld() {
    var box = document.createElement("div");
    var hero = elem("section", "land-hero");
    hero.appendChild(artBox("guggenheim", "land-hero__art"));
    var h = elem("h2");
    h.appendChild(document.createTextNode("A semester abroad, "));
    h.appendChild(elem("em", null, "sorted."));
    hero.appendChild(h);
    hero.appendChild(elem("p", null, "Corners helps you choose the city, get ready to go, and then find your feet once you land: what students nearby are saying, where to eat and train, groups to join, and weekends that fit your budget."));
    var cta = elem("div", "land-cta");
    var b1 = elem("button", "btn", "Find your city");
    b1.dataset.go = "match";
    var b2 = elem("button", "btn btn--ghost", "Look around Bilbao");
    b2.addEventListener("click", function () { setMode("there", true); });
    cta.appendChild(b1); cta.appendChild(b2);
    hero.appendChild(cta);
    box.appendChild(hero);

    var grid = elem("section", "land-grid");
    FEATURES.forEach(function (f) {
      var card = elem("article", "land-card");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.appendChild(artBox(f[1]));
      card.appendChild(elem("h3", null, f[2]));
      card.appendChild(elem("p", null, f[3]));
      var open = function () { setMode("there", false); go(f[4]); };
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      grid.appendChild(card);
    });
    box.appendChild(grid);

    var bil = byId("bilbao");
    var strip = elem("section", "land-strip");
    strip.appendChild(elem("h3", null, "Bilbao first"));
    strip.appendChild(elem("p", null, "The app is live in one city while we get it right. Green coast, surf 30 minutes away on the metro, and the best food in Spain."));
    var nums = elem("div", "land-nums");
    [["€" + monthly(bil), "a month, all in"], [bil.erasmus.toLocaleString("en-GB"), "Erasmus students a year"],
     [bil.jul + "°", "average July high"], ["3", "universities"]]
      .forEach(function (n) {
        var d = elem("div", "land-num");
        d.appendChild(elem("b", null, n[0]));
        d.appendChild(elem("span", null, n[1]));
        nums.appendChild(d);
      });
    strip.appendChild(nums);
    var unis = elem("div", "land-unis");
    bil.unis.forEach(function (u) {
      var row = elem("div", "land-uni");
      row.appendChild(artBox("campus"));
      var t = elem("div");
      t.appendChild(elem("b", null, u[0]));
      t.appendChild(elem("span", null, u[1]));
      row.appendChild(t);
      unis.appendChild(row);
    });
    strip.appendChild(unis);
    var sb = elem("button", "btn", "Open the Bilbao app");
    sb.addEventListener("click", function () { setMode("there", true); });
    strip.appendChild(sb);
    box.appendChild(strip);

    box.appendChild(elem("p", "note", "Illustrations, not photographs. Figures are sourced: rents from idealista, climate from AEMET, Erasmus numbers from the European Commission."));
  }

  /* ================= city detail ================= */

  var openCityId = null;

  function openCity(id) {
    openCityId = id;
    var c = byId(id);
    var view = $("#v-city");
    view.textContent = "";

    var hero = elem("header", "chero");
    hero.style.setProperty("--a", c.a); hero.style.setProperty("--b", c.b);
    hero.appendChild(picBox(CITY_PHOTO[c.id], CITY_ART[c.id] || "city", "chero__art"));
    var row = elem("div", "chero__row");
    var left = elem("div");
    left.appendChild(elem("h2", "chero__name", c.name));
    left.appendChild(elem("p", "chero__sub", c.region + " · " + c.pop + " people · " + c.tag));
    var m = elem("div", "match");
    var pct = matchScore(c);
    m.style.setProperty("--p", pct + "%");
    m.appendChild(elem("span", null, pct + "%"));
    row.appendChild(left); row.appendChild(m);
    hero.appendChild(row);

    var acts = elem("div", "chero__acts");
    var shortBtn = elem("button", "btn btn--sm" + (state.shortlist.indexOf(c.id) > -1 ? " is-on" : ""), state.shortlist.indexOf(c.id) > -1 ? "Shortlisted" : "Shortlist");
    shortBtn.addEventListener("click", function () {
      var i = state.shortlist.indexOf(c.id);
      if (i > -1) { state.shortlist.splice(i, 1); toast("Removed from shortlist"); }
      else { state.shortlist.push(c.id); toast(c.name + " shortlisted"); }
      save();
      shortBtn.textContent = state.shortlist.indexOf(c.id) > -1 ? "Shortlisted" : "Shortlist";
      shortBtn.classList.toggle("is-on", state.shortlist.indexOf(c.id) > -1);
      renderMe();
    });
    var cmpBtn = elem("button", "btn btn--sm btn--ghost", state.compare.indexOf(c.id) > -1 ? "In compare" : "Compare");
    cmpBtn.addEventListener("click", function () {
      toggleCompare(c.id);
      cmpBtn.textContent = state.compare.indexOf(c.id) > -1 ? "In compare" : "Compare";
    });
    var goBtn = elem("button", "btn btn--sm btn--ghost", state.destination === c.id ? "You're going here" : "I'm going here");
    goBtn.addEventListener("click", function () { chooseDestination(c); goBtn.textContent = "You're going here"; });
    acts.appendChild(shortBtn); acts.appendChild(cmpBtn); acts.appendChild(goBtn);
    hero.appendChild(acts);
    view.appendChild(hero);

    // why you'd like it
    var why = elem("section", "block");
    why.appendChild(sectionHead("Why " + c.name + ", for you"));
    var pills = elem("div", "pills");
    var wanted = (state.prefs.priorities || []).map(function (k) {
      return { safety: "safety", nightlife: "night", afford: null, food: "food", intl: null, outdoor: "hike" }[k];
    }).filter(function (k) { return k && (c.acts[k] || 0) >= 4; });
    (wanted.length ? wanted : Object.keys(c.acts).filter(function (k) { return c.acts[k] === 5; }))
      .forEach(function (k) {
        var a = ACTS.filter(function (x) { return x.k === k; })[0];
        if (a) pills.appendChild(elem("span", null, a.s));
      });
    why.appendChild(pills);
    var ul = elem("ul", "mini");
    c.why.forEach(function (w) { var li = elem("li"); li.appendChild(elem("b", null, w)); ul.appendChild(li); });
    why.appendChild(ul);
    view.appendChild(why);

    // dimensions
    var dbox = elem("section", "block");
    dbox.appendChild(sectionHead("How it scores"));
    var dl = elem("div", "dims");
    dims(c).forEach(function (d) {
      var row2 = elem("div", "dim");
      row2.appendChild(elem("span", "dim__k", d.k));
      var bar = elem("div", "dim__bar");
      var fill = elem("i");
      fill.style.setProperty("--w", Math.round(d.w * 100) + "%");
      bar.appendChild(fill);
      row2.appendChild(bar);
      row2.appendChild(elem("span", "dim__v", d.v));
      dl.appendChild(row2);
    });
    dbox.appendChild(dl);
    view.appendChild(dbox);

    // cost
    var cbox = elem("section", "block");
    cbox.appendChild(sectionHead("What a month costs"));
    var costs = elem("div", "costs");
    [["€" + c.cost.rent, "Room in a shared flat"], ["€" + c.cost.meal, "Cheap meal out"],
     [c.cost.transport ? "€" + c.cost.transport : "Free", "Transport, student rate"], ["€" + monthly(c), "A month, all in"]]
      .forEach(function (x) {
        var d = elem("div", "cost");
        d.appendChild(elem("b", null, x[0]));
        d.appendChild(elem("span", null, x[1]));
        costs.appendChild(d);
      });
    cbox.appendChild(costs);
    cbox.appendChild(elem("p", "hint", "Transport: " + c.cost.tNote + "."));
    var mo = monthly(c);
    cbox.appendChild(elem("p", "note", "The monthly figure is rent + €" + FOOD + " food + transport + €" + OTHER + " for everything else, built the same way for all ten cities. "
      + (function () {
        var band = BUDGET_BAND[state.prefs.budget] || BUDGET_BAND[2];
        return band.cap >= mo
          ? "Your " + band.label + " band covers it, with about €" + Math.max(0, band.cap - mo) + " spare."
          : "That is about €" + (mo - band.cap) + " above your " + band.label + " band.";
      })()));
    view.appendChild(cbox);

    // climate
    var clim = elem("section", "block");
    clim.appendChild(sectionHead("Climate through the year"));
    var cstats = elem("div", "costs");
    [[c.jul + "°", "July, average high"], [c.jan + "°", "January, average high"],
     [c.rainMm.toLocaleString("en-GB") + " mm", "Rain a year"], [c.rainDays + " days", "With rain"]]
      .forEach(function (x) {
        var d = elem("div", "cost");
        d.appendChild(elem("b", null, x[0]));
        d.appendChild(elem("span", null, x[1]));
        cstats.appendChild(d);
      });
    clim.appendChild(cstats);
    var hottest = CITIES.slice().sort(function (a, b) { return b.jul - a.jul; })[0];
    var wettest = CITIES.slice().sort(function (a, b) { return b.rainMm - a.rainMm; })[0];
    clim.appendChild(elem("p", "hint",
      (c === hottest ? "The hottest summers on this list. " : c === wettest ? "The wettest city on this list. " : "") +
      "Official 1991–2020 normals, AEMET in Spain and IPMA in Portugal."));
    view.appendChild(clim);

    // language and study
    var lang = elem("section", "block");
    lang.appendChild(sectionHead("Language and study"));
    var lp = elem("div", "pills");
    lp.appendChild(elem("span", null, c.langs));
    lp.appendChild(elem("span", null, "English " + c.ef + " on the EF index" + (c.efRegion ? " (Basque Country)" : "")));
    lp.appendChild(elem("span", null, c.erasmus.toLocaleString("en-GB") + " Erasmus students a year"));
    lang.appendChild(lp);
    lang.appendChild(elem("p", "hint", (c.erasmusNote ? c.erasmusNote + ". " : "")
      + "EF's 2025 index puts " + c.country + " " + (c.country === "Portugal" ? "6th of 123 countries; every Portuguese city scores above every Spanish one." : "36th of 123 countries.")));
    var unis = elem("ul", "unis");
    c.unis.forEach(function (u) {
      var li = elem("li");
      li.appendChild(elem("b", null, u[0]));
      li.appendChild(elem("span", null, u[1]));
      unis.appendChild(li);
    });
    lang.appendChild(unis);
    view.appendChild(lang);

    // travel
    var tv = elem("section", "block");
    tv.appendChild(sectionHead("Getting there and back"));
    var tp = elem("div", "pills");
    tp.appendChild(elem("span", null, AIR_LABEL[c.air]));
    tp.appendChild(elem("span", null, c.country === "Spain" ? "Trains and buses across Spain" : "Cheap flights across Europe"));
    tv.appendChild(tp);
    tv.appendChild(elem("p", "hint", c.airNote));
    view.appendChild(tv);

    if (c.warn) {
      var w = elem("div", "warn");
      w.appendChild(elem("p", "warn__k", "Worth knowing"));
      w.appendChild(elem("p", null, c.warn));
      view.appendChild(w);
    }

    var srcBtn = elem("button", "btn btn--ghost btn--wide", "Where these numbers come from");
    srcBtn.addEventListener("click", openSources);
    view.appendChild(srcBtn);

    if (current !== "city") go("city"); else swap("city");
  }

  var SOURCES = [
    ["Room rents", "idealista's room-price series, Q2–Q3 2026. Granada and Salamanca come from other reports, so they're less directly comparable."],
    ["Meals", "Numbeo, pages updated August–September 2026. Salamanca, Granada and Bilbao rest on about 25 contributors each, so treat them loosely."],
    ["Transport", "The operators themselves, September 2026: CTB, TMB and ATM, CRTM, ATMV and EMT, TUSSAM, Salamanca council, Dbus, navegante and Andante. Youth prices, which usually need you to be registered in the city. Valencia's is confirmed only to 30 June 2026."],
    ["Safety", "Numbeo's safety index. It is crowdsourced perception, not police data. Bilbao's weak score clashes with Basque official statistics and looks like a small-sample artefact."],
    ["Climate", "Official 1991–2020 normals: AEMET in Spain, IPMA in Portugal. Station choice matters, so a degree either way is normal."],
    ["Flights", "Airline and airport schedules as of September 2026. Routes change every season, and some are summer-only."],
    ["English", "EF English Proficiency Index 2025, city scores. Portugal ranks 6th of 123 countries, Spain 36th, and every Portuguese city here scores above every Spanish one. San Sebastián isn't in EF's city table, so it uses the Basque Country score."],
    ["Erasmus numbers", "Official European Commission mobility microdata for 2023, counted by receiving city. San Sebastián's 143 is a known undercount: UPV/EHU registers most exchange students under Leioa, near Bilbao."],
    ["Universities", "Institution names and campus locations checked September 2026. Watch the campus trap: UAB, UAM, Carlos III, Pablo de Olavide and UPV/EHU's Bizkaia campus are not in the city their name suggests."],
    ["Our own calls", "Nightlife, outdoors, culture and academic fit are Corners' rough ratings, not measurements. Argue with them."]
  ];

  function openSources() {
    openSheet(function (box) {
      box.appendChild(elem("h2", null, "Where the numbers come from"));
      box.appendChild(elem("p", null, "Gathered on 22 September 2026 for this demo. Good enough to compare cities, not good enough to sign a lease on."));
      var kv = elem("dl", "kv");
      SOURCES.forEach(function (s) {
        var d = elem("div");
        d.appendChild(elem("dt", null, s[0]));
        d.appendChild(elem("dd", null, s[1]));
        kv.appendChild(d);
      });
      kv.classList.add("kv--stack");
      box.appendChild(kv);
    });
  }

  function sectionHead(text) {
    var d = elem("div", "block__head");
    d.appendChild(elem("h2", "block__h", text));
    return d;
  }

  function chooseDestination(c) {
    state.destination = c.id;
    save();
    renderMe(); renderPrep();
    if (c.live) {
      toast("Bilbao it is. The city app is live.");
      setTimeout(function () { setMode("there", true); }, 600);
    } else {
      toast(c.name + " saved. The city app is Bilbao-only for now.");
      setTimeout(function () { setMode("there", true); }, 600);
    }
  }

  /* ================= compare ================= */

  function toggleCompare(id) {
    var i = state.compare.indexOf(id);
    if (i > -1) state.compare.splice(i, 1);
    else {
      if (state.compare.length >= 3) { toast("Three at a time. Remove one first."); return; }
      state.compare.push(id);
    }
    save();
    renderCompare();
    renderCities();
  }

  function renderCompare() {
    var picks = $("[data-compare-picks]"), table = $("[data-compare-table]");
    if (!picks) return;
    picks.textContent = "";
    CITIES.forEach(function (c) {
      var b = elem("button", "pick" + (state.compare.indexOf(c.id) > -1 ? " is-on" : ""), c.name);
      b.type = "button";
      b.setAttribute("aria-pressed", String(state.compare.indexOf(c.id) > -1));
      b.addEventListener("click", function () { toggleCompare(c.id); });
      picks.appendChild(b);
    });

    table.textContent = "";
    var chosen = state.compare.map(byId).filter(Boolean);
    if (!chosen.length) {
      var tr = table.insertRow();
      var td = tr.insertCell();
      td.className = "empty-cell";
      td.textContent = "Pick a city or two above.";
      return;
    }
    var thead = table.createTHead();
    var hr = thead.insertRow();
    hr.appendChild(elem("th", null, ""));
    chosen.forEach(function (c) {
      var th = elem("th");
      var wrap = elem("span", "ctable__city");
      var sw = elem("i"); sw.style.setProperty("--a", c.a); sw.style.setProperty("--b", c.b);
      wrap.appendChild(sw); wrap.appendChild(document.createTextNode(c.name));
      th.appendChild(wrap);
      hr.appendChild(th);
    });

    var tb = table.createTBody();
    var rows = [
      ["Match", function (c) { return matchScore(c) + "%"; }, function (c) { return matchScore(c) / 100; }, true, "rating"],
      ["Monthly budget", function (c) { return "€" + monthly(c); }, costScore, true, "sourced"],
      ["Housing availability", function (c) { return HOUSE_LABEL[c.house]; }, function (c) { return c.house / 5; }, true, "rating"],
      ["Safety rating", function (c) { return c.safety.toFixed(0) + "/100"; }, function (c) { return c.safety / 100; }, true, "sourced"],
      ["Transit & walkability", function (c) { return TRANSIT_LABEL[c.transit]; }, function (c) { return c.transit / 5; }, true, "rating"],
      ["English accessibility", function (c) { return c.ef + " EF"; }, engScore, true, "sourced"],
      ["Climate & weather", function (c) { return c.jul + "° / " + c.jan + "°"; }, null, false, "sourced"],
      ["Social & nightlife", function (c) { return c.acts.night + "/5 · " + c.erasmus.toLocaleString("en-GB") + " Erasmus"; }, function (c) { return (c.acts.night / 5 * .5) + clamp(c.erasmus / 5400, 0, 1) * .5; }, true, "rating"],
      ["Travel connectivity", function (c) { return AIR_LABEL[c.air]; }, travelScore, true, "sourced"],
      ["Part-time work", function (c) { return c.country === "Spain" ? "Up to ~30 h/week" : "Part-time allowed"; }, null, false, "unverified"],
      ["Student tips", function (c) { return c.tips + " uploaded"; }, function (c) { return clamp(c.tips / 130, .05, 1); }, true, "demo"],
      ["Room rent", function (c) { return "€" + c.cost.rent; }, function (c) { return clamp((700 - c.cost.rent) / 400, 0, 1); }, true, "sourced"],
      ["Transport, student", function (c) { return c.cost.transport ? "€" + c.cost.transport : "Free"; }, function (c) { return clamp(1 - c.cost.transport / 30, 0, 1); }, true, "sourced"]
    ];
    var CHIP = {
      sourced: ["Sourced", "kindchip--sourced"],
      rating: ["Our rating", "kindchip--rating"],
      unverified: ["Unverified", "kindchip--rating"],
      demo: ["Demo data", "kindchip--demo"]
    };
    rows.forEach(function (r) {
      var tr = tb.insertRow();
      var th = elem("th");
      th.appendChild(document.createTextNode(r[0]));
      var kind = CHIP[r[4] || "sourced"];
      var chip = elem("button", "kindchip " + kind[1], kind[0]);
      chip.type = "button";
      chip.title = "Where this comes from";
      chip.addEventListener("click", openSources);
      th.appendChild(chip);
      tr.appendChild(th);
      var best = -1;
      if (r[3]) chosen.forEach(function (c) { best = Math.max(best, r[2](c)); });
      chosen.forEach(function (c) {
        var td = elem("td");
        var val = elem("span", r[3] && r[2](c) === best && chosen.length > 1 ? "win" : null, r[1](c));
        td.appendChild(val);
        if (r[2]) {
          var bar = elem("span", "cbar");
          var fill = elem("i");
          fill.style.setProperty("--w", Math.round(r[2](c) * 100) + "%");
          bar.appendChild(fill);
          td.appendChild(bar);
        }
        tr.appendChild(td);
      });
    });
  }

  /* ================= prepare ================= */

  var PREP = [
    { when: "As soon as you're accepted", items: [
      ["p1", "Check your passport is valid six months past your return"],
      ["p2", "Start the student visa, if you need one (non-EU, over 90 days)"],
      ["p3", "Sign the learning agreement with both universities"],
      ["p4", "Start looking at housing, before the rest of your cohort does"],
      ["p5", "Sort health insurance: EHIC for EU students, private cover otherwise"]
    ] },
    { when: "A month before", items: [
      ["p6", "Book flights, and check the baggage rules twice"],
      ["p7", "Confirm housing and read the contract before you sign"],
      ["p8", "Get a card that doesn't charge you for spending abroad"],
      ["p9", "Sort a phone plan or an eSIM for the first week"],
      ["p10", "Tell your bank where you're going"]
    ] },
    { when: "The week before", items: [
      ["p11", "Save digital copies of passport, insurance and acceptance letter"],
      ["p12", "Work out how you get from the airport at 23:00"],
      ["p13", "Pack for the climate you looked up, not the one you imagined"],
      ["p14", "Have some cash for the first day"],
      ["p15", "Learn ten words. Hello, please, thank you, and a drink order"]
    ] }
  ];

  function renderPrep() {
    var hero = $("[data-prep-hero]"), box = $("[data-prep]");
    if (!box) return;
    var dest = state.destination ? byId(state.destination) : null;
    var total = PREP.reduce(function (n, p) { return n + p.items.length; }, 0);
    var done = state.prep.length;

    hero.textContent = "";
    var row = elem("div", "card__row");
    var l = elem("div");
    l.appendChild(elem("p", "micro", dest ? "You're going to" : "No city chosen yet"));
    l.appendChild(elem("h2", "card__title", dest ? dest.name + ", " + dest.country : "Pick a city first"));
    l.appendChild(elem("p", "card__meta", dest
      ? "Autumn 2026 · " + done + " of " + total + " things done"
      : "The list works anyway, but it's better once we know where you're going."));
    var ring = elem("div", "ring ring--lg");
    ring.style.setProperty("--p", (done / total * 100).toFixed(1) + "%");
    ring.appendChild(elem("span", null, done + "/" + total));
    row.appendChild(l); row.appendChild(ring);
    hero.appendChild(row);
    if (!dest) {
      var b = elem("button", "btn btn--sm", "Find your city");
      b.dataset.go = "match";
      hero.appendChild(b);
    }

    box.textContent = "";
    PREP.forEach(function (phase) {
      var card = elem("section", "phase");
      var head = elem("div", "phase__head");
      head.appendChild(elem("p", "phase__when", phase.when));
      var n = phase.items.filter(function (i) { return state.prep.indexOf(i[0]) > -1; }).length;
      head.appendChild(elem("p", "phase__n", n + "/" + phase.items.length));
      card.appendChild(head);
      var ul = elem("ul", "checks");
      phase.items.forEach(function (it) {
        var li = elem("li");
        var input = elem("input");
        input.type = "checkbox"; input.id = it[0];
        input.checked = state.prep.indexOf(it[0]) > -1;
        var label = elem("label", null, it[1]);
        label.setAttribute("for", it[0]);
        input.addEventListener("change", function () {
          var i = state.prep.indexOf(it[0]);
          if (input.checked && i < 0) state.prep.push(it[0]);
          if (!input.checked && i > -1) state.prep.splice(i, 1);
          save(); renderPrep();
        });
        li.appendChild(input); li.appendChild(label);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      box.appendChild(card);
    });
  }

  /* ================= Bilbao: posts ================= */

  var POSTS = [
    { id: "p1", text: "Pintxo pote on Calle Pozas tonight. Six of us by the door, come say hi.", km: 0.4, mins: 40, votes: 61, c: "var(--h8)", replies: ["Which bar? There are about nine of them", "We're the loud table at the back"] },
    { id: "p2", text: "Does anyone else's teacher switch to Basque when she's annoyed, or is it just my class", km: 2.1, mins: 180, votes: 88, c: "var(--h4)", replies: ["Mine switches to Basque when she's happy too", "That's how you know you're in trouble"] },
    { id: "p3", text: "Is the bus to Sopelana running on Sunday or am I walking to the beach", km: 1.2, mins: 12, votes: 34, c: "var(--h2)", replies: ["Metro line 1 goes there, it's faster anyway", "Sunday service is thinner, check before you go"] },
    { id: "p4", text: "PSA the washing machines at the laundrette by the metro eat coins. Use the card ones.", km: 0.8, mins: 120, votes: 27, c: "var(--h6)", replies: ["Lost two euros there last week"] },
    { id: "p5", text: "Anyone driving to the Picos this weekend with a free seat? I'll pay petrol", km: 3.4, mins: 240, votes: 19, c: "var(--h9)", replies: ["There's a hiking group going, check Groups"] },
    { id: "p6", text: "Artxanda at sunset tonight was unreal. Go before the rain comes back", km: 1.8, mins: 300, votes: 44, c: "var(--h11)", replies: ["The funicular queue is short on weekdays"] },
    { id: "p7", text: "Is it normal that my landlord wants two months' deposit", km: 2.3, mins: 420, votes: 52, c: "var(--h7)", replies: ["One month plus one is common, two is pushing it", "Ask your international office before you sign"] }
  ];
  var RECS = [
    { id: "r1", cat: "food", t: "Pintxo pote in Casco Viejo", m: "Thursdays · bar to bar", tags: ["Thursdays", "Under €5"], c: "var(--h2)", about: "A drink and a pintxo for a few euros, then you move to the next bar. Thursday evenings, Casco Viejo." },
    { id: "r2", cat: "food", t: "Menú del día near Abando", m: "Weekday lunch · three courses", tags: ["Weekdays", "Under €15"], c: "var(--h3)", about: "Three courses, bread and a drink at lunchtime on weekdays. The cheapest proper meal you will eat here." },
    { id: "r3", cat: "food", t: "La Ribera market", m: "Food stalls by the river", tags: ["Groups", "Mixed prices"], c: "var(--h5)", about: "Stalls under one roof. Everyone orders something different and shares one table." },
    { id: "r4", cat: "food", t: "Late food in Indautxu", m: "After the bars close", tags: ["Late", "Under €10"], c: "var(--h1)", about: "For when every kitchen in the city has shut and you still have to get home." },
    { id: "r5", cat: "gym", t: "Municipal sports centres", m: "Bilbao Kirolak · monthly pass", tags: ["Monthly pass", "Pools"], c: "var(--h7)", about: "The city's own gyms and pools, spread across the neighbourhoods, on a monthly pass." },
    { id: "r6", cat: "gym", t: "Your university's sports service", m: "Campus gym, classes and teams", tags: ["Campus", "Teams"], c: "var(--h8)", about: "Usually the cheapest option and the easiest way into a team." },
    { id: "r7", cat: "gym", t: "Surf in Sopelana", m: "End of metro line 1", tags: ["Beach", "Weekends"], c: "var(--h6)", about: "Lessons and board rental on the beach at the end of the metro line." },
    { id: "r8", cat: "gym", t: "Running along the Ría", m: "Flat loop past the Guggenheim", tags: ["Free", "Groups run it"], c: "var(--h5)", about: "Flat, lit, and about 5 km if you turn at the bridge." },
    { id: "r9", cat: "events", t: "Athletic Club at San Mamés", m: "Match days", tags: ["Tickets", "Loud"], c: "var(--h1)", about: "The city's football team and the fastest way to understand Bilbao." },
    { id: "r10", cat: "events", t: "Language exchange nights", m: "Bars across the centre · weekly", tags: ["Weekly", "Free"], c: "var(--h9)", about: "Half an hour in your language, half an hour in theirs." },
    { id: "r11", cat: "events", t: "Aste Nagusia", m: "August · the big week", tags: ["August", "Free"], c: "var(--h10)", about: "Nine days of concerts, fireworks and txosnas in August." },
    { id: "r12", cat: "todo", t: "The Artxanda funicular", m: "Up the hill, whole-city view", tags: ["Sunset", "Cheap"], c: "var(--h4)", about: "Two minutes up the hill and the entire city is underneath you." },
    { id: "r13", cat: "todo", t: "San Juan de Gaztelugatxe", m: "Stone steps to the island chapel", tags: ["Half day", "By bus"], c: "var(--h6)", about: "241 steps out to a chapel on a rock, an hour up the coast." },
    { id: "r14", cat: "todo", t: "Bizkaia Bridge", m: "Portugalete · transporter bridge", tags: ["Metro", "Cheap"], c: "var(--h8)", about: "A hanging gondola that carries cars across the river." }
  ];
  var GROUPS = [
    { id: "language", name: "Language exchange", n: 405, c: "var(--h5)", next: "Tonight 20:00 · Café Iruña" },
    { id: "travel", name: "Weekend travel", n: 520, c: "var(--h8)", next: "Saturday · San Sebastián day trip" },
    { id: "surf", name: "Surf Sopelana", n: 212, c: "var(--h1)", next: "Sunday 10:00 · metro from Moyúa" },
    { id: "hike", name: "Hiking Bizkaia", n: 340, c: "var(--h6)", next: "Saturday 9:00 · Picos day walk" },
    { id: "football", name: "Sunday football", n: 131, c: "var(--h2)", next: "Sunday 18:00 · Deusto pitches" },
    { id: "basque", name: "Basque for beginners", n: 96, c: "var(--h3)", next: "Wednesday 19:00 · library room 2" },
    { id: "film", name: "Film club", n: 74, c: "var(--h9)", next: "Thursday 21:00 · original version night" },
    { id: "games", name: "Thursday board games", n: 58, c: "var(--h10)", next: "Thursday 19:30 · café on Ledesma" },
    { id: "climb", name: "Climbing", n: 67, c: "var(--h11)", next: "Tuesday 18:00 · the wall in Zorroza" },
    { id: "photo", name: "Photography walks", n: 83, c: "var(--h7)", next: "Sunday 11:00 · Casco Viejo" }
  ];
  var GUIDES = [
    { id: "g1", t: "Pintxo tour of Casco Viejo", cat: "Food", dur: "2.5 h", price: 25, a: "#F59C5E", b: "#6A63FF", about: "Five bars, the right order at each one, with a student guide who lives here." },
    { id: "g2", t: "Surf lesson in Sopelana", cat: "Sport", dur: "3 h", price: 30, a: "#2EC7DB", b: "#2F6BFF", about: "Board, wetsuit and an instructor. Beginners welcome." },
    { id: "g3", t: "Guggenheim with a guide", cat: "Culture", dur: "2 h", price: 18, a: "#A6A8F7", b: "#1B2440", about: "The building, the collection and what the city was before it." },
    { id: "g4", t: "Gaztelugatxe and Bermeo", cat: "Day trip", dur: "6 h", price: 35, a: "#72CF8E", b: "#1F5F8A", about: "The island steps in the morning, a fishing town for lunch." },
    { id: "g5", t: "Basque cooking class", cat: "Food", dur: "3 h", price: 45, a: "#F090C8", b: "#4E2A8A", about: "Cook four pintxos in a shared kitchen, then eat all of them." },
    { id: "g6", t: "A day in La Rioja", cat: "Day trip", dur: "9 h", price: 60, a: "#DDAE45", b: "#7A1F3D", about: "Two wineries and a long village lunch, transport included." },
    { id: "g7", t: "Kayak on the Ría", cat: "Sport", dur: "2 h", price: 28, a: "#6FB8F5", b: "#0F3B4F", about: "Paddle under the bridges and past the museum." }
  ];
  var TRIPS = [
    { id: "t1", name: "San Sebastián", how: "Bus · 1 h 20", travel: 16, bed: 35, food: 20, min: 0 },
    { id: "t2", name: "Vitoria-Gasteiz", how: "Bus · 1 h", travel: 14, bed: 26, food: 16, min: 0 },
    { id: "t3", name: "Santander", how: "Bus · 1 h 30", travel: 22, bed: 30, food: 18, min: 0 },
    { id: "t4", name: "Logroño", how: "Bus · 2 h", travel: 28, bed: 28, food: 20, min: 0 },
    { id: "t5", name: "Biarritz", how: "Bus · 2 h 30", travel: 32, bed: 42, food: 26, min: 0 },
    { id: "t6", name: "Picos de Europa", how: "Car share · 2 h 30", travel: 38, bed: 22, food: 18, min: 1 },
    { id: "t7", name: "Madrid", how: "Train · 5 h", travel: 50, bed: 30, food: 22, min: 1 },
    { id: "t8", name: "Porto", how: "Flight · 1 h", travel: 75, bed: 26, food: 18, min: 1 }
  ];
  var DATES = [
    { d: "1 Sep", s: "Arrival and orientation", k: "done" },
    { d: "8 Sep", s: "Classes start", k: "done" },
    { d: "19 Sep", s: "Last day to change classes", k: "done" },
    { d: "20 Oct", s: "Midterms week", k: "next" },
    { d: "15 Dec", s: "Final exams begin", k: "" }
  ];
  var CHECKS = [
    { id: "c1", s: "Local SIM card" }, { id: "c2", s: "Save 112, the emergency number" },
    { id: "c3", s: "Get a Barik transport card" }, { id: "c4", s: "Register at the town hall (empadronamiento)" },
    { id: "c5", s: "Book a TIE appointment (non-EU students)" }, { id: "c6", s: "Find your campus gym" }
  ];
  var CONTACTS = [
    { b: "Programme coordinator", s: "Office hours Tue & Thu" },
    { b: "International office", s: "UPV/EHU, Deusto or Mondragon" },
    { b: "Emergencies", s: "112, any time" }
  ];
  var ASKED = ["How long does a TIE appointment take?", "Is a two-month deposit normal?", "Does the Barik card work on the beach train?"];

  function score(p) { return (p.votes || 0) + (state.votes[p.id] || 0); }
  function allPosts() { return state.posts.concat(POSTS); }
  function ago(mins) {
    if (mins < 1) return "just now";
    if (mins < 60) return mins + " min";
    if (mins < 1440) return Math.round(mins / 60) + " h";
    return Math.round(mins / 1440) + " d";
  }

  var feed = $("[data-feed]"), homeFeed = $("[data-home-feed]"), sortMode = "hot";

  function voteBox(p, onChange) {
    var box = elem("div", "vote");
    var up = elem("button", "up", "▲"); up.setAttribute("aria-label", "Vote up");
    var out = elem("output", "vote__n", String(score(p)));
    var down = elem("button", "down", "▼"); down.setAttribute("aria-label", "Vote down");
    var paint = function () {
      var v = state.votes[p.id] || 0;
      up.classList.toggle("is-on", v === 1);
      down.classList.toggle("is-on", v === -1);
      up.setAttribute("aria-pressed", String(v === 1));
      down.setAttribute("aria-pressed", String(v === -1));
      out.textContent = score(p);
      out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
    };
    var hit = function (dir) {
      return function (e) {
        e.stopPropagation();
        state.votes[p.id] = (state.votes[p.id] || 0) === dir ? 0 : dir;
        save(); paint();
        if (onChange) onChange();
      };
    };
    up.addEventListener("click", hit(1));
    down.addEventListener("click", hit(-1));
    paint();
    box.appendChild(up); box.appendChild(out); box.appendChild(down);
    return box;
  }

  function postEl(p, compact) {
    var li = elem("li", "post" + (p.mine ? " post--mine" : ""));
    var body = elem("div", "post__body");
    body.tabIndex = 0; body.setAttribute("role", "button");
    var meta = elem("p", "post__meta micro");
    var pin = elem("span", "post__pin"); pin.style.setProperty("--c", p.c || "var(--blue)");
    meta.appendChild(pin);
    meta.appendChild(document.createTextNode((p.mine ? "You · " : "") + p.km.toFixed(1) + " km · " + ago(p.mins)));
    body.appendChild(meta);
    body.appendChild(elem("p", "post__text", p.text));
    if (!compact) body.appendChild(elem("p", "post__replies", (p.replies ? p.replies.length : 0) + ((p.replies || []).length === 1 ? " reply" : " replies")));
    var open = function () { openPost(p); };
    body.addEventListener("click", open);
    body.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    li.appendChild(body);
    li.appendChild(voteBox(p, compact ? null : function () { if (sortMode === "hot") renderFeed(true); }));
    return li;
  }

  function renderFeed(flip) {
    if (!feed) return;
    var first = {};
    if (flip && !reduce) $$(".post", feed).forEach(function (n, i) { first[i] = n.getBoundingClientRect().top; });
    var arr = allPosts().slice();
    if (sortMode === "hot") arr.sort(function (a, b) { return score(b) - score(a); });
    if (sortMode === "new") arr.sort(function (a, b) { return a.mins - b.mins; });
    if (sortMode === "near") arr.sort(function (a, b) { return a.km - b.km; });
    feed.textContent = "";
    arr.forEach(function (p) { feed.appendChild(postEl(p)); });
    if (flip && !reduce) {
      $$(".post", feed).forEach(function (n, i) {
        if (first[i] == null) return;
        var dy = first[i] - n.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) n.animate([{ transform: "translateY(" + dy + "px)" }, { transform: "none" }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
  }
  function renderHomeFeed() {
    if (!homeFeed) return;
    homeFeed.textContent = "";
    allPosts().slice().sort(function (a, b) { return score(b) - score(a); }).slice(0, 2)
      .forEach(function (p) { homeFeed.appendChild(postEl(p, true)); });
  }

  function openPost(p) {
    openSheet(function (box) {
      box.appendChild(elem("p", "micro", (p.mine ? "Your post · " : "Anonymous · ") + p.km.toFixed(1) + " km · " + ago(p.mins)));
      box.appendChild(elem("h2", null, p.text));
      var thread = elem("div", "thread");
      (p.replies || []).forEach(function (r) {
        var d = elem("div", "reply");
        d.appendChild(elem("p", "reply__who", "Anonymous"));
        d.appendChild(elem("p", null, r));
        thread.appendChild(d);
      });
      if (!(p.replies || []).length) thread.appendChild(elem("p", "empty", "No replies yet."));
      box.appendChild(thread);
      var field = elem("div", "field");
      var ta = elem("textarea"); ta.placeholder = "Reply anonymously…"; ta.maxLength = 160;
      var btn = elem("button", "btn btn--wide", "Reply");
      btn.addEventListener("click", function () {
        var v = ta.value.trim();
        if (!v) { ta.focus(); return; }
        p.replies = (p.replies || []).concat([v]);
        var d = elem("div", "reply reply--mine");
        d.appendChild(elem("p", "reply__who", "You · just now"));
        d.appendChild(elem("p", null, v));
        var em = thread.querySelector(".empty"); if (em) em.remove();
        thread.appendChild(d);
        ta.value = "";
        toast("Reply posted");
        renderFeed(); renderHomeFeed();
      });
      field.appendChild(ta); field.appendChild(btn);
      box.appendChild(field);
    });
  }

  function openComposer() {
    openSheet(function (box) {
      box.appendChild(elem("h2", null, "Post to Bilbao"));
      box.appendChild(elem("p", null, "Anonymous to other students, never to moderators."));
      var field = elem("div", "field");
      var ta = elem("textarea"); ta.placeholder = "What's happening near you?"; ta.maxLength = 160;
      var count = elem("p", "counter", "0 / 160");
      ta.addEventListener("input", function () { count.textContent = ta.value.length + " / 160"; });
      var btn = elem("button", "btn btn--wide", "Post anonymously");
      btn.addEventListener("click", function () {
        var v = ta.value.trim();
        if (!v) { ta.focus(); return; }
        state.posts.unshift({ id: "u" + Date.now(), text: v, km: 0.1, mins: 0, votes: 1, c: "var(--blue)", mine: true, replies: [] });
        save(); closeSheet();
        if (current !== "near") go("near");
        setTimeout(function () {
          renderFeed(); renderHomeFeed();
          var f = feed && feed.firstElementChild;
          if (f) f.classList.add("post--in");
          toast("Posted to Bilbao");
        }, 120);
      });
      field.appendChild(ta); field.appendChild(count); field.appendChild(btn);
      box.appendChild(field);
    });
  }

  $$("[data-compose]").forEach(function (b) { b.addEventListener("click", openComposer); });
  $$("[data-sort]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-sort]").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      sortMode = b.dataset.sort;
      renderFeed(true);
    });
  });
  var refreshBtn = $("[data-refresh]");
  if (refreshBtn) {
    var FRESH = [
      { text: "Free food at the student union until they run out. I'm not asking why", km: 0.7, c: "var(--h5)" },
      { text: "It's raining sideways again. Whoever told me Bilbao was sunny, we need to talk", km: 1.1, c: "var(--h7)" },
      { text: "Someone's guitar has been at the library front desk for a week. Come and get it", km: 1.9, c: "var(--h10)" }
    ];
    var fi = 0;
    refreshBtn.addEventListener("click", function () {
      refreshBtn.classList.remove("is-spinning"); void refreshBtn.offsetWidth; refreshBtn.classList.add("is-spinning");
      var f = FRESH[fi++ % FRESH.length];
      state.posts.unshift({ id: "f" + Date.now(), text: f.text, km: f.km, mins: 0, votes: 2, c: f.c, replies: [] });
      save();
      setTimeout(function () {
        renderFeed(); renderHomeFeed();
        var n = feed.firstElementChild;
        if (n) n.classList.add("post--in");
      }, 220);
    });
  }

  /* ---------- recs ---------- */
  var recsEl = $("[data-recs]"), recCat = "food";
  function saveBtn(r) {
    var b = elem("button", "save");
    b.appendChild(icon("i-save"));
    var paint = function () {
      var on = state.saves.indexOf(r.id) > -1;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", (on ? "Saved: " : "Save ") + r.t);
    };
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var i = state.saves.indexOf(r.id);
      if (i > -1) { state.saves.splice(i, 1); toast("Removed from saved"); }
      else { state.saves.push(r.id); toast("Saved"); }
      save(); paint(); renderMe();
      if (recCat === "saved") renderRecs();
    });
    paint();
    return b;
  }
  function renderRecs() {
    if (!recsEl) return;
    recsEl.textContent = "";
    var list = recCat === "saved" ? RECS.filter(function (r) { return state.saves.indexOf(r.id) > -1; })
      : RECS.filter(function (r) { return r.cat === recCat; });
    if (!list.length) {
      recsEl.appendChild(elem("li", "empty", recCat === "saved" ? "Nothing saved yet. Tap the bookmark on anything you like." : "Nothing here yet."));
      return;
    }
    list.forEach(function (r, i) {
      var li = elem("li", "rec");
      var badge = elem("span", "rec__badge", String(i + 1));
      badge.style.setProperty("--c", r.c);
      var body = elem("div", "rec__body");
      body.tabIndex = 0; body.setAttribute("role", "button");
      body.appendChild(elem("p", "rec__t", r.t));
      body.appendChild(elem("p", "rec__m", r.m));
      var tags = elem("div", "tagline");
      r.tags.forEach(function (t) { tags.appendChild(elem("span", null, t)); });
      body.appendChild(tags);
      var open = function () { openRec(r); };
      body.addEventListener("click", open);
      body.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      li.appendChild(badge); li.appendChild(body); li.appendChild(saveBtn(r));
      recsEl.appendChild(li);
      if (!reduce) li.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: i * 40, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
  }
  function openRec(r) {
    openSheet(function (box) {
      box.appendChild(elem("p", "micro", r.tags.join(" · ")));
      box.appendChild(elem("h2", null, r.t));
      box.appendChild(elem("p", "card__meta", r.m));
      box.appendChild(elem("p", null, r.about));
      var actions = elem("div", "sheet__actions");
      var s = elem("button", "btn", state.saves.indexOf(r.id) > -1 ? "Saved" : "Save this");
      s.addEventListener("click", function () {
        var i = state.saves.indexOf(r.id);
        if (i > -1) { state.saves.splice(i, 1); s.textContent = "Save this"; }
        else { state.saves.push(r.id); s.textContent = "Saved"; }
        save(); renderRecs(); renderMe();
      });
      var a = elem("button", "btn btn--ghost", "Ask about it nearby");
      a.addEventListener("click", function () { closeSheet(); setTimeout(openComposer, 320); });
      actions.appendChild(s); actions.appendChild(a);
      box.appendChild(actions);
    });
  }
  $$("[data-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-cat]").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      recCat = b.dataset.cat;
      renderRecs();
    });
  });

  /* ---------- groups ---------- */
  var groupsEl = $("[data-groups]"), joinedEl = $("[data-joined]"), joinedBlock = $("[data-joined-block]");
  function groupEl(g) {
    var joined = state.joins.indexOf(g.id) > -1;
    var li = elem("li", "group" + (joined ? " is-in" : ""));
    li.dataset.gid = g.id;
    li.style.setProperty("--c", g.c);
    li.appendChild(elem("span", "group__dot"));
    var body = elem("div", "group__body");
    body.tabIndex = 0; body.setAttribute("role", "button");
    body.appendChild(elem("p", "group__t", g.name));
    body.appendChild(elem("p", "group__m", g.n + " members · " + g.next));
    var open = function () { openGroup(g); };
    body.addEventListener("click", open);
    body.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    var btn = elem("button", "btn btn--sm" + (joined ? " is-on" : ""), joined ? "Joined" : "Join");
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggleGroup(g); });
    li.appendChild(body); li.appendChild(btn);
    return li;
  }
  function renderGroups() {
    if (!groupsEl) return;
    var firsts = new Map();
    if (!reduce) $$(".group").forEach(function (n) { firsts.set(n.dataset.gid, n.getBoundingClientRect().top); });
    var joined = GROUPS.filter(function (g) { return state.joins.indexOf(g.id) > -1; });
    var rest = GROUPS.filter(function (g) { return state.joins.indexOf(g.id) < 0; });
    joinedBlock.hidden = !joined.length;
    joinedEl.textContent = ""; groupsEl.textContent = "";
    joined.forEach(function (g) { joinedEl.appendChild(groupEl(g)); });
    rest.forEach(function (g) { groupsEl.appendChild(groupEl(g)); });
    if (!reduce) {
      $$(".group").forEach(function (n) {
        var was = firsts.get(n.dataset.gid);
        if (was == null) return;
        var dy = was - n.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) n.animate([{ transform: "translateY(" + dy + "px)" }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
  }
  function toggleGroup(g) {
    var i = state.joins.indexOf(g.id);
    if (i > -1) { state.joins.splice(i, 1); g.n--; toast("Left " + g.name); }
    else { state.joins.push(g.id); g.n++; toast("Joined " + g.name); }
    save(); renderGroups(); renderMe();
  }
  function openGroup(g) {
    openSheet(function (box) {
      box.appendChild(elem("p", "micro", g.n + " members"));
      box.appendChild(elem("h2", null, g.name));
      box.appendChild(elem("p", "card__meta", "Next: " + g.next));
      box.appendChild(elem("p", null, "Anyone can propose a plan. Turn up to the ones you like, skip the rest. Always somewhere public."));
      var actions = elem("div", "sheet__actions");
      var joined = state.joins.indexOf(g.id) > -1;
      var j = elem("button", "btn" + (joined ? " is-on" : ""), joined ? "Joined" : "Join group");
      j.addEventListener("click", function () {
        toggleGroup(g);
        var on = state.joins.indexOf(g.id) > -1;
        j.textContent = on ? "Joined" : "Join group";
        j.classList.toggle("is-on", on);
      });
      var going = elem("button", "btn btn--ghost", state.going[g.id] ? "Going ✓" : "I'm going to the next plan");
      going.addEventListener("click", function () {
        state.going[g.id] = !state.going[g.id];
        save();
        going.textContent = state.going[g.id] ? "Going ✓" : "I'm going to the next plan";
        toast(state.going[g.id] ? "See you there" : "Not going");
        renderHomeGoing();
      });
      actions.appendChild(j); actions.appendChild(going);
      box.appendChild(actions);
    });
  }

  /* ---------- guides ---------- */
  var guidesEl = $("[data-guides]");
  function renderGuides() {
    if (!guidesEl) return;
    guidesEl.textContent = "";
    GUIDES.forEach(function (g, i) {
      var li = elem("li", "guide");
      li.style.setProperty("--a", g.a); li.style.setProperty("--b", g.b);
      li.tabIndex = 0; li.setAttribute("role", "button");
      var img = elem("div", "guide__img");
      img.innerHTML = pic(GUIDE_PHOTO[g.id], GUIDE_ART[g.id] || "city");
      img.appendChild(elem("span", null, g.cat));
      img.appendChild(elem("span", null, g.dur));
      var body = elem("div", "guide__body");
      body.appendChild(elem("p", "guide__t", g.t));
      body.appendChild(elem("p", "guide__m", g.about.split(".")[0] + "."));
      var price = elem("p", "guide__p", "from ");
      price.appendChild(elem("b", null, "€" + g.price));
      body.appendChild(price);
      li.appendChild(img); li.appendChild(body);
      var open = function () { openGuide(g); };
      li.addEventListener("click", open);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      guidesEl.appendChild(li);
      if (!reduce) li.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 430, delay: i * 45, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    });
  }
  function openGuide(g) {
    openSheet(function (box) {
      var strip = elem("div", "hero-strip");
      strip.style.setProperty("--a", g.a); strip.style.setProperty("--b", g.b);
      box.appendChild(strip);
      box.appendChild(elem("p", "micro", g.cat + " · " + g.dur));
      box.appendChild(elem("h2", null, g.t));
      box.appendChild(elem("p", null, g.about));
      var btn = elem("button", "btn btn--wide", "Book for €" + g.price);
      btn.addEventListener("click", function () {
        btn.textContent = "Booked · demo only";
        btn.classList.add("is-on");
        btn.disabled = true;
        toast("Demo booking — nothing was charged");
      });
      box.appendChild(btn);
      box.appendChild(elem("p", "note", "Example listing. Prices are illustrative and no booking is real."));
    });
  }

  /* ---------- weekend trips ---------- */
  var tripsEl = $("[data-trips]"), planner = $("[data-planner]"), nights = 1, SCALE = 250;
  function renderTrips(flip) {
    if (!tripsEl) return;
    var budget = parseInt($("#budget").value, 10);
    $("[data-budget-out2]").textContent = "€" + budget;
    $("#budget").style.setProperty("--fill", ((budget - 30) / 220 * 100).toFixed(1) + "%");
    var firsts = new Map();
    if (flip && !reduce) $$(".trip", tripsEl).forEach(function (n) { firsts.set(n.dataset.tid, n.getBoundingClientRect().top); });
    TRIPS.forEach(function (t) {
      t.na = nights < t.min;
      t.bedCost = t.bed * nights;
      t.foodCost = t.food * (nights + 1);
      t.total = t.travel + t.bedCost + t.foodCost;
      t.over = !t.na && t.total > budget;
    });
    var rank = function (t) { return t.na ? 2 : t.over ? 1 : 0; };
    var sorted = TRIPS.slice().sort(function (a, b) { return rank(a) - rank(b) || a.total - b.total; });
    var fits = TRIPS.filter(function (t) { return !t.na && !t.over; }).length;
    tripsEl.textContent = "";
    sorted.forEach(function (t) {
      var li = elem("li", "trip" + (t.over ? " is-over" : "") + (t.na ? " is-na" : ""));
      li.dataset.tid = t.id;
      li.tabIndex = 0; li.setAttribute("role", "button");
      var left = elem("div");
      left.appendChild(elem("p", "trip__t", t.name));
      left.appendChild(elem("p", "trip__m", t.how));
      var right = elem("div", "trip__sum");
      right.appendChild(document.createTextNode(t.na ? "—" : "€" + t.total));
      right.appendChild(elem("span", "trip__st", t.na ? "Needs a night" : t.over ? "€" + (t.total - budget) + " over" : "€" + (budget - t.total) + " left"));
      var bar = elem("div", "trip__bar");
      bar.style.setProperty("--bx", Math.min(100, budget / SCALE * 100) + "%");
      [t.travel, t.bedCost, t.foodCost].forEach(function (val, i) {
        var s = elem("span", ["t", "b", "f"][i]);
        s.style.width = (t.na ? 0 : val / SCALE * 100) + "%";
        bar.appendChild(s);
      });
      var open = function () { openTrip(t, budget); };
      li.addEventListener("click", open);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      li.appendChild(left); li.appendChild(right); li.appendChild(bar);
      tripsEl.appendChild(li);
    });
    if (flip && !reduce) {
      $$(".trip", tripsEl).forEach(function (n) {
        var was = firsts.get(n.dataset.tid);
        if (was == null) return;
        var dy = was - n.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) n.animate([{ transform: "translateY(" + dy + "px)" }, { transform: "none" }], { duration: 540, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
    var count = $("[data-trip-count]");
    count.textContent = "";
    if (fits) {
      count.appendChild(elem("b", null, String(fits)));
      count.appendChild(document.createTextNode(" " + (fits === 1 ? "trip fits" : "trips fit") + " your budget"));
    } else count.textContent = "Nothing fits yet. Try a day trip or a bigger budget.";
    renderHomeTrip();
  }
  function openTrip(t, budget) {
    openSheet(function (box) {
      box.appendChild(elem("p", "micro", t.how + " · from Bilbao"));
      box.appendChild(elem("h2", null, t.name));
      box.appendChild(elem("p", "card__meta", nights === 0 ? "Day trip" : nights + (nights === 1 ? " night" : " nights")));
      var kv = elem("dl", "kv");
      [["Travel, return", t.travel], ["Bed" + (nights ? " × " + nights : ""), t.bedCost], ["Food × " + (nights + 1) + " days", t.foodCost], ["Total", t.total]]
        .forEach(function (r) {
          var d = elem("div");
          d.appendChild(elem("dt", null, r[0]));
          d.appendChild(elem("dd", null, "€" + r[1]));
          kv.appendChild(d);
        });
      box.appendChild(kv);
      box.appendChild(elem("p", null, t.na ? "This one needs at least one night to be worth the travel."
        : t.over ? "That's €" + (t.total - budget) + " over your budget. Cut a night, or split a room."
          : "Fits, with €" + (budget - t.total) + " to spare."));
      var actions = elem("div", "sheet__actions");
      var ask = elem("button", "btn", "Ask who else is going");
      ask.addEventListener("click", function () { closeSheet(); setTimeout(openComposer, 320); });
      var grp = elem("button", "btn btn--ghost", "Open the travel group");
      grp.addEventListener("click", function () { closeSheet(); setTimeout(function () { go("groups"); }, 320); });
      actions.appendChild(ask); actions.appendChild(grp);
      box.appendChild(actions);
      box.appendChild(elem("p", "note", "Rough estimates: return travel, a hostel bed and cheap food."));
    });
  }
  if (planner) {
    $("#budget").addEventListener("input", function () { renderTrips(true); });
    $$("[data-nights]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-nights]").forEach(function (o) { o.classList.toggle("is-on", o === b); });
        nights = parseInt(b.dataset.nights, 10);
        renderTrips(true);
      });
    });
  }

  /* ---------- programme ---------- */
  function renderProgramme() {
    var list = $("[data-checklist]");
    if (!list) return;
    list.textContent = "";
    CHECKS.forEach(function (c) {
      var li = elem("li");
      var input = elem("input");
      input.type = "checkbox"; input.id = c.id;
      input.checked = state.checks.indexOf(c.id) > -1;
      var label = elem("label", null, c.s);
      label.setAttribute("for", c.id);
      input.addEventListener("change", function () {
        var i = state.checks.indexOf(c.id);
        if (input.checked && i < 0) state.checks.push(c.id);
        if (!input.checked && i > -1) state.checks.splice(i, 1);
        save(); paintRings();
      });
      li.appendChild(input); li.appendChild(label);
      list.appendChild(li);
    });
    var dates = $("[data-dates]");
    dates.textContent = "";
    DATES.forEach(function (d) {
      var li = elem("li", d.k);
      li.appendChild(elem("time", null, d.d));
      li.appendChild(elem("span", null, d.s));
      dates.appendChild(li);
    });
    var contacts = $("[data-contacts]");
    contacts.textContent = "";
    CONTACTS.forEach(function (c) {
      var li = elem("li");
      li.appendChild(elem("b", null, c.b));
      li.appendChild(elem("span", null, c.s));
      contacts.appendChild(li);
    });
    var asked = $("[data-asked]");
    asked.textContent = "";
    ASKED.forEach(function (q) { asked.appendChild(elem("li", null, q)); });
    paintRings();
  }
  function paintRings() {
    var done = state.checks.length, total = CHECKS.length;
    var pct = (done / total * 100).toFixed(1) + "%";
    [["[data-ring]", "[data-ring-label]"], ["[data-home-ring]", "[data-home-ring-label]"]].forEach(function (pair) {
      var ring = $(pair[0]), label = $(pair[1]);
      if (!ring) return;
      ring.style.setProperty("--p", pct);
      label.textContent = done + "/" + total;
    });
    var next = CHECKS.filter(function (c) { return state.checks.indexOf(c.id) < 0; })[0];
    var el = $("[data-home-next]");
    if (el) el.textContent = next ? "Next: " + next.s.toLowerCase() : "All done. Nicely.";
  }

  /* ---------- home extras ---------- */
  function renderHomeTrip() {
    var el = $("[data-home-trip]");
    if (!el) return;
    var ss = TRIPS.filter(function (t) { return t.name === "San Sebastián"; })[0];
    el.textContent = "€" + (ss.travel + ss.food);
  }
  function renderHomePhoto() {
    var box = $("[data-home-photo]");
    if (!box) return;
    box.textContent = "";
    var card = photoCard({
      span: "", photo: "pintxos", scene: "pintxos",
      kicker: "Thursday", title: "Pintxo pote in Casco Viejo",
      text: "A drink and a pintxo for a few euros, bar to bar. The cheapest night out in the city.",
      onClick: function () { go("recs"); }
    });
    card.className = "pcard";
    box.appendChild(card);
  }

  function renderHomeGoing() {
    var b = $("[data-going]");
    if (!b) return;
    var on = !!state.going.language;
    b.textContent = on ? "Going ✓" : "I'm going";
    b.classList.toggle("is-on", on);
  }
  var goingBtn = $("[data-going]");
  if (goingBtn) {
    goingBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      state.going.language = !state.going.language;
      save(); renderHomeGoing();
      toast(state.going.language ? "See you at Café Iruña" : "Not going");
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (!t) return;
    var v = t.dataset.open.split(":");
    if (v[0] === "group") {
      var g = GROUPS.filter(function (x) { return x.id === v[1]; })[0];
      if (g) openGroup(g);
    }
    if (v[0] === "trip") {
      var tr = TRIPS.filter(function (x) { return x.name === v[1]; })[0];
      if (tr) openTrip(tr, parseInt($("#budget").value, 10));
    }
  });

  /* ---------- the city gate ---------- */
  function renderGate() {
    var gate = $("[data-city-gate]"), content = $("[data-city-content]");
    if (!gate) return;
    var dest = state.destination ? byId(state.destination) : null;
    var blocked = dest && !dest.live;
    gate.hidden = !blocked;
    content.hidden = !!blocked;
    $$(".rail__item").forEach(function (b) {
      if (["near", "recs", "groups", "guides", "trips", "prog"].indexOf(b.dataset.go) > -1) b.hidden = !!blocked;
    });
    var label = $("[data-rail-city-label]");
    if (label) label.textContent = dest ? "In " + dest.name : "When you arrive";
    if (!blocked) return;
    gate.textContent = "";
    var box = elem("div", "gate");
    box.appendChild(elem("h2", null, dest.name + " isn't live yet"));
    box.appendChild(elem("p", null, "Corners runs in Bilbao first. " + dest.name + " opens when enough people there are on the list — you're one of them now."));
    var actions = elem("div", "sheet__actions");
    var b1 = elem("button", "btn", "Look around Bilbao anyway");
    b1.addEventListener("click", function () {
      state.destination = "bilbao"; save(); renderGate(); renderMe(); toast("Showing Bilbao");
    });
    var b2 = elem("button", "btn btn--ghost", "Back to the cities");
    b2.dataset.go = "cities";
    actions.appendChild(b1); actions.appendChild(b2);
    box.appendChild(actions);
    gate.appendChild(box);
  }

  /* ================= me ================= */
  function initials(n) { return (n || "?").trim().charAt(0).toUpperCase(); }
  function renderMe() {
    var p = state.profile;
    $$("[data-avatar], [data-avatar-sm], [data-avatar-lg]").forEach(function (n) { n.textContent = initials(p.name); });
    var nameEl = $("[data-me-name]");
    if (nameEl) {
      nameEl.textContent = p.name;
      $("[data-me-sub]").textContent = p.role + " · autumn 2026";
      $("[data-stat-short]").textContent = state.shortlist.length;
      $("[data-stat-saved]").textContent = state.saves.length;
      $("[data-stat-groups]").textContent = state.joins.length;
    }
    var destBox = $("[data-me-dest]");
    if (destBox) {
      destBox.textContent = "";
      var dest = state.destination ? byId(state.destination) : null;
      var d = elem("div");
      if (dest) {
        d.appendChild(elem("b", null, "Going to " + dest.name));
        d.appendChild(elem("span", null, dest.country + " · " + (dest.live ? "the city app is live" : "city app not live yet")));
      } else {
        d.appendChild(elem("b", null, "No city chosen yet"));
        d.appendChild(elem("span", null, "Answer six questions and we'll rank ten of them"));
      }
      d.style.display = "grid";
      destBox.appendChild(d);
      var b = elem("button", "btn btn--sm btn--ghost", dest ? "Change" : "Find your city");
      b.dataset.go = dest ? "cities" : "match";
      destBox.appendChild(b);
    }
    var shortEl = $("[data-short-list]");
    if (shortEl) {
      shortEl.textContent = "";
      if (!state.shortlist.length) shortEl.appendChild(elem("li", "empty", "No cities shortlisted yet."));
      state.shortlist.map(byId).filter(Boolean).forEach(function (c) { shortEl.appendChild(cityCard(c)); });
    }
    var list = $("[data-saved-list]");
    if (list) {
      list.textContent = "";
      var saved = RECS.filter(function (r) { return state.saves.indexOf(r.id) > -1; });
      if (!saved.length) list.appendChild(elem("li", "empty", "Nothing saved in Bilbao yet."));
      saved.forEach(function (r) {
        var li = elem("li", "rec");
        var badge = elem("span", "rec__badge", "★");
        badge.style.setProperty("--c", r.c);
        var body = elem("div", "rec__body");
        body.appendChild(elem("p", "rec__t", r.t));
        body.appendChild(elem("p", "rec__m", r.m));
        body.addEventListener("click", function () { openRec(r); });
        li.appendChild(badge); li.appendChild(body); li.appendChild(saveBtn(r));
        list.appendChild(li);
      });
    }
    var hello = $("[data-hello]");
    if (hello) {
      var h = new Date().getHours();
      var part = h < 6 ? "Still up" : h < 12 ? "Good morning" : h < 19 ? "Good afternoon" : "Good evening";
      hello.textContent = part + ", " + p.name + ".";
    }
  }

  var editBtn = $("[data-edit-profile]");
  if (editBtn) {
    editBtn.addEventListener("click", function () {
      openSheet(function (box) {
        box.appendChild(elem("h2", null, "Your profile"));
        box.appendChild(elem("p", null, "Only your first name is ever shown, and never on Nearby."));
        var f1 = elem("div", "field");
        var l1 = elem("label", "label", "First name"); l1.setAttribute("for", "pf-name");
        var i1 = elem("input"); i1.type = "text"; i1.id = "pf-name"; i1.value = state.profile.name; i1.maxLength = 24;
        f1.appendChild(l1); f1.appendChild(i1);
        var f2 = elem("div", "field");
        var l2 = elem("label", "label", "You are"); l2.setAttribute("for", "pf-role");
        var i2 = elem("input"); i2.type = "text"; i2.id = "pf-role"; i2.value = state.profile.role; i2.maxLength = 24;
        f2.appendChild(l2); f2.appendChild(i2);
        var btn = elem("button", "btn btn--wide", "Save");
        btn.addEventListener("click", function () {
          state.profile.name = i1.value.trim() || "You";
          state.profile.role = i2.value.trim() || "Student";
          save(); renderMe(); closeSheet(); toast("Profile updated");
        });
        box.appendChild(f1); box.appendChild(f2); box.appendChild(btn);
      });
    });
  }
  var resetBtn = $("[data-reset]");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.hash = "#match";
      location.reload();
    });
  }

  window.addEventListener("scroll", function () { $(".top").classList.toggle("is-stuck", scrollY > 8); }, { passive: true });

  /* ================= boot ================= */

  renderLanding();
  renderCities();
  renderCompare();
  renderPrep();
  renderFeed();
  renderHomeFeed();
  renderRecs();
  renderGroups();
  renderGuides();
  if (tripsEl) renderTrips(false);
  renderProgramme();
  renderGate();
  renderMe();
  renderHomeGoing();
  renderHomePhoto();

  var startHash = (location.hash || "").slice(1);
  var start = VIEWS[startHash] ? startHash : (state.destination && byId(state.destination) && byId(state.destination).live ? "home" : (state.ranked ? "cities" : "start"));
  mode = VIEWS[start].m || "before";
  setMode(mode, false);
  history.replaceState({ v: start }, "", "#" + start);
  current = null;
  swap(start);
  moveModeBlob();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveBlob(); moveModeBlob(); });
})();
