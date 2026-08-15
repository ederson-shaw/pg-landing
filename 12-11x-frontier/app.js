(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* strip rotation */
  (function () {
    var track = document.getElementById("strip");
    if (!track) return;
    var items = track.querySelectorAll(".strip__item");
    if (items.length < 2) return;
    var i = 0;
    function show(n) {
      items.forEach(function (it, idx) {
        it.style.transform = "translateY(" + ((idx - n) * 100) + "%)";
        it.style.opacity = idx === n ? "1" : "0";
      });
    }
    show(0);
    if (reduce) return;
    setInterval(function () { i = (i + 1) % items.length; show(i); }, 5200);
  })();

  /* nav: light on scroll + burger */
  (function () {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("is-light", window.scrollY > 24);
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

  /* reveal on scroll (line-mask + fade)
     reference (ref/EXTRACT.md #6a): trigger "top 85%", toggleActions "play none none
     reverse" — GSAP ScrollTrigger re-plays in reverse if you scroll back up past the
     entry point. Reclothed without GSAP: rootMargin -15% approximates "top 85%"; the
     class is removed (not unobserved) only when the element has left through the
     BOTTOM of the viewport (boundingClientRect.top > 0 = scrolled back up past it),
     never when it exits through the top after having played (scrolled down past it). */
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
        } else if (e.boundingClientRect.top > 0) {
          e.target.classList.remove("is-in");
        }
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
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

  /* generate wave bars into [data-wave] elements */
  (function () {
    var heights = [30,55,40,75,50,65,35,60,45,70,30,55,40,65,50,35,60,45,70,30,55,40,65,50,35,60,45,70,30,55,40,65,50,35,60,45,70,30,55,40,65,50,35,60,45,70];
    /* ref: index.raw.html audio-wire JS — random animationDelay from [50,150,300,450,600]ms per wire */
    var delays = [50, 150, 300, 450, 600];
    document.querySelectorAll("[data-wave]").forEach(function (wave) {
      wave.innerHTML = "";
      heights.forEach(function (h) {
        var i = document.createElement("i");
        i.style.height = h + "%";
        if (!reduce) i.style.animationDelay = delays[Math.floor(Math.random() * delays.length)] + "ms";
        wave.appendChild(i);
      });
    });
  })();
})();
