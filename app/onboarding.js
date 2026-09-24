(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- state, shared with the app ---------- */
  var KEY = "corners.demo.v2";
  var state = {
    prefs: { acts: [], budget: 900, size: "mid", climate: "warm", lang: "spanish", home: "us" },
    intake: { name: "", email: "", uni: "", field: "", hostUni: "", programme: "", term: "aut26", level: "basic", housing: "looking", worries: [], social: "small", spend: 100, needs: "" },
    finished: false, ranked: false, shortlist: [], compare: ["bilbao"], destination: null, prep: [],
    votes: {}, saves: [], joins: ["language"], checks: ["c1", "c2"], posts: [], going: {},
    profile: { name: "Chiara", role: "Erasmus" }
  };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var loaded = JSON.parse(raw);
      state = Object.assign(state, loaded);
      state.prefs = Object.assign({ acts: [], budget: 900, size: "mid", climate: "warm", lang: "spanish", home: "us" }, loaded.prefs || {});
      state.intake = Object.assign(state.intake, loaded.intake || {});
    }
  } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // #demo (or ?demo=1) fills in an example answer set, for showing the dashboard without typing.
  var DEMO = /demo/.test(location.hash) || /[?&]demo=1/.test(location.search);
  if (DEMO) {
    state.prefs = { acts: ["surf", "hike", "food", "immersion"], budget: 900, size: "mid", climate: "mild", lang: "spanish", home: "us" };
    state.intake = { name: "Chiara", email: "chiara@unibo.it", uni: "University of Bologna", field: "Design", hostUni: "UPV/EHU", programme: "erasmus", term: "aut26", level: "basic", housing: "looking", worries: ["friends", "paperwork"], social: "small", spend: 100, needs: "" };
    state.destination = "bilbao";
    state.finished = true;
    state.ranked = true;
    state.prep = ["d_flight"];
  }

  /* ---------- cities: the same sourced figures as the app ---------- */
  var CITIES = [
    { id: "bilbao", name: "Bilbao", country: "Spain", live: true, a: "#0071e3", b: "#1b3a6b", size: "mid", climate: "mild", lang: "spanish", ef: 553, erasmus: 1185, rent: 450, transport: 21.4, jul: 25.4, jan: 13.5, safety: 51.4, air: "seasonal",
      acts: { surf: 5, hike: 5, beach: 4, night: 3, art: 4, food: 5, football: 5, ski: 2, immersion: 4, buzz: 3 }, why: "Surf, mountains and the best food in Spain" },
    { id: "sansebastian", name: "San Sebastián", country: "Spain", a: "#34c7b3", b: "#0f3b4f", size: "small", climate: "mild", lang: "spanish", ef: 550, erasmus: 143, rent: 500, transport: 13, jul: 25.1, jan: 13.2, safety: 69.2, air: "none",
      acts: { surf: 5, hike: 5, beach: 5, night: 3, art: 3, food: 5, football: 4, ski: 2, immersion: 4, buzz: 3 }, why: "A beach in the middle of town, and 19 Michelin stars nearby" },
    { id: "barcelona", name: "Barcelona", country: "Spain", a: "#f59c5e", b: "#7a1f3d", size: "big", climate: "warm", lang: "spanish", ef: 566, erasmus: 4374, rent: 600, transport: 15.2, jul: 28.3, jan: 14.0, safety: 47.8, air: "direct",
      acts: { surf: 3, hike: 4, beach: 5, night: 5, art: 5, food: 5, football: 5, ski: 3, immersion: 3, buzz: 5 }, why: "Beach and big city at once, but the tightest housing market here" },
    { id: "madrid", name: "Madrid", country: "Spain", a: "#f58a93", b: "#4e2a8a", size: "big", climate: "hot", lang: "spanish", ef: 560, erasmus: 5205, rent: 550, transport: 10, jul: 32.8, jan: 10.0, safety: 70.4, air: "hub",
      acts: { surf: 1, hike: 4, beach: 1, night: 5, art: 5, food: 5, football: 5, ski: 4, immersion: 5, buzz: 5 }, why: "The capital: museums, nightlife, and direct flights everywhere" },
    { id: "valencia", name: "Valencia", country: "Spain", a: "#ddae45", b: "#1f5f8a", size: "big", climate: "warm", lang: "spanish", ef: 564, erasmus: 4194, rent: 380, transport: 14.9, jul: 29.9, jan: 16.8, safety: 61.5, air: "none",
      acts: { surf: 3, hike: 3, beach: 5, night: 4, art: 4, food: 5, football: 4, ski: 1, immersion: 5, buzz: 4 }, why: "Beach, bikes and the warmest winters on the list" },
    { id: "granada", name: "Granada", country: "Spain", a: "#a6a8f7", b: "#3d2a6b", size: "small", climate: "hot", lang: "spanish", ef: 562, erasmus: 1929, rent: 401, transport: 24.6, jul: 34.8, jan: 13.0, safety: 62.9, air: "none",
      acts: { surf: 1, hike: 5, beach: 3, night: 5, art: 5, food: 5, football: 3, ski: 5, immersion: 5, buzz: 3 }, why: "Free tapas, the Alhambra, and skiing 32 km away" },
    { id: "sevilla", name: "Sevilla", country: "Spain", a: "#f090c8", b: "#7a1f3d", size: "mid", climate: "hot", lang: "spanish", ef: 535, erasmus: 1820, rent: 370, transport: 8.8, jul: 36.3, jan: 16.3, safety: 63.0, air: "none",
      acts: { surf: 1, hike: 3, beach: 2, night: 5, art: 5, food: 5, football: 5, ski: 1, immersion: 5, buzz: 4 }, why: "Orange trees, flamenco, and 36 °C in July" },
    { id: "salamanca", name: "Salamanca", country: "Spain", a: "#afc455", b: "#2e4a1f", size: "small", climate: "hot", lang: "spanish", ef: 545, erasmus: 803, rent: 300, transport: 7.34, jul: 30.8, jan: 9.5, safety: 81.3, air: "none",
      acts: { surf: 1, hike: 3, beach: 1, night: 4, art: 4, food: 4, football: 2, ski: 2, immersion: 5, buzz: 2 }, why: "The cheapest, safest, most student-filled town here" },
    { id: "lisbon", name: "Lisbon", country: "Portugal", a: "#2ec7db", b: "#1b3a6b", size: "big", climate: "warm", lang: "portuguese", ef: 612, erasmus: 5349, rent: 550, transport: 0, jul: 28.2, jan: 15.1, safety: 67.1, air: "hub",
      acts: { surf: 5, hike: 3, beach: 5, night: 5, art: 4, food: 4, football: 5, ski: 1, immersion: 2, buzz: 5 }, why: "Europe's busiest Erasmus city, free transport under 23" },
    { id: "porto", name: "Porto", country: "Portugal", a: "#4cc38a", b: "#1f4a3b", size: "mid", climate: "mild", lang: "portuguese", ef: 618, erasmus: 2192, rent: 450, transport: 0, jul: 24.3, jan: 14.0, safety: 66.2, air: "direct",
      acts: { surf: 5, hike: 3, beach: 4, night: 4, art: 4, food: 5, football: 5, ski: 1, immersion: 2, buzz: 3 }, why: "Cheaper than Lisbon, surf on the metro, the best English here" }
  ];

  var UNIS = {
    bilbao: ["UPV/EHU", "Universidad de Deusto", "Mondragon Unibertsitatea"],
    sansebastian: ["UPV/EHU Gipuzkoa", "Deusto Donostia", "Tecnun"],
    barcelona: ["Universitat de Barcelona", "UAB", "Pompeu Fabra", "Ramon Llull"],
    madrid: ["Complutense", "Autónoma de Madrid", "Carlos III", "Rey Juan Carlos"],
    valencia: ["Universitat de València", "UPV"],
    granada: ["Universidad de Granada"],
    sevilla: ["Universidad de Sevilla", "Pablo de Olavide"],
    salamanca: ["Universidad de Salamanca", "Pontificia de Salamanca"],
    lisbon: ["Universidade de Lisboa", "NOVA", "Iscte-IUL"],
    porto: ["Universidade do Porto", "Politécnico do Porto", "Católica Porto"]
  };

  var FOOD = 250, OTHER = 150;
  var monthly = function (c) { return Math.round(c.rent + FOOD + c.transport + OTHER); };
  var AIR = { hub: 1, direct: .85, seasonal: .5, none: .3 };
  var engScore = function (c) { return clamp((c.ef - 500) / 140, 0, 1); };

  function matchScore(c) {
    var p = state.prefs;
    var acts = p.acts.length ? p.acts.reduce(function (s, k) { return s + (c.acts[k] || 0); }, 0) / (p.acts.length * 5) : .6;
    var mo = monthly(c);
    var budget = mo <= p.budget ? 1 : clamp(1 - (mo - p.budget) / 350, 0, 1);
    var order = ["small", "mid", "big"];
    var d = Math.abs(order.indexOf(c.size) - order.indexOf(p.size));
    var size = d === 0 ? 1 : d === 1 ? .55 : .2;
    var climate = c.climate === p.climate ? 1 : .5;
    var lang = p.lang === "english" ? engScore(c) : (c.lang === p.lang ? 1 : .35);
    var travel = AIR[c.air] || .3;
    return Math.round(clamp(acts * .42 + budget * .18 + size * .12 + climate * .1 + lang * .12 + travel * .06, 0, 1) * 100);
  }

  /* ---------- toast ---------- */
  var toastEl = $("[data-toast]"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.classList.remove("is-out");
    clearTimeout(toastT);
    toastT = setTimeout(function () {
      toastEl.classList.add("is-out");
      setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 2200);
  }

  /* ---------- inputs ---------- */
  function fieldOf(key) { return state.prefs.hasOwnProperty(key) ? state.prefs : state.intake; }

  $$("[data-multi]").forEach(function (box) {
    var key = box.dataset.multi;
    var store = fieldOf(key);
    $$(".opt", box).forEach(function (b) {
      b.classList.toggle("is-on", (store[key] || []).indexOf(b.dataset.v) > -1);
      b.setAttribute("aria-pressed", String(b.classList.contains("is-on")));
      b.addEventListener("click", function () {
        var arr = store[key] || (store[key] = []);
        var i = arr.indexOf(b.dataset.v);
        if (i > -1) arr.splice(i, 1); else arr.push(b.dataset.v);
        b.classList.toggle("is-on");
        b.setAttribute("aria-pressed", String(b.classList.contains("is-on")));
        save(); refresh();
      });
    });
  });

  $$("[data-one]").forEach(function (box) {
    var key = box.dataset.one;
    var store = fieldOf(key);
    $$(".opt", box).forEach(function (b) {
      b.classList.toggle("is-on", store[key] === b.dataset.v);
      b.addEventListener("click", function () {
        store[key] = b.dataset.v;
        $$(".opt", box).forEach(function (o) {
          o.classList.toggle("is-on", o === b);
          o.setAttribute("aria-pressed", String(o === b));
        });
        save(); refresh();
      });
    });
    if (!$(".opt.is-on", box) && store[key]) { /* value with no matching option */ }
  });

  $$("[data-range]").forEach(function (input) {
    var key = input.dataset.range;
    var store = fieldOf(key);
    var out = $('[data-out="' + key + '"]');
    if (store[key] != null) input.value = store[key];
    var paint = function () {
      out.textContent = "€" + Number(input.value).toLocaleString("en-GB");
      input.style.setProperty("--fill", ((input.value - input.min) / (input.max - input.min) * 100).toFixed(1) + "%");
    };
    input.addEventListener("input", function () { store[key] = parseInt(input.value, 10); paint(); save(); refresh(); });
    paint();
  });

  $$("[data-text]").forEach(function (input) {
    var key = input.dataset.text;
    input.value = state.intake[key] || "";
    input.addEventListener("input", function () {
      state.intake[key] = input.value;
      if (key === "email") $("[data-email-note]").hidden = !input.value;
      save(); refresh();
    });
    if (key === "email" && input.value) $("[data-email-note]").hidden = false;
  });

  /* ---------- host university, from the matched city ---------- */

  function topCity() {
    if (state.destination) {
      var d = CITIES.filter(function (c) { return c.id === state.destination; })[0];
      if (d) return d;
    }
    return CITIES.slice().sort(function (a, b) { return matchScore(b) - matchScore(a); })[0];
  }

  function renderHostUnis() {
    var box = $("[data-hostuni]");
    if (!box) return;
    var city = topCity();
    var list = (UNIS[city.id] || []).concat(["Not decided yet"]);
    if (state.intake.hostUni && list.indexOf(state.intake.hostUni) < 0) list.splice(list.length - 1, 0, state.intake.hostUni);
    box.textContent = "";
    list.forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt" + (state.intake.hostUni === name ? " is-on" : "");
      b.textContent = name;
      b.setAttribute("aria-pressed", String(state.intake.hostUni === name));
      b.addEventListener("click", function () {
        state.intake.hostUni = name;
        save();
        refresh();
      });
      box.appendChild(b);
    });
    var hint = $("[data-hostuni-hint]");
    if (hint) hint.textContent = "Universities in " + city.name + ". Change your city in Section 3 and this changes with it.";
  }

  /* ---------- progress ---------- */
  var QUESTIONS = [
    function () { return state.prefs.acts.length > 0; },
    function () { return true; }, // budget always has a value
    function () { return !!state.prefs.size; },
    function () { return !!state.prefs.climate; },
    function () { return !!state.prefs.lang; },
    function () { return !!state.prefs.home; },
    function () { return !!(state.intake.name || "").trim(); },
    function () { return !!(state.intake.email || "").trim(); },
    function () { return !!(state.intake.uni || "").trim(); },
    function () { return !!(state.intake.field || "").trim(); },
    function () { return !!state.intake.hostUni; },
    function () { return !!state.intake.programme; },
    function () { return !!state.intake.term; },
    function () { return !!state.intake.level; },
    function () { return !!state.intake.housing; },
    function () { return state.intake.worries.length > 0; },
    function () { return !!state.intake.social; }
  ];

  function refresh() {
    var done = QUESTIONS.filter(function (f) { return f(); }).length;
    $("[data-done]").textContent = done;
    $("[data-total]").textContent = QUESTIONS.length;
    $("[data-progress]").style.width = (done / QUESTIONS.length * 100) + "%";
    renderHostUnis();
    renderResults();
    renderSummary();
    renderDashboard();
  }

  /* ---------- results ---------- */
  function renderResults() {
    var box = $("[data-results]");
    var ranked = CITIES.slice().sort(function (a, b) { return matchScore(b) - matchScore(a); }).slice(0, 5);
    box.textContent = "";
    ranked.forEach(function (c, i) {
      var pct = matchScore(c);
      var li = document.createElement("li");
      li.className = "res" + (i === 0 ? " res--top" : "");

      var rank = document.createElement("div");
      rank.className = "res__rank";
      rank.style.setProperty("--a", c.a);
      rank.style.setProperty("--b", c.b);
      rank.textContent = i + 1;

      var body = document.createElement("div");
      body.className = "res__body";
      var name = document.createElement("p");
      name.className = "res__name";
      name.textContent = c.name;
      var small = document.createElement("small");
      small.textContent = c.country;
      name.appendChild(small);
      var why = document.createElement("p");
      why.className = "res__why";
      why.textContent = c.why;
      body.appendChild(name);
      body.appendChild(why);

      var stats = document.createElement("div");
      stats.className = "res__stats";
      ["€" + monthly(c) + "/mo", "Room €" + c.rent, c.jul + "° July",
       c.transport ? "Transport €" + c.transport : "Transport free",
       c.erasmus.toLocaleString("en-GB") + " Erasmus", "English " + c.ef]
        .forEach(function (s) {
          var sp = document.createElement("span");
          sp.textContent = s;
          stats.appendChild(sp);
        });
      body.appendChild(stats);

      var scoreBox = document.createElement("div");
      scoreBox.className = "res__score";
      var pctEl = document.createElement("p");
      pctEl.className = "res__pct";
      pctEl.textContent = pct + "%";
      var bar = document.createElement("span");
      bar.className = "res__bar";
      var fill = document.createElement("i");
      fill.style.setProperty("--w", pct + "%");
      bar.appendChild(fill);
      scoreBox.appendChild(pctEl);
      scoreBox.appendChild(bar);
      if (c.live) {
        var live = document.createElement("span");
        live.className = "res__live";
        live.textContent = "APP LIVE";
        scoreBox.appendChild(live);
      }

      li.appendChild(rank);
      li.appendChild(body);
      li.appendChild(scoreBox);
      box.appendChild(li);
    });
  }

  /* ---------- summary ---------- */
  var WORRY_LINE = {
    friends: "put you into groups that meet weekly, not a 400-person chat",
    money: "show only the weekends and recs that fit your budget",
    language: "surface language exchanges and beginner classes first",
    classes: "keep your programme's dates and deadlines on your home screen",
    home: "keep your first six weeks busy, because that's when it's hardest",
    paperwork: "put the visa, registration and residency steps in order with dates",
    safety: "only ever put meet-ups in public places, with a name attached",
    health: "keep your insurance details and 112 one tap away"
  };

  function renderSummary() {
    var box = $("[data-summary]");
    box.textContent = "";
    var top = CITIES.slice().sort(function (a, b) { return matchScore(b) - matchScore(a); })[0];
    var it = state.intake, p = state.prefs;
    var lines = [];

    lines.push([!!it.name, it.name
      ? "Call you <b>" + esc(it.name) + "</b>" + (it.uni ? ", from <b>" + esc(it.uni) + "</b>" : "") + (it.hostUni && it.hostUni !== "Not decided yet" ? ", studying at <b>" + esc(it.hostUni) + "</b>" : "")
      : "Get your name and university"]);
    lines.push([true, "Start you in <b>" + top.name + "</b>, your closest match at <b>" + matchScore(top) + "%</b>" + (top.live ? ", where the app is already live" : ", once that city opens")]);
    lines.push([p.acts.length > 0, p.acts.length ? "Show you groups for <b>" + p.acts.length + "</b> things you said you want to do" : "Find groups once you pick what you want to do"]);
    lines.push([true, "Filter weekends to <b>€" + it.spend + "</b> a trip and living costs to <b>€" + p.budget + "</b> a month"]);
    if (it.worries.length) {
      var w = it.worries.slice(0, 2).map(function (k) { return WORRY_LINE[k]; }).filter(Boolean).join(", and ");
      lines.push([true, "Because of what worries you: " + w]);
    } else {
      lines.push([false, "Tell us what worries you and we'll put that first"]);
    }
    lines.push([!!it.housing && it.housing !== "looking", it.housing === "looking" ? "Push housing to the top of your checklist, since you're still looking" : "Skip the housing steps you've already done"]);
    lines.push([!!(it.needs || "").trim(), (it.needs || "").trim() ? "Remember what you told us, so plans actually work for you" : "Note anything that would make a plan not work for you"]);

    lines.forEach(function (l) {
      var li = document.createElement("li");
      if (!l[0]) li.className = "is-todo";
      li.innerHTML = l[1];
      box.appendChild(li);
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* ---------- dashboard ---------- */

  var TERMS = {
    aut26: { label: "autumn 2026", start: new Date(2026, 8, 1) },
    spr27: { label: "spring 2027", start: new Date(2027, 0, 26) },
    year: { label: "the full year", start: new Date(2026, 8, 1) },
    already: { label: "now", start: new Date(2026, 8, 1) }
  };

  var GROUPS = {
    surf: ["Surf Sopelana", 212, "#2ec7db"], beach: ["Surf Sopelana", 212, "#2ec7db"],
    hike: ["Hiking Bizkaia", 340, "#4cc38a"], ski: ["Hiking Bizkaia", 340, "#4cc38a"],
    football: ["Sunday football", 131, "#f59c5e"],
    immersion: ["Language exchange", 405, "#0071e3"],
    art: ["Photography walks", 83, "#a6a8f7"],
    buzz: ["Film club", 74, "#f090c8"], night: ["Film club", 74, "#f090c8"],
    food: ["Weekend travel", 520, "#ddae45"]
  };

  var TRIPS = [
    { name: "Vitoria-Gasteiz", how: "Bus · 1 h", day: 30, night: 72 },
    { name: "San Sebastián", how: "Bus · 1 h 20", day: 36, night: 91 },
    { name: "Santander", how: "Bus · 1 h 30", day: 40, night: 88 },
    { name: "Logroño", how: "Bus · 2 h", day: 48, night: 96 },
    { name: "Biarritz", how: "Bus · 2 h 30", day: 58, night: 126 },
    { name: "Picos de Europa", how: "Car share · 2 h 30", day: 0, night: 96 },
    { name: "Madrid", how: "Train · 5 h", day: 0, night: 124 },
    { name: "Porto", how: "Flight · 1 h", day: 0, night: 137 }
  ];

  function tailoredList() {
    var it = state.intake, list = [];
    if (it.housing === "looking") list.push(["d_house", "Lock down somewhere to live", "You said you're still looking"]);
    if (it.worries.indexOf("paperwork") > -1) list.push(["d_visa", "Start the visa or residency paperwork", "You're worried about it"]);
    if (it.worries.indexOf("health") > -1) list.push(["d_ins", "Sort health insurance and save 112", "You're worried about it"]);
    if (it.programme === "erasmus" || it.programme === "direct") list.push(["d_la", "Get the learning agreement signed", "Both universities need it"]);
    list.push(["d_flight", "Book flights", TERMS[it.term] ? "For " + TERMS[it.term].label : ""]);
    list.push(["d_card", "Get a card that doesn't charge you abroad", "You'll use it from day one"]);
    if (it.level === "none" || it.level === "basic") list.push(["d_lang", "Learn ten words before you land", "Hello, please, thanks, and a drink order"]);
    if (it.worries.indexOf("friends") > -1) list.push(["d_groups", "Join two groups before you arrive", "The first week fills up fast"]);
    list.push(["d_sim", "Sort a SIM or eSIM for the first week", ""]);
    return list.slice(0, 7);
  }

  function tile(box, kicker, heading) {
    box.textContent = "";
    if (kicker) box.appendChild(mk("p", "tile__k", kicker));
    if (heading) box.appendChild(mk("h3", "tile__h", heading));
    return box;
  }
  function mk(t, c, txt) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function renderDashboard() {
    var dash = $("[data-dash]"), locked = $("[data-locked]");
    var ready = !!state.finished;
    dash.hidden = !ready;
    locked.hidden = ready;
    var it = state.intake;
    var city = CITIES.filter(function (c) { return c.id === state.destination; })[0] || CITIES[0];
    $("[data-dash-title]").textContent = ready ? "Your dashboard" : "Your dashboard";
    $("[data-dash-sub]").textContent = ready
      ? "This is what Corners looks like once you're set up. Everything here comes from your answers."
      : "Finish setup and this becomes your home screen: the countdown, what's left to do, and who to meet when you land.";
    if (!ready) return;

    // hero: countdown
    var term = TERMS[it.term] || TERMS.aut26;
    var days = Math.ceil((term.start - Date.now()) / 864e5);
    var week = Math.max(1, Math.floor((Date.now() - term.start) / 6048e5) + 1);
    var h = tile($("[data-tile-hero]"), "You're going to");
    var row = mk("div", "hero__row");
    var left = mk("div");
    left.appendChild(mk("p", "hero__big", city.name));
    var bits = [it.name, it.hostUni && it.hostUni !== "Not decided yet" ? "at " + it.hostUni : "", it.uni ? "from " + it.uni : "", term.label];
    var sub = mk("p", null, bits.filter(Boolean).join(" · "));
    left.appendChild(sub);
    var right = mk("div");
    if (days > 0) {
      right.appendChild(mk("p", "hero__big", days + (days === 1 ? " day" : " days")));
      right.appendChild(mk("p", null, "until you land"));
    } else if (week <= 6) {
      var big = mk("p", "hero__big", "Week " + week);
      big.appendChild(mk("small", null, "of your first six"));
      right.appendChild(big);
      var weeks = mk("div", "weeks");
      for (var i = 1; i <= 6; i++) weeks.appendChild(mk("i", i <= week ? "on" : null));
      right.appendChild(weeks);
    } else {
      right.appendChild(mk("p", "hero__big", "You're in"));
      right.appendChild(mk("p", null, "past the first six weeks"));
    }
    row.appendChild(left); row.appendChild(right);
    h.appendChild(row);

    // checklist
    var items = tailoredList();
    var done = items.filter(function (x) { return state.prep.indexOf(x[0]) > -1; }).length;
    var ch = tile($("[data-tile-check]"), "Before you go", done + " of " + items.length + " done");
    var bar = mk("div", "pbar");
    var fill = mk("i");
    fill.style.setProperty("--w", (done / items.length * 100) + "%");
    bar.appendChild(fill);
    ch.appendChild(bar);
    var ul = mk("ul", "todo");
    items.forEach(function (x) {
      var li = mk("li");
      var input = document.createElement("input");
      input.type = "checkbox"; input.id = x[0];
      input.checked = state.prep.indexOf(x[0]) > -1;
      var label = mk("label", null, x[1]);
      label.setAttribute("for", x[0]);
      input.addEventListener("change", function () {
        var i2 = state.prep.indexOf(x[0]);
        if (input.checked && i2 < 0) state.prep.push(x[0]);
        if (!input.checked && i2 > -1) state.prep.splice(i2, 1);
        save(); renderDashboard();
      });
      li.appendChild(input); li.appendChild(label);
      if (x[2]) li.appendChild(mk("span", null, x[2]));
      ul.appendChild(li);
    });
    ch.appendChild(ul);

    // city numbers
    var cy = tile($("[data-tile-city]"), city.name, "What a month costs you");
    var mo = monthly(city);
    var kvs = mk("dl", "kvs");
    [["Living, all in", "€" + mo, mo <= state.prefs.budget],
     ["Your budget", "€" + state.prefs.budget, false],
     ["Room in a shared flat", "€" + city.rent, false],
     ["Transport, student", city.transport ? "€" + city.transport : "Free", !city.transport],
     ["July / January", city.jul + "° / " + city.jan + "°", false],
     ["Erasmus students a year", city.erasmus.toLocaleString("en-GB"), false]]
      .forEach(function (r) {
        var d = mk("div");
        d.appendChild(mk("dt", null, r[0]));
        d.appendChild(mk("dd", r[2] ? "good" : null, r[1]));
        kvs.appendChild(d);
      });
    cy.appendChild(kvs);
    cy.appendChild(mk("p", null, mo <= state.prefs.budget
      ? "About €" + (state.prefs.budget - mo) + " a month spare."
      : "About €" + (mo - state.prefs.budget) + " a month over your budget."));

    // groups
    var gt = tile($("[data-tile-groups]"), "Groups", "People to meet");
    var picked = [], seen = {};
    state.prefs.acts.forEach(function (k) {
      var g = GROUPS[k];
      if (g && !seen[g[0]]) { seen[g[0]] = 1; picked.push(g); }
    });
    if (!seen["Weekend travel"]) picked.push(["Weekend travel", 520, "#ddae45"]);
    picked = picked.slice(0, 4);
    var gl = mk("ul", "rows");
    picked.forEach(function (g) {
      var li = mk("li");
      var dot = mk("i");
      dot.style.setProperty("--c", g[2]);
      li.appendChild(dot);
      li.appendChild(mk("b", null, g[0]));
      li.appendChild(mk("span", null, g[1] + " members"));
      gl.appendChild(li);
    });
    gt.appendChild(gl);
    gt.appendChild(mk("p", null, city.live
      ? "Matched to what you said you want to do. Join them in the app."
      : "These are Bilbao's groups. " + city.name + "'s open when the city launches."));

    // weekends
    var wt = tile($("[data-tile-trips]"), "Weekends", "Inside your €" + it.spend + " budget");
    var fits = TRIPS.map(function (t) {
      var best = t.day && t.day <= it.spend ? { cost: t.day, kind: "day trip" } : (t.night <= it.spend ? { cost: t.night, kind: "1 night" } : null);
      return best ? { name: t.name, how: t.how, cost: best.cost, kind: best.kind } : null;
    }).filter(Boolean).sort(function (a, b) { return a.cost - b.cost; }).slice(0, 4);
    if (fits.length) {
      var wl = mk("ul", "rows");
      fits.forEach(function (t) {
        var li = mk("li");
        var dot = mk("i");
        dot.style.setProperty("--c", "#0071e3");
        li.appendChild(dot);
        li.appendChild(mk("b", null, t.name));
        li.appendChild(mk("span", null, "€" + t.cost + " · " + t.kind));
        wl.appendChild(li);
      });
      wt.appendChild(wl);
    }
    wt.appendChild(mk("p", null, fits.length
      ? "From Bilbao: return travel, a hostel bed and cheap food."
      : "Nothing fits €" + it.spend + " yet. Raise the weekend budget above."));

    // next
    var nt = tile($("[data-tile-next]"), "Next", "What happens when you land");
    nt.appendChild(mk("p", null, city.live
      ? "Bilbao is live, so the rest of the app is already switched on: anonymous posts from students nearby, recs for food and gyms, your groups, guided experiences, the weekend planner and your programme page."
      : city.name + " isn't live yet — Corners runs in Bilbao first. You'll be told when it opens, and you can look around Bilbao in the meantime."));
    var cta = mk("div", "tile__cta");
    var open = document.createElement("a");
    open.className = "btn";
    open.href = "https://claude.ai/artifact/SyVrLipV63UHqEjPSweDyj" + (DEMO ? "#demo" : "");
    open.target = "_blank";
    open.rel = "noopener";
    open.textContent = "Open the app";
    var again = mk("button", "btn btn--plain", "Change my answers");
    again.type = "button";
    again.addEventListener("click", function () { document.getElementById("s1").scrollIntoView(); });
    cta.appendChild(open); cta.appendChild(again);
    nt.appendChild(cta);
  }

  /* ---------- section nav ---------- */
  var secs = ["s1", "s2", "s3", "s4"];
  var links = $$(".seg__a");
  function markSection(id) {
    links.forEach(function (a) { a.classList.toggle("is-on", a.dataset.jump === id); });
    var on = $(".seg__a.is-on"), pill = $(".seg__pill");
    if (on && pill) {
      pill.style.width = on.offsetWidth + "px";
      pill.style.transform = "translateX(" + (on.offsetLeft - 3) + "px)";
    }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) markSection(en.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    secs.forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
  markSection("s1");
  window.addEventListener("resize", function () { markSection(($(".seg__a.is-on") || {}).dataset ? $(".seg__a.is-on").dataset.jump : "s1"); });

  /* ---------- reveals ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var targets = $$(".q, .sec__head, .res, .card--summary, .locked__in");
    targets.forEach(function (n) {
      if (n.getBoundingClientRect().top > innerHeight * .9) n.classList.add("rv");
    });
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        rio.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".rv").forEach(function (n) { rio.observe(n); });
  }

  /* ---------- finish + reset ---------- */
  $("[data-finish]").addEventListener("click", function () {
    var top = CITIES.slice().sort(function (a, b) { return matchScore(b) - matchScore(a); })[0];
    state.ranked = true;
    state.destination = top.id;
    if ((state.intake.name || "").trim()) state.profile.name = state.intake.name.trim();
    if (state.intake.programme === "erasmus") state.profile.role = "Erasmus";
    if (state.intake.programme === "provider") state.profile.role = "Study abroad";
    if (state.intake.programme === "first") state.profile.role = "First-year";
    state.finished = true;
    save();
    renderDashboard();
    toast(top.name + " is set. Here's your dashboard.");
    setTimeout(function () { document.getElementById("s4").scrollIntoView(); }, 240);
  });

  $("[data-reset]").addEventListener("click", function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  });

  refresh();
  if (DEMO) {
    var s4 = document.getElementById("s4");
    if (s4) setTimeout(function () { s4.scrollIntoView({ behavior: "auto" }); }, 60);
  }
})();
