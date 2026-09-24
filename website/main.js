(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  var rad = function (d) { return (d * Math.PI) / 180; };

  /* =========================================================
     The wreath: a laurel where every leaf is an eye
     ========================================================= */

  var LEAVES_PER_BRANCH = 11;
  var C = { x: 120, y: 126 }, R = 88;
  var uid = 0;

  function pt(deg) { return [C.x + R * Math.cos(rad(deg)), C.y + R * Math.sin(rad(deg))]; }

  function gradient(defs, id, stops) {
    var g = el("linearGradient", { id: id, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    stops.forEach(function (s) { el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] }, g); });
  }

  function drawWreath(svg) {
    var n = uid++;
    var defs = el("defs", {}, svg);
    gradient(defs, "wl" + n, [[0, "#D6EEFF", 1], [.55, "#8FD0FA", 1], [1, "#6A63FF", 1]]);
    gradient(defs, "wf" + n, [[0, "#8FD0FA", .16], [1, "#4E9BFF", .06]]);
    var line = "url(#wl" + n + ")", fill = "url(#wf" + n + ")";
    var eyes = [];
    var left = el("g", {}, svg);
    var right = el("g", { transform: "translate(240 0) scale(-1 1)" }, svg);

    [left, right].forEach(function (branch, side) {
      el("path", { d: "M" + pt(78).join(" ") + " A" + R + " " + R + " 0 0 1 " + pt(262).join(" "), fill: "none", stroke: line, "stroke-width": 1, "stroke-linecap": "round" }, branch);
      for (var i = 0; i < LEAVES_PER_BRANCH; i++) {
        var t = i / (LEAVES_PER_BRANCH - 1);
        var theta = 106 + t * 150;
        var tilt = i === LEAVES_PER_BRANCH - 1 ? 0 : (i % 2 ? -44 : 44);
        var phi = theta + 180 + tilt;
        var s = 1.4 - t * 0.45;
        var p = pt(theta);
        var g = el("g", { transform: "translate(" + p[0].toFixed(2) + " " + p[1].toFixed(2) + ") rotate(" + phi.toFixed(2) + ") scale(" + s.toFixed(3) + ")" }, branch);
        el("path", { d: "M0 0 C10 -9 10 -24 0 -33 C-10 -24 -10 -9 0 0Z", fill: fill, stroke: line, "stroke-width": .7 }, g);
        var lid = el("g", { class: "lid" }, g);
        el("path", { d: "M0 -25 Q5.6 -16.5 0 -8 Q-5.6 -16.5 0 -25Z", fill: "#05060A", stroke: line, "stroke-width": .5 }, lid);
        var iris = el("circle", { cx: 0, cy: -16.5, r: 2.5, fill: "#8FD0FA" }, lid);
        var pupil = el("circle", { cx: 0, cy: -16.5, r: 1.05, fill: "#05060A" }, lid);
        var ex = p[0] + Math.sin(rad(phi)) * 16.5 * s;
        var ey = p[1] - Math.cos(rad(phi)) * 16.5 * s;
        if (side === 1) ex = 240 - ex;
        eyes.push({ lid: lid, iris: iris, pupil: pupil, x: ex, y: ey, phi: phi, mirror: side === 1 });
      }
    });
    return eyes;
  }

  var wreaths = $$("[data-wreath]").map(function (svg) {
    return { svg: svg, eyes: drawWreath(svg), live: !svg.hasAttribute("data-static") };
  });

  function look(w, e) {
    var ctm = w.svg.getScreenCTM();
    if (!ctm) return;
    var sp = w.svg.createSVGPoint();
    sp.x = e.clientX; sp.y = e.clientY;
    var p = sp.matrixTransform(ctm.inverse());
    w.eyes.forEach(function (eye) {
      var dx = p.x - eye.x, dy = p.y - eye.y;
      if (eye.mirror) dx = -dx;
      var len = Math.hypot(dx, dy) || 1;
      var a = rad(-eye.phi);
      var lx = (dx * Math.cos(a) - dy * Math.sin(a)) / len;
      var ly = (dx * Math.sin(a) + dy * Math.cos(a)) / len;
      var reach = Math.min(1, len / 60);
      var tr = "translate(" + (lx * 1.9 * reach).toFixed(2) + " " + (ly * 4.2 * reach).toFixed(2) + ")";
      eye.iris.setAttribute("transform", tr);
      eye.pupil.setAttribute("transform", tr);
    });
  }

  if (!reduceMotion) {
    setInterval(function () {
      var live = wreaths.filter(function (w) { return w.live; });
      if (!live.length || document.hidden) return;
      var eyes = live[0].eyes;
      var eye = eyes[Math.floor(Math.random() * eyes.length)];
      eye.lid.classList.add("is-shut");
      setTimeout(function () { eye.lid.classList.remove("is-shut"); }, 140);
    }, 2400);
  }

  /* =========================================================
     Pointer: cursor glow, glass spotlight, eyes, footer word
     ========================================================= */

  var glow = $(".cursor-glow");
  var footerWord = $(".footer__word");
  if (finePointer && !reduceMotion) {
    var last = null, queued = false;
    window.addEventListener("pointermove", function (e) {
      last = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        if (glow) {
          glow.style.setProperty("--cx", last.clientX + "px");
          glow.style.setProperty("--cy", last.clientY + "px");
          glow.classList.add("is-on");
        }
        var g = last.target.closest && last.target.closest(".glass");
        if (g) {
          var r = g.getBoundingClientRect();
          g.style.setProperty("--mx", (last.clientX - r.left) + "px");
          g.style.setProperty("--my", (last.clientY - r.top) + "px");
        }
        wreaths.forEach(function (w) { if (w.live) look(w, last); });
        if (footerWord) {
          var fr = footerWord.getBoundingClientRect();
          footerWord.style.setProperty("--fx", ((last.clientX - fr.left) / fr.width * 100).toFixed(1) + "%");
        }
      });
    }, { passive: true });
    document.addEventListener("pointerleave", function () { if (glow) glow.classList.remove("is-on"); });
  }

  /* ---------- scroll progress ---------- */
  var navPill = $(".nav__pill");
  if (navPill) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = document.documentElement.scrollHeight - innerHeight;
        navPill.style.setProperty("--sp", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 3D tilt ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt], .exp").forEach(function (t) {
      t.setAttribute("data-tilt", "");
      t.addEventListener("pointermove", function (e) {
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.classList.add("is-tilting");
        t.style.transform = "perspective(900px) rotateX(" + (-y * 9).toFixed(2) + "deg) rotateY(" + (x * 11).toFixed(2) + "deg)";
      });
      t.addEventListener("pointerleave", function () {
        t.classList.remove("is-tilting");
        t.style.transform = "";
      });
    });

    /* magnetic buttons */
    $$(".btn--primary:not(.btn--wide)").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (dx * .18).toFixed(1) + "px," + (dy * .3).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* =========================================================
     Scroll reveal — only for things below the fold at load
     ========================================================= */

  var revealSel = [
    ".why .window__head", ".notes > li",
    ".nearby__copy", ".feed__bar", ".post",
    ".recs__head", ".recs__panels",
    ".groups__head", ".cloud > li",
    ".guides__head", ".exp",
    ".weekends .head", ".planner__controls", ".planner .trips",
    ".programme__head", ".window",
    ".rules__head", ".rules__list > li",
    ".partners__copy", ".report",
    ".join__in", ".marquee", ".join__form",
    ".faq > *", ".footer__top", ".footer__word"
  ].join(",");

  var revealables = $$(revealSel);
  if (!reduceMotion && "IntersectionObserver" in window) {
    var groups = new Map();
    revealables.forEach(function (node) {
      if (node.getBoundingClientRect().top < innerHeight * .92) { node.classList.add("rv--seen"); return; }
      var parent = node.parentElement;
      var i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      node.style.setProperty("--d", Math.min(i * .08, .56) + "s");
      node.classList.add("rv");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target;
        io.unobserve(n);
        n.classList.add("rv--in", "rv--seen");
        setTimeout(function () { n.classList.remove("rv", "rv--in"); n.style.removeProperty("--d"); }, 1600);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    revealables.forEach(function (n) { if (n.classList.contains("rv")) io.observe(n); });
  } else {
    revealables.forEach(function (n) { n.classList.add("rv--seen"); });
  }

  /* =========================================================
     Why · the falling curve
     ========================================================= */

  var plot = $("[data-curve]");
  if (plot) {
    var csvg = plot.querySelector("svg");
    var W = 1200, H = 260;
    var ys = [.1, .18, .4, .64, .8, .88];
    var pts = ys.map(function (y, i) { return [(i + .5) / 6 * W, y * H]; });
    var all = [[0, .07 * H]].concat(pts, [[W, .9 * H]]);

    var d = "M" + all[0][0] + " " + all[0][1].toFixed(1);
    for (var i = 0; i < all.length - 1; i++) {
      var p0 = all[i - 1] || all[i], p1 = all[i], p2 = all[i + 1], p3 = all[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
        " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
        " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    var cdefs = el("defs", {}, csvg);
    var sg = el("linearGradient", { id: "curve-s", gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: W, y2: 0 }, cdefs);
    el("stop", { offset: 0, "stop-color": "#FFFFFF" }, sg);
    el("stop", { offset: .45, "stop-color": "#8FD0FA" }, sg);
    el("stop", { offset: 1, "stop-color": "#6A63FF", "stop-opacity": .55 }, sg);
    var ag = el("linearGradient", { id: "curve-a", x1: 0, y1: 0, x2: 0, y2: 1 }, cdefs);
    el("stop", { offset: 0, "stop-color": "#8FD0FA", "stop-opacity": .3 }, ag);
    el("stop", { offset: 1, "stop-color": "#4E9BFF", "stop-opacity": 0 }, ag);
    el("path", { class: "curve__area", d: d + " L" + W + " " + H + " L0 " + H + " Z", fill: "url(#curve-a)" }, csvg);
    el("path", { class: "curve__line", d: d, stroke: "url(#curve-s)" }, csvg);

    [[0, "Week 1", ".3s"], [2, "Week 3", ".9s"], [5, "Week 6", "1.6s"]].forEach(function (m) {
      var dot = document.createElement("span");
      dot.className = "curve__dot";
      dot.setAttribute("data-label", m[1]);
      dot.style.left = (pts[m[0]][0] / W * 100) + "%";
      dot.style.top = (pts[m[0]][1] / H * 100) + "%";
      dot.style.setProperty("--dd", m[2]);
      plot.appendChild(dot);
    });

    var curve = plot.closest(".curve");
    if (!reduceMotion && "IntersectionObserver" in window && curve.getBoundingClientRect().top > innerHeight * .85) {
      curve.classList.add("is-pending");
      var cio = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        cio.disconnect();
        curve.classList.remove("is-pending");
        curve.classList.add("is-drawn");
      }, { threshold: .35 });
      cio.observe(curve);
    }
  }

  /* =========================================================
     Nearby · votes, radius chips, live posts
     ========================================================= */

  var feed = $("[data-feed]");
  if (feed) {
    feed.addEventListener("click", function (e) {
      var btn = e.target.closest(".vote button");
      if (!btn) return;
      var box = btn.closest(".vote");
      var up = box.querySelector(".vote__up"), down = box.querySelector(".vote__down");
      var out = box.querySelector(".vote__n");
      var n = parseInt(out.textContent, 10) || 0;
      var isUp = btn === up;
      var pressed = btn.getAttribute("aria-pressed") === "true";
      var other = isUp ? down : up;
      if (pressed) {
        btn.setAttribute("aria-pressed", "false");
        n += isUp ? -1 : 1;
      } else {
        if (other.getAttribute("aria-pressed") === "true") { other.setAttribute("aria-pressed", "false"); n += isUp ? 1 : -1; }
        btn.setAttribute("aria-pressed", "true");
        n += isUp ? 1 : -1;
      }
      out.textContent = n;
      out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
    });

    $$(".feed__chip").forEach(function (chip, _, list) {
      chip.addEventListener("click", function () {
        list.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      });
    });

    var pool = [
      ["Which supermarket is open on Sunday. Asking for my empty fridge", "1.0 km", 3, "var(--h3)"],
      ["Language exchange tonight near Moyúa at 8. Bring your worst Spanish", "0.6 km", 9, "var(--h5)"],
      ["Anyone driving to the Picos this weekend with a free seat? I'll pay petrol", "3.4 km", 5, "var(--h9)"],
      ["Artxanda at sunset tonight was unreal. Go before the rain comes back", "1.8 km", 12, "var(--h11)"],
      ["Is it normal that my landlord wants two months' deposit", "2.3 km", 7, "var(--h7)"],
      ["Lost a black umbrella on metro line 1 this morning. It's Bilbao, I need it back", "0.9 km", 4, "var(--h10)"]
    ];
    var poolIdx = 0;
    var feedHover = false;
    feed.addEventListener("pointerenter", function () { feedHover = true; });
    feed.addEventListener("pointerleave", function () { feedHover = false; });
    var feedVisible = false;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { feedVisible = en[0].isIntersecting; }, { threshold: .3 }).observe(feed);
    }

    var makePost = function (data) {
      var li = document.createElement("li");
      li.className = "post glass post--new";
      var body = document.createElement("div"); body.className = "post__body";
      var meta = document.createElement("p"); meta.className = "post__meta micro";
      var dot = document.createElement("span"); dot.className = "post__dot"; dot.style.setProperty("--c", data[3]);
      meta.appendChild(dot); meta.appendChild(document.createTextNode(data[1] + " · just now"));
      var text = document.createElement("p"); text.className = "post__text"; text.textContent = data[0];
      var rep = document.createElement("p"); rep.className = "post__replies"; rep.textContent = "0 replies";
      body.appendChild(meta); body.appendChild(text); body.appendChild(rep);
      var vote = document.createElement("div"); vote.className = "vote";
      vote.innerHTML = '<button type="button" class="vote__up" aria-label="Vote up" aria-pressed="false">▲</button><output class="vote__n"></output><button type="button" class="vote__down" aria-label="Vote down" aria-pressed="false">▼</button>';
      vote.querySelector(".vote__n").textContent = data[2];
      li.appendChild(body); li.appendChild(vote);
      return li;
    };

    if (!reduceMotion) {
      setInterval(function () {
        if (!feedVisible || feedHover || document.hidden) return;
        var posts = feed.querySelectorAll(".post");
        var lastPost = posts[posts.length - 1];
        if (lastPost) {
          lastPost.classList.add("post--out");
          setTimeout(function () { lastPost.remove(); }, 480);
        }
        var fresh = makePost(pool[poolIdx++ % pool.length]);
        feed.insertBefore(fresh, feed.firstChild);
        setTimeout(function () { fresh.classList.remove("post--new"); }, 900);
      }, 5200);
    }
  }

  /* =========================================================
     Recs · tabs with a sliding indicator
     ========================================================= */

  $$("[data-tabs]").forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var ind = document.createElement("span");
    ind.className = "tabs__ind";
    ind.setAttribute("aria-hidden", "true");
    list.insertBefore(ind, list.firstChild);
    list.classList.add("has-ind");

    var place = function (tab) {
      ind.style.width = tab.offsetWidth + "px";
      ind.style.transform = "translateX(" + tab.offsetLeft + "px)";
    };
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (!panel) return;
        panel.hidden = !on;
        if (on && !reduceMotion) {
          panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering");
        }
      });
      place(tab);
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, j = -1;
        if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % tabs.length;
        if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + tabs.length) % tabs.length;
        if (k === "Home") j = 0;
        if (k === "End") j = tabs.length - 1;
        if (j >= 0) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    var current = function () { return tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0]; };
    place(current());
    window.addEventListener("resize", function () { place(current()); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { place(current()); });
  });

  /* =========================================================
     Groups · join
     ========================================================= */

  var cloud = $("[data-cloud]");
  if (cloud) {
    var cloudMsg = $("[data-cloud-msg]");
    $$("li", cloud).forEach(function (li, i) { li.style.setProperty("--i", i); });
    cloud.addEventListener("click", function (e) {
      var g = e.target.closest("button.grp");
      if (!g) return;
      var on = g.getAttribute("aria-pressed") !== "true";
      g.setAttribute("aria-pressed", String(on));
      var count = g.querySelector("span");
      count.textContent = (parseInt(count.textContent, 10) || 0) + (on ? 1 : -1);
      g.classList.remove("burst"); void g.offsetWidth; g.classList.add("burst");
      var joined = $$('button.grp[aria-pressed="true"]', cloud).length;
      var name = g.firstChild.nextSibling.textContent.trim();
      if (cloudMsg) cloudMsg.textContent = (on ? "Joined " : "Left ") + name + ". You're in " + joined + (joined === 1 ? " group." : " groups.");
    });
  }

  /* =========================================================
     Guides · rail buttons and drag
     ========================================================= */

  var rail = $("[data-rail]");
  if (rail) {
    $$("[data-scroll]").forEach(function (b) {
      b.addEventListener("click", function () {
        var card = rail.querySelector(".exp");
        var step = card ? card.getBoundingClientRect().width + 18 : 320;
        rail.scrollBy({ left: step * parseInt(b.getAttribute("data-scroll"), 10), behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
    var down = false, moved = false, startX = 0, startLeft = 0;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add("is-dragging"); }
      if (moved) rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = false;
      rail.classList.remove("is-dragging");
    });
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  /* =========================================================
     Weekends · budget planner
     ========================================================= */

  var planner = $("[data-planner]");
  var tripsEl = $("[data-trips]");
  if (planner && tripsEl) {
    // Rough per-person estimates: return travel, one hostel bed per night, food per day.
    var TRIPS = [
      { name: "San Sebastián", how: "Bus · 1 h 20", travel: 16, bed: 35, food: 20, min: 0 },
      { name: "Vitoria-Gasteiz", how: "Bus · 1 h", travel: 14, bed: 26, food: 16, min: 0 },
      { name: "Santander", how: "Bus · 1 h 30", travel: 22, bed: 30, food: 18, min: 0 },
      { name: "Logroño", how: "Bus · 2 h", travel: 28, bed: 28, food: 20, min: 0 },
      { name: "Biarritz", how: "Bus · 2 h 30", travel: 32, bed: 42, food: 26, min: 0 },
      { name: "Picos de Europa", how: "Car share · 2 h 30", travel: 38, bed: 22, food: 18, min: 1 },
      { name: "Madrid", how: "Train · 5 h", travel: 50, bed: 30, food: 22, min: 1 },
      { name: "Porto", how: "Flight · 1 h", travel: 75, bed: 26, food: 18, min: 1 }
    ];
    var SCALE = 250;
    var range = $("#budget");
    var out = $("[data-budget-out]");
    var countEl = $("[data-planner-count]");

    TRIPS.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "trip";
      li.innerHTML =
        '<div><p class="trip__name"></p><p class="trip__meta"></p></div>' +
        '<div class="trip__total"><span class="trip__sum"></span><span class="trip__status"></span></div>' +
        '<div class="trip__bar" aria-hidden="true"><span class="t"></span><span class="b"></span><span class="f"></span></div>';
      li.querySelector(".trip__name").textContent = t.name;
      li.querySelector(".trip__meta").textContent = t.how;
      t.el = li;
      tripsEl.appendChild(li);
    });

    var render = function () {
      var budget = parseInt(range.value, 10);
      var nights = parseInt((planner.querySelector('input[name="nights"]:checked') || {}).value || "1", 10);
      out.textContent = "€" + budget;
      range.style.setProperty("--fill", ((budget - range.min) / (range.max - range.min) * 100).toFixed(1) + "%");

      var first = new Map();
      TRIPS.forEach(function (t) { first.set(t, t.el.getBoundingClientRect().top); });

      var fits = 0;
      TRIPS.forEach(function (t) {
        t.na = nights < t.min;
        var bedCost = t.bed * nights, foodCost = t.food * (nights + 1);
        t.total = t.travel + bedCost + foodCost;
        t.over = !t.na && t.total > budget;
        if (!t.na && !t.over) fits++;

        var li = t.el;
        li.classList.toggle("is-over", t.over);
        li.classList.toggle("is-na", t.na);
        li.querySelector(".trip__sum").textContent = t.na ? "—" : "€" + t.total;
        li.querySelector(".trip__status").textContent = t.na ? "Needs a night" : t.over ? "€" + (t.total - budget) + " over" : "€" + (budget - t.total) + " left";
        var bar = li.querySelector(".trip__bar");
        bar.style.setProperty("--budget-x", Math.min(100, budget / SCALE * 100) + "%");
        bar.querySelector(".t").style.width = (t.na ? 0 : t.travel / SCALE * 100) + "%";
        bar.querySelector(".b").style.width = (t.na ? 0 : bedCost / SCALE * 100) + "%";
        bar.querySelector(".f").style.width = (t.na ? 0 : foodCost / SCALE * 100) + "%";
      });

      var rank = function (t) { return t.na ? 2 : t.over ? 1 : 0; };
      TRIPS.slice().sort(function (a, b) { return rank(a) - rank(b) || a.total - b.total; })
        .forEach(function (t) { tripsEl.appendChild(t.el); });

      if (!reduceMotion && tripsEl.animate) {
        TRIPS.forEach(function (t) {
          var dy = first.get(t) - t.el.getBoundingClientRect().top;
          if (Math.abs(dy) > 1) t.el.animate([{ transform: "translateY(" + dy + "px)" }, { transform: "none" }], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" });
        });
      }

      countEl.innerHTML = fits
        ? "<b>" + fits + "</b> " + (fits === 1 ? "trip fits" : "trips fit") + " your budget"
        : "Nothing fits yet. Try a day trip or a bigger budget.";
    };

    range.addEventListener("input", render);
    $$('input[name="nights"]', planner).forEach(function (r) { r.addEventListener("change", render); });
    render();
  }

  /* =========================================================
     Programme · checklist ring
     ========================================================= */

  var checklist = $("[data-checklist]");
  if (checklist) {
    var ring = $("[data-ring]"), ringLabel = $("[data-ring-label]");
    var update = function () {
      var boxes = $$("input", checklist);
      var done = boxes.filter(function (b) { return b.checked; }).length;
      ring.style.setProperty("--p", (done / boxes.length * 100).toFixed(1) + "%");
      ringLabel.textContent = done + "/" + boxes.length;
    };
    checklist.addEventListener("change", update);
    update();
  }

  /* =========================================================
     Join · waitlist (preview: sends nothing)
     ========================================================= */

  var join = $("[data-join-form]");
  if (join) {
    var msg = $("[data-join-msg]", join);
    join.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("#join-email", join);
      if (!email.value || !email.checkValidity()) {
        msg.textContent = "That email doesn't look complete. Check for a missing @ or domain.";
        msg.classList.add("is-error");
        email.focus();
        return;
      }
      msg.classList.remove("is-error");
      msg.textContent = "Got it: " + email.value + ", " + $("#join-city", join).value + ". In the live version, this is where you'd join the list.";
      join.classList.remove("is-sent"); void join.offsetWidth; join.classList.add("is-sent");
    });
  }
  $$("[data-role-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      var r = document.getElementById("role-" + a.getAttribute("data-role-link"));
      if (r) r.checked = true;
    });
  });
})();
