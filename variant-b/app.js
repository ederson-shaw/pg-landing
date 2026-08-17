(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: light on scroll + burger */
  (function () {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    if (!nav) return;
    var themed = Array.prototype.slice.call(document.querySelectorAll("[data-nav-theme=\"dark\"]"));
    function onScroll() {
      var hero = document.querySelector(".hero");
      var limit = hero ? hero.offsetHeight - 120 : 600;
      nav.classList.toggle("is-light", window.scrollY > limit);
      var bar = 48, dark = false;
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= bar && r.bottom > bar) { dark = true; break; }
      }
      nav.classList.toggle("nav--dark", dark);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); });
      });
    }
  })();


  (function () {
    document.querySelectorAll("[data-details-toggle]").forEach(function (control) {
      control.addEventListener("click", function () {
        var target = document.getElementById(control.getAttribute("aria-controls"));
        if (!target) return;
        var open = target.hidden;
        target.hidden = !open;
        document.querySelectorAll('[aria-controls="' + target.id + '"]').forEach(function (toggle) {
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
      });
    });
  })();

  (function () {
    document.querySelectorAll(".lc").forEach(function (card) {
      var dismiss = card.querySelector(".lc__btn--dismiss");
      var next = card.querySelector(".lc__btn--next");
      var body = card.querySelector(".lc__body");
      if (dismiss && body) {
        dismiss.addEventListener("click", function () {
          var dismissed = !body.hidden;
          body.hidden = dismissed;
          dismiss.textContent = dismissed ? "Dismissed" : "Dismiss";
          dismiss.setAttribute("aria-pressed", dismissed ? "true" : "false");
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          var after = document.getElementById("s10");
          if (after) after.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        });
      }
    });
  })();

  (function () {
    document.querySelectorAll("[data-crm]").forEach(function (button) {
      button.addEventListener("click", function () {
        var selected = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", selected ? "false" : "true");
        button.classList.toggle("is-selected", !selected);
      });
    });
  })();

  /* reveal on scroll (line-mask + fade)
     reference (ref/EXTRACT.md #6a): trigger "top 85%", toggleActions "play none none
     reverse" — GSAP ScrollTrigger re-plays in reverse if you scroll back up past the
     entry point. Reclothed without GSAP: rootMargin -15% approximates "top 85%"; the
     class is removed (not unobserved) only when the element has left through the
     BOTTOM of the viewport (boundingClientRect.top > 0 = scrolled back up past it),
     never when it exits through the top after having played (scrolled down past it). */
  (function () {
    var pending = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], [data-stagger]"));
    if (reduce || !("IntersectionObserver" in window)) {
      pending.forEach(function (el) { el.classList.add("is-in"); });
      pending = [];
    }
    var revealTick = false;
    var revealSweep = function () {
      if (revealTick || !pending.length) return;
      revealTick = true;
      requestAnimationFrame(function () {
        var keep = [];
        var line = window.innerHeight * 0.88;
        pending.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < line) el.classList.add("is-in");
          else keep.push(el);
        });
        pending = keep;
        revealTick = false;
      });
    };
    window.addEventListener("scroll", revealSweep, { passive: true });
    revealSweep();

  })();

})();
