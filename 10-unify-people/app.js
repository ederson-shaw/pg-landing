(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    const closeMenu = function () {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  document.querySelectorAll('.live-card').forEach(function (card) {
    const liveBody = card.querySelector('.live-card-body');
    const liveEmpty = card.querySelector('.live-empty');
    const status = card.querySelector('.card-action-status');
    const nextButton = card.querySelector('.card-next');
    const dismissButton = card.querySelector('.card-dismiss');
    if (nextButton) {
      nextButton.addEventListener('click', function () {
        if (status) status.textContent = 'next move selected';
        nextButton.textContent = 'Selected';
        nextButton.disabled = true;
      });
    }
    if (dismissButton && liveBody && liveEmpty) {
      dismissButton.addEventListener('click', function () {
        liveBody.hidden = true;
        liveEmpty.hidden = false;
        if (status) status.textContent = 'suggestion dismissed';
      });
    }
  });

  document.querySelectorAll('.fold-toggle, .detail-link').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const card = trigger.closest('.live-card');
      const detail = card && card.querySelector('.live-detail');
      if (!detail) return;
      const expanded = detail.hidden;
      detail.hidden = !expanded;
      card.querySelectorAll('.fold-toggle').forEach(function (button) {
        button.setAttribute('aria-expanded', String(expanded));
        button.setAttribute('aria-label', expanded ? 'Hide call detail' : 'Show call detail');
      });
    });
  });

  // dialog entrance/exit use the .42s cubic-bezier(.18,.86,.22,1) curve set in CSS on
  // .demo-dialog-inner; is-open just toggles which side of that transition is active.
  function wireDialog(dialog, openers, closeButton) {
    if (!dialog || !openers.length) return;
    openers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        dialog.showModal();
        requestAnimationFrame(function () { dialog.classList.add('is-open'); });
      });
    });
    const startClose = function () {
      dialog.classList.remove('is-open');
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) { dialog.close(); return; }
      const onEnd = function () { dialog.close(); dialog.removeEventListener('transitionend', onEnd); };
      dialog.addEventListener('transitionend', onEnd);
    };
    if (closeButton) closeButton.addEventListener('click', startClose);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) startClose();
    });
  }

  wireDialog(document.querySelector('.demo-dialog'), document.querySelectorAll('.demo-trigger'), document.querySelector('.demo-close'));
  wireDialog(document.querySelector('.pilot-dialog'), document.querySelectorAll('.pilot-trigger'), document.querySelector('.pilot-close'));

  // Reveal timing matches unifygtm.com's real hero-suggestion chips: opacity 0->1,
  // translateY(8px)->0, 0.3s ease (./ref/index.raw.html:1102-1116). Grouped rows
  // (mechanism-list, people-grid) stagger each child 60ms apart via CSS nth-child
  // delays, same reveal, not a separate slower animation.
  const revealTargets = document.querySelectorAll('.truth-strip, .story-intro, .split-content, .after-copy, .mechanism-list, .calibration-copy, .people-grid, .final-inner');
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!entry.target.hasAttribute('data-reveal-group')) entry.target.setAttribute('data-reveal', '');
        window.requestAnimationFrame(function () { entry.target.classList.add('is-visible'); });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 }) : null;
  revealTargets.forEach(function (target) {
    if (observer) observer.observe(target);
  });

  // Readiness counter: matches unifygtm.com's real countup script exactly —
  // easeOutQuart via requestAnimationFrame, an IntersectionObserver that disconnects
  // itself after the first intersection instead of re-triggering, threshold .25
  // (./ref/index.raw.html:1598-1612, 1804-1873, 1986-2022). Their BASE_DUR is 1719ms;
  // reused here as-is since a live readiness score is the same kind of value they
  // animate — a number that means more once you've watched it climb.
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function animateCount(el) {
    const target = parseInt(el.textContent, 10);
    if (!target || reduceMotion) return;
    const duration = 1719;
    const start = performance.now();
    el.textContent = '0';
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * easeOutQuart(progress)));
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('.live-context strong[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .25 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }
})();
