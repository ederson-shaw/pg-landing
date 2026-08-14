(function () {
  "use strict";

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Second live-call card (three-moments, "02 - during the call"): tiltIn
  // once it scrolls into view, matching gong's real tiltIn card-entrance
  // (perspective rotateX, not a fade) instead of a generic reveal.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var momentCard = document.querySelector(".moment-shot-card .livecard");
    if (momentCard) {
      document.documentElement.classList.add("js-tilt");
      var tiltIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            momentCard.classList.add("tilt-in");
            tiltIo.disconnect();
          }
        });
      }, { threshold: 0.3 });
      tiltIo.observe(momentCard);
    }
  }

  var waveBarsEls = document.querySelectorAll(".wave-bars");
  if (waveBarsEls.length) {
    var heights = [20,35,50,30,65,45,80,55,40,70,35,60,25,50,75,40,55,30,65,45,80,50,35,60,25,45,70,40,55,30,50,65,35,45,25,40,55,30,45,20];
    waveBarsEls.forEach(function(el) {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < heights.length; i++) {
        var s = document.createElement("span");
        s.style.height = heights[i] + "%";
        frag.appendChild(s);
      }
      el.appendChild(frag);
    });
  }

  var card = document.getElementById("livecard");
  var undoWrap = document.getElementById("heroCardUndo");

  if (card) {
    var next = document.getElementById("cardNext");
    var dismiss = document.getElementById("cardDismiss");
    var undo = document.getElementById("cardUndo");

    if (next) next.addEventListener("click", function () {
      var target = document.getElementById("how");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (dismiss) dismiss.addEventListener("click", function () {
      card.classList.add("dismissed");
      if (undoWrap) undoWrap.hidden = false;
    });
    if (undo) undo.addEventListener("click", function () {
      card.classList.remove("dismissed");
      if (undoWrap) undoWrap.hidden = true;
    });
  }

  var readiness = document.getElementById("readiness");
  if (!readiness) return;

  var target = 45;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    readiness.textContent = String(target);
    return;
  }

  function animate() {
    var start = null;
    var duration = 1200;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      readiness.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else readiness.textContent = String(target);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(); io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(readiness);
  } else {
    animate();
  }
})();
