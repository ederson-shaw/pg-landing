/* PitchGenius — 03-clay-system
   Motion kept to what demonstrates the product:
   - tabs switch the three moments
   - reveal on scroll (mirrors clay's pop-in)
   - the readiness number steps up the way the product actually behaves
   prefers-reduced-motion: reveals show instantly, number is static. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- tabs: before / during / after ---- */
  var tabs = document.querySelectorAll(".tab");
  function activate(name) {
    document.querySelectorAll(".tab").forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".panel").forEach(function (p) {
      var on = p.id === "panel-" + name;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
      if (on) {
        var r = p.querySelector(".reveal");
        if (r) r.classList.add("is-in");
      }
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { activate(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var order = ["before", "during", "after"];
        var i = order.indexOf(t.dataset.tab) + (e.key === "ArrowRight" ? 1 : -1);
        i = (i + order.length) % order.length;
        var next = document.querySelector('.tab[data-tab="' + order[i] + '"]');
        if (next) next.focus();
        activate(order[i]);
      }
    });
  });

  /* ---- live card + stage rotation: the ONE motion that demonstrates the product ----
     Two real moments from PRODUCT.md cycle: the Russell/45/DISCOVERY moment and the
     Judd/25/VALUE moment. The SAY THIS line and HumanCue observation replace themselves
     exactly as the real product behaves. Paused under prefers-reduced-motion. */
  var moments = [
    {
      obs: "buyer is still describing the screen display",
      say: "The display scales to fit the screen. What are you seeing on your screen?",
      whyParts: ["reading the room", "\u2192", "this is the moment it costs him something"],
      readiness: 45, stage: "DISCOVERY"
    },
    {
      obs: "buyer has no champion pushing this internally",
      say: "Before we get into the mechanics, Judd \u2014 who on your team is actually pushing for a change to how you handle these calls, and what are they hoping to see happen differently?",
      whyParts: ["develop shared urgency", "\u2192", "without a champion, this stalls"],
      readiness: 25, stage: "VALUE"
    }
  ];
  var idx = 0;
  function setText(el, txt) { if (el) el.textContent = txt; }
  function renderMoment(m) {
    document.querySelectorAll("[data-obs]").forEach(function (el) { setText(el, m.obs); });
    document.querySelectorAll("[data-say]").forEach(function (el) { setText(el, m.say); });
    document.querySelectorAll("[data-readiness]").forEach(function (el) {
      el.setAttribute("data-readiness", String(m.readiness));
      if (reduce) { el.textContent = String(m.readiness); }
      else { countUpTo(el, m.readiness); }
    });
    document.querySelectorAll("[data-stage]").forEach(function (el) { setText(el, m.stage); });
    document.querySelectorAll("[data-stage-mini]").forEach(function (el) { setText(el, m.stage.charAt(0) + m.stage.slice(1).toLowerCase()); });
    var why = document.querySelector("[data-why]");
    if (why) {
      why.innerHTML = "<span>" + m.whyParts[0] + "</span> <span class=\"arrow\">\u2192</span> <span class=\"why-reason\">" + m.whyParts[2] + "</span>";
    }
  }
  function countUpTo(el, target) {
    var from = parseInt(el.textContent, 10); if (isNaN(from)) from = 0;
    var start = null, dur = 900;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  /* render the initial moment so the state slot shows the observation, not "Listening" */
  renderMoment(moments[0]);
  /* auto-rotate when the live section is visible */
  var stage = document.querySelector(".stage");
  if (stage && !reduce) {
    setInterval(function () {
      if (document.hidden) return;
      var stageRect = stage.getBoundingClientRect();
      if (stageRect.bottom < 0 || stageRect.top > window.innerHeight) return;
      idx = (idx + 1) % moments.length;
      renderMoment(moments[idx]);
    }, 4200);
  }
  /* clicking Next inside the hero card or stage advances the moment manually */
  document.querySelectorAll("[data-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      idx = (idx + 1) % moments.length;
      renderMoment(moments[idx]);
    });
  });

  /* ---- reveal on scroll ----
     Clay staggers sibling reveals inside the same section (its compiled IX JSON is not
     inspectable statically, so the exact ms is not literal-copied); what is copied is the
     mechanism — elements sharing a parent are not painted in on the same frame. Each
     reveal gets a --stagger index among its reveal siblings, capped at 4 steps so a long
     list does not crawl in one at a time. */
  var reveals = document.querySelectorAll(".reveal");
  (function stagger() {
    var seen = new Map();
    reveals.forEach(function (r) {
      var p = r.parentElement;
      var n = (seen.get(p) || 0);
      r.style.setProperty("--stagger", String(Math.min(n, 4)));
      seen.set(p, n + 1);
    });
  })();
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (r) { r.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---- readiness count-up (the one justified number motion) ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-readiness"), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var start = null, dur = 1100, from = 0;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var reads = document.querySelectorAll("[data-readiness]");
  if (!("IntersectionObserver" in window)) {
    reads.forEach(countUp);
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); ro.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    reads.forEach(function (r) { ro.observe(r); });
  }

  /* ---- year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
