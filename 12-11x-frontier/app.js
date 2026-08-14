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
      });
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); });
      });
    }
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
      dots.forEach(function (d, idx) { d.setAttribute("aria-selected", idx === cur ? "true" : "false"); });
      if (count) count.textContent = String(cur + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
    }
    dots.forEach(function (d, idx) { d.addEventListener("click", function () { go(idx); }); });
    go(0);
  })();

  /* tabs */
  (function () {
    var links = document.querySelectorAll(".tablink");
    if (!links.length) return;
    var panes = document.querySelectorAll(".tabs__pane");
    function select(btn) {
      links.forEach(function (l) { l.setAttribute("aria-selected", l === btn ? "true" : "false"); });
      var tab = btn.getAttribute("data-tab");
      panes.forEach(function (p) {
        var match = p.id === "pane-" + tab;
        p.classList.toggle("is-active", match);
      });
    }
    links.forEach(function (l) { l.addEventListener("click", function () { select(l); }); });
  })();

  /* live readiness number micro-stepping (the one product-justified motion) */
  (function () {
    var nodes = document.querySelectorAll(".rdy");
    if (!nodes.length) return;
    if (reduce) { nodes.forEach(function(n){ n.textContent = "45"; }); return; }
    var steps = [44, 46, 45, 47, 45, 43, 45], k = 0;
    nodes.forEach(function(n){ n.style.transition = "opacity .25s cubic-bezier(.2,1,.3,1)"; });
    setInterval(function () {
      if (!document.hidden) {
        k = (k + 1) % steps.length;
        nodes.forEach(function(n){ n.style.opacity = "0.3"; });
        setTimeout(function () {
          nodes.forEach(function(n){ n.textContent = String(steps[k]); n.style.opacity = "1"; });
        }, 160);
      }
    }, 1900);
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
