(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var waveContainer = document.getElementById('wave-bars');
  var stateEl = document.getElementById('lc-state');
  var readinessEl = document.getElementById('readiness');

  if (waveContainer) {
    var bars = 40;
    for (var i = 0; i < bars; i++) {
      var bar = document.createElement('span');
      var delay = (i * 0.04) % 1.4;
      bar.style.animationDelay = delay + 's';
      bar.style.height = (15 + Math.random() * 60) + '%';
      waveContainer.appendChild(bar);
    }
  }

  var staticWave = document.querySelector('.lc2-wave-bars-static');
  if (staticWave) {
    var sbars = 40;
    for (var j = 0; j < sbars; j++) {
      var sbar = document.createElement('span');
      sbar.style.height = (15 + Math.random() * 60) + '%';
      staticWave.appendChild(sbar);
    }
  }

  var navItems = document.querySelectorAll('.showcase-nav-item');
  var panels = document.querySelectorAll('.showcase-panel');
  if (navItems.length && panels.length && 'IntersectionObserver' in window) {
    var byTarget = {};
    navItems.forEach(function (item) {
      byTarget[item.getAttribute('data-target')] = item;
    });
    var showcaseObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var item = byTarget[entry.target.id];
          if (!item) return;
          if (entry.isIntersecting) {
            navItems.forEach(function (i) { i.classList.remove('is-active'); });
            item.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    panels.forEach(function (panel) { showcaseObserver.observe(panel); });
  }

  if (!stateEl || !readinessEl) return;

  if (reduce) return;

  var states = [
    { text: 'Listening', cls: '' },
    { text: 'buyer is still describing the screen display', cls: 'writing' },
    { text: 'Listening', cls: '' }
  ];
  var readinessSteps = [45, 46, 44, 45, 47, 45];
  var step = 0;

  function tick() {
    var state = states[step % states.length];
    stateEl.textContent = state.text;
    stateEl.className = 'lc2-state ' + state.cls;

    var r = readinessSteps[step % readinessSteps.length];
    readinessEl.textContent = String(r);

    step++;
  }

  setInterval(tick, 3200);
})();
