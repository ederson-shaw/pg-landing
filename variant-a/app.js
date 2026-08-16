(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: light on scroll + burger */
  (function () {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    if (!nav) return;
    function onScroll() {
      var hero = document.querySelector(".hero");
      var limit = hero ? hero.offsetHeight - 120 : 600;
      nav.classList.toggle("is-light", window.scrollY > limit);
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

  /* before/after cards reveal their second evidence surface without adding another section */
  (function () {
    document.querySelectorAll("[data-flip-card]").forEach(function (card) {
      var front = card.querySelector(".flip-card__front");
      var back = card.querySelector(".flip-card__back");
      if (!front || !back) return;
      card.querySelectorAll("[data-flip]").forEach(function (button) {
        button.addEventListener("click", function () {
          var flipped = card.classList.toggle("is-flipped");
          front.setAttribute("aria-hidden", flipped ? "true" : "false");
          back.setAttribute("aria-hidden", flipped ? "false" : "true");
          front.inert = flipped;
          back.inert = !flipped;
          card.querySelectorAll("[data-flip]").forEach(function (control) {
            control.setAttribute("aria-pressed", flipped ? "true" : "false");
          });
          var target = flipped ? back.querySelector("[data-flip]") : front.querySelector("[data-flip]");
          if (target) target.focus();
        });
      });
    });
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
          var after = document.getElementById("after");
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


    var plax = document.querySelectorAll("[data-parallax]");
    if (plax.length && !reduce && window.matchMedia("(min-width: 681px)").matches) {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          plax.forEach(function (el) {
            var r = el.getBoundingClientRect();
            var mid = r.top + r.height / 2 - window.innerHeight / 2;
            var clamped = Math.max(-1, Math.min(1, mid / window.innerHeight));
            el.style.transform = "translateY(" + (clamped * 24).toFixed(1) + "px)";
          });
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  })();

  /* carousel — manual only (reference: autoplay false) */
  (function () {
    var track = document.getElementById("ctrack");
    if (!track) return;
    var slides = track.children;
    var dots = document.querySelectorAll("#cdots button");
    var count = document.getElementById("ccount");
    var n = slides.length, cur = 0;
    function go(i) {
      cur = (i + n) % n;
      track.style.transform = "translateX(" + (-cur * 100) + "%)";
      dots.forEach(function (d, idx) {
        var selected = idx === cur;
        d.setAttribute("aria-selected", selected ? "true" : "false");
        d.setAttribute("tabindex", selected ? "0" : "-1");
        if (slides[idx]) slides[idx].setAttribute("aria-hidden", selected ? "false" : "true");
      });
      if (count) count.textContent = String(cur + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
    }
    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () { go(idx); });
      d.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        var next = idx;
        if (e.key === "ArrowRight") next = (idx + 1) % n;
        if (e.key === "ArrowLeft") next = (idx - 1 + n) % n;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = n - 1;
        go(next);
        dots[next].focus();
      });
    });
    go(0);
  })();

  /* tabs */
  (function () {
    var links = document.querySelectorAll(".tablink");
    if (!links.length) return;
    var panes = document.querySelectorAll(".tabs__pane");
    function select(btn) {
      links.forEach(function (l) {
        var selected = l === btn;
        l.setAttribute("aria-selected", selected ? "true" : "false");
        l.setAttribute("tabindex", selected ? "0" : "-1");
      });
      var tab = btn.getAttribute("data-tab");
      panes.forEach(function (p) {
        var match = p.id === "pane-" + tab;
        p.classList.toggle("is-active", match);
        p.setAttribute("aria-hidden", match ? "false" : "true");
      });
    }
    links.forEach(function (l, idx) {
      l.addEventListener("click", function () { select(l); });
      l.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        var next = idx;
        if (e.key === "ArrowRight") next = (idx + 1) % links.length;
        if (e.key === "ArrowLeft") next = (idx - 1 + links.length) % links.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = links.length - 1;
        select(links[next]);
        links[next].focus();
      });
    });
  })();

})();
