/* 13-ashby-manifesto — app.js
   Motion is opt-in and confined to one component: the live product card.
   Every other section renders static and immediate, matching ashby's own
   homepage (no generic scroll-fade on headings/paragraphs — see
   ref/EXTRACT.md §6). Reduced-motion users see the card fully assembled,
   readiness at 45, no count-up, no stagger. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mountLiveCard() {
    var card = document.getElementById('live-card');
    var numEl = document.getElementById('readiness');
    if (!card || !numEl) return;

    var TARGET = 45;

    function settle() {
      card.classList.add('is-in');
      numEl.textContent = String(TARGET);
    }

    if (reduce || !('IntersectionObserver' in window)) {
      settle();
      return;
    }

    var played = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !played) {
          played = true;
          runCountUp(numEl, TARGET);
          card.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(card);

    /* safety: if never intersected (e.g. very tall card / odd viewport), settle after load */
    window.addEventListener('load', function () {
      if (!played) {
        var r = card.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          played = true;
          runCountUp(numEl, TARGET);
          card.classList.add('is-in');
        }
      }
    });
  }

  /* step the readiness number 0 -> target with small jitter, like the real product */
  function runCountUp(el, target) {
    var start = performance.now();
    var dur = 1200;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      var v = Math.round(target * eased);
      el.textContent = String(v);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }
    requestAnimationFrame(frame);
  }

  function init() {
    mountLiveCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
