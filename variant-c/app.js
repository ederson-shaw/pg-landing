(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: dark theme over dark sections + burger */
  (function () {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    if (!nav) return;
    var themed = Array.prototype.slice.call(document.querySelectorAll("[data-nav-theme]"));
    function onScroll() {
      var navRect = nav.getBoundingClientRect();
      var midY = navRect.top + navRect.height / 2;
      var dark = false;
      var darkId = "";
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= midY && r.bottom >= midY) { dark = true; darkId = themed[i].id; break; }
      }
      nav.classList.toggle("nav--dark", dark);
      nav.classList.toggle("nav--s07", darkId === "s07");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("open"); });
      });
    }
  })();

  /* one-shot reveal sweep (jump-immune) */
  (function () {
    var pending = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], [data-stagger], .s02__photo, .s04__journey"));
    if (reduce || !("IntersectionObserver" in window)) {
      pending.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var tick = false;
    function sweep() {
      if (tick || !pending.length) return;
      tick = true;
      requestAnimationFrame(function () {
        var keep = [];
        var line = window.innerHeight * 0.86;
        pending.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < line) el.classList.add("is-in");
          else keep.push(el);
        });
        pending = keep;
        tick = false;
      });
    }
    window.addEventListener("scroll", sweep, { passive: true });
    sweep();
  })();

  /* s03: curve draw scrubbed by scroll position of the curve element */
  (function () {
    var path = document.querySelector(".s03__path");
    var curveBox = document.querySelector(".s03__curve");
    if (!path || !curveBox || reduce) return;
    if (!("getTotalLength" in path)) return;
    var len = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    var shown = false;
    function frame() {
      var r = curveBox.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.9 - r.top) / (vh * 0.85);
      progress = Math.max(0, Math.min(1, progress));
      path.style.strokeDashoffset = String(len * (1 - progress));
      if (progress >= 1) shown = true;
    }
    window.addEventListener("scroll", frame, { passive: true });
    frame();
    if (shown) return;
  })();
})();
