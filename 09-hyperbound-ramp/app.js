(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ramp signature: beats scroll through viewport center, card swaps.
     No sticky, no triggers — the beats ARE the observers. Card data stays
     the real Russell Pontone moment — only the annotation + section layer
     thins. */
  var ramp = document.querySelector("[data-ramp]");
  if (ramp) {
    var card = ramp.querySelector(".live-card-ramp");
    var beats = Array.prototype.slice.call(ramp.querySelectorAll("[data-ramp-beats] .ramp-beat"));
    var rail = ramp.querySelector("[data-ramp-rail]");
    var beatsList = ramp.querySelector("[data-ramp-beats]");

    /* Rail position/height set in JS, motion left to the CSS transform
       transition — same split as hyperbound's real .ra-hiw-nav-bar
       (computeStickyTop/setActive pattern: JS places it, CSS eases it). */
    function updateRail(activeLi) {
      if (!rail || !activeLi || !beatsList) return;
      var listRect = beatsList.getBoundingClientRect();
      var itemRect = activeLi.getBoundingClientRect();
      rail.style.height = itemRect.height + "px";
      rail.style.transform = "translateY(" + (itemRect.top - listRect.top) + "px)";
    }

    function setBeat(n) {
      if (!card) return;
      card.setAttribute("data-beat", String(n));
      var activeLi = null;
      beats.forEach(function (b) {
        var isActive = b.getAttribute("data-beat") === String(n);
        b.classList.toggle("is-active", isActive);
        if (isActive) activeLi = b;
      });
      updateRail(activeLi);
    }
    setBeat(1);
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setBeat(parseInt(e.target.getAttribute("data-beat"), 10));
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      beats.forEach(function (b) { io.observe(b); });
    } else {
      beats.forEach(function (b) { b.classList.add("is-active"); });
    }
    window.addEventListener("resize", function () {
      var current = beats.filter(function (b) { return b.classList.contains("is-active"); })[0];
      updateRail(current || beats[0]);
    });
  }

  /* Readiness count-up: reveals the real 45 on load, the way the product
     recalculates it live. No invented number — counts to 45 and stops. */
  var readEl = document.querySelector("[data-readiness]");
  if (readEl && !reduce) {
    var target = 45;
    var started = false;
    function run() {
      if (started) return; started = true;
      var n = 0;
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 900, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        readEl.textContent = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else readEl.textContent = String(target);
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { run(); ro.disconnect(); } });
      }, { threshold: 0.4 });
      ro.observe(readEl);
    } else { run(); }
  }
})();
