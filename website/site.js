(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- photos ---------- */
  $$("[data-photo]").forEach(function (img) {
    var id = img.getAttribute("data-photo");
    if (window.CORNERS_PHOTOS && window.CORNERS_PHOTOS[id]) img.src = window.CORNERS_PHOTOS[id];
  });

  /* ---------- scroll reveals ---------- */
  var revealables = $$(".rv");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (n) { n.classList.add("in"); });
  } else {
    var seen = new Map();
    revealables.forEach(function (n) {
      if (n.getBoundingClientRect().top < innerHeight * 0.92) { n.classList.add("in"); return; }
      var parent = n.parentElement;
      var i = seen.get(parent) || 0;
      seen.set(parent, i + 1);
      n.style.setProperty("--d", Math.min(i * 0.07, 0.42) + "s");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (n) { if (!n.classList.contains("in")) io.observe(n); });
  }

  /* ---------- nav: progress, stuck state, active link ---------- */
  var nav = $("[data-nav]"), bar = $("[data-progress]"), cta = $("[data-cta]");
  var links = $$(".nav__links a");
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - innerHeight;
      var p = max > 0 ? Math.min(1, scrollY / max) : 0;
      if (bar) bar.style.setProperty("--sp", p.toFixed(4));
      if (nav) nav.classList.toggle("is-stuck", scrollY > 12);
      if (cta) cta.classList.toggle("on", scrollY > innerHeight * 0.9 && p < 0.92);

      var active = -1;
      sections.forEach(function (sec, i) {
        if (sec && sec.getBoundingClientRect().top <= innerHeight * 0.38) active = i;
      });
      links.forEach(function (a, i) { a.classList.toggle("is-on", i === active); });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- count-up stats ---------- */
  var counters = $$("[data-count]");
  if (counters.length) {
    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = target.toLocaleString("en-GB") + suffix; return; }
      var start = Date.now(), dur = 1400, done = false;
      var finish = function () {
        if (done) return;
        done = true;
        el.textContent = target.toLocaleString("en-GB") + suffix;
      };
      var tick = function () {
        if (done) return;
        var t = Math.min(1, (Date.now() - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-GB") + suffix;
        if (t < 1) requestAnimationFrame(tick); else finish();
      };
      requestAnimationFrame(tick);
      setTimeout(finish, dur + 250); // never leave it stuck at zero
    };
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          run(en.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else counters.forEach(run);
  }

  /* ---------- collage drift ---------- */
  var collage = $(".collage");
  if (collage && !reduce && matchMedia("(pointer: fine)").matches) {
    var raf = false, last = null;
    collage.addEventListener("pointermove", function (e) {
      last = e;
      if (raf) return;
      raf = true;
      requestAnimationFrame(function () {
        raf = false;
        var r = collage.getBoundingClientRect();
        var x = (last.clientX - r.left) / r.width - 0.5;
        var y = (last.clientY - r.top) / r.height - 0.5;
        $$("figure", collage).forEach(function (f, i) {
          var depth = [10, 18, 14][i] || 12;
          f.style.translate = (x * depth).toFixed(1) + "px " + (y * depth).toFixed(1) + "px";
        });
      });
    });
    collage.addEventListener("pointerleave", function () {
      $$("figure", collage).forEach(function (f) { f.style.translate = ""; });
    });
  }

  /* ---------- waitlist (preview) ---------- */
  var form = $("[data-join]");
  if (form) {
    form.addEventListener("submit", function () {
      var email = $("#email"), msg = $("[data-msg]");
      if (!email.value || !email.checkValidity()) {
        msg.textContent = "That email doesn't look complete — check for a missing @ or domain.";
        email.focus();
        return;
      }
      msg.textContent = "Got it: " + email.value + ", " + $("#city").value + ". Preview build, so nothing was sent.";
    });
  }
})();
