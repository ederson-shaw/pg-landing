(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.04 });
    revealItems.forEach((el) => observer.observe(el));
  }

  // Keep the fixed header visually tied to the artboard it is crossing.
  // The reference uses a light header for editorial pages and a navy header
  // for the three dark moments, so this is derived from the actual section
  // geometry instead of a brittle scroll threshold.
  const header = document.querySelector('[data-header]');
  const darkSections = [...document.querySelectorAll('.page--navy, .page--photo')];
  const updateHeaderTheme = () => {
    if (!header || !darkSections.length) return;
    const probe = window.scrollY + header.offsetHeight + 8;
    const active = darkSections.some((section) => {
      const top = section.offsetTop;
      return probe >= top && probe < top + section.offsetHeight;
    });
    header.classList.toggle('is-dark', active);
  };
  updateHeaderTheme();
  window.addEventListener('scroll', updateHeaderTheme, { passive: true });
  window.addEventListener('resize', updateHeaderTheme, { passive: true });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      menu.classList.toggle('is-open', !open);
      if (!open) menu.querySelector('a')?.focus();
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const card = document.querySelector('[data-hc-card]');
  const handle = card?.querySelector('[data-hc-handle]');
  if (handle) {
    handle.setAttribute('role', 'button');
    handle.setAttribute('aria-roledescription', 'draggable HumanCue card');
    handle.setAttribute('aria-label', 'Move HumanCue card. Press Escape to reset.');
    handle.setAttribute('aria-grabbed', 'false');
  }
  if (card && handle && window.matchMedia('(min-width: 821px)').matches) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    const move = (event) => {
      if (!dragging) return;
      const point = event.touches?.[0] || event;
      const nextX = Math.max(-250, Math.min(40, originX + point.clientX - startX));
      const nextY = Math.max(-95, Math.min(280, originY + point.clientY - startY));
      card.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    };
    const end = () => {
      dragging = false;
      card.setAttribute('aria-grabbed', 'false');
      handle.setAttribute('aria-grabbed', 'false');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
    };
    handle.addEventListener('pointerdown', (event) => {
      // The header is the drag handle, but its live controls must remain real
      // controls. Pointer capture on a button would swallow its click event.
      if (event.target.closest('button, a, input, select, textarea')) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(card).transform);
      originX = matrix.m41 || 0;
      originY = matrix.m42 || 0;
      card.setAttribute('aria-grabbed', 'true');
      handle.setAttribute('aria-grabbed', 'true');
      handle.setPointerCapture?.(event.pointerId);
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', end);
    });
    handle.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        card.style.transform = '';
        card.setAttribute('aria-grabbed', 'false');
        handle.setAttribute('aria-grabbed', 'false');
        return;
      }
      const deltas = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
      const delta = deltas[event.key];
      if (delta) {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(card).transform);
        const nextX = Math.max(-250, Math.min(40, (matrix.m41 || 0) + delta[0]));
        const nextY = Math.max(-95, Math.min(280, (matrix.m42 || 0) + delta[1]));
        card.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
        card.setAttribute('aria-grabbed', 'true');
        handle.setAttribute('aria-grabbed', 'true');
        event.preventDefault();
      }
    });
  }

  const toggles = [...document.querySelectorAll('[data-detail-toggle]')];
  const detail = document.querySelector('#cue-detail');
  const setDetail = (open) => {
    if (!detail) return;
    detail.hidden = !open;
    toggles.forEach((toggle) => toggle.setAttribute('aria-expanded', String(open)));
  };
  toggles.forEach((toggle) => toggle.addEventListener('click', () => setDetail(detail?.hidden !== false)));

  const status = document.querySelector('[data-cue-status]');
  const cueBody = document.querySelector('.cue-card__body, .hc-main');
  const nextButton = document.querySelector('[data-cue-next]');
  const setCueBody = (hidden) => {
    if (!cueBody) return;
    if (cueBody.classList.contains('hc-main')) {
      [...cueBody.children]
        .filter((child) => child !== status)
        .forEach((child) => { child.hidden = hidden; });
    } else {
      cueBody.hidden = hidden;
    }
  };
  document.querySelector('[data-cue-dismiss]')?.addEventListener('click', () => {
    setCueBody(true);
    if (status) { status.hidden = false; status.firstChild.textContent = 'HumanCue stays quiet. '; }
    setDetail(false);
  });
  document.querySelector('[data-cue-reset]')?.addEventListener('click', () => {
    setCueBody(false);
    if (status) status.hidden = true;
    if (card) {
      card.style.transform = '';
      card.setAttribute('aria-grabbed', 'false');
    }
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.textContent = 'Next';
      nextButton.setAttribute('aria-label', 'Next cue');
    }
  });
  document.querySelector('[data-cue-end]')?.addEventListener('click', () => {
    setCueBody(true);
    if (status) { status.hidden = false; status.firstChild.textContent = 'Live cue ended for this demo. '; }
    setDetail(false);
  });
  nextButton?.addEventListener('click', (event) => {
    event.currentTarget.textContent = 'Noted';
    event.currentTarget.setAttribute('aria-label', 'Cue noted');
    event.currentTarget.disabled = true;
  });
})();
