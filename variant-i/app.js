(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileMenuQuery = window.matchMedia('(max-width: 980px)');
  const menuLinks = menu ? [...menu.querySelectorAll('a')] : [];

  const setMenuState = (open, { returnFocus = false, focusFirst = false } = {}) => {
    if (!menu || !toggle) return;
    const isMobile = mobileMenuQuery.matches;
    const isOpen = Boolean(open && isMobile);

    menu.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');

    if (isMobile) {
      menu.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) menu.removeAttribute('inert');
      else menu.setAttribute('inert', '');
    } else {
      menu.removeAttribute('aria-hidden');
      menu.removeAttribute('inert');
    }

    if (isOpen && focusFirst) {
      const focusFirstLink = () => {
        if (menu.classList.contains('is-open') && !menu.inert) menuLinks[0]?.focus({ preventScroll: true });
      };
      focusFirstLink();
      window.setTimeout(focusFirstLink, 48);
    }
    if (!isOpen && returnFocus && isMobile) toggle.focus();
  };

  if (toggle && menu) {
    setMenuState(false);
    toggle.addEventListener('click', () => {
      const willOpen = !menu.classList.contains('is-open');
      setMenuState(willOpen, { returnFocus: !willOpen, focusFirst: willOpen });
    });
    menuLinks.forEach((link) => link.addEventListener('click', () => {
      setMenuState(false);
      window.setTimeout(() => { if (mobileMenuQuery.matches) toggle.focus(); }, 0);
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenuState(false, { returnFocus: true });
    });
    document.addEventListener('pointerdown', (event) => {
      if (!menu.classList.contains('is-open') || menu.contains(event.target) || toggle.contains(event.target)) return;
      setMenuState(false, { returnFocus: true });
    });
    const syncMenuToViewport = () => setMenuState(false);
    if (mobileMenuQuery.addEventListener) mobileMenuQuery.addEventListener('change', syncMenuToViewport);
    else mobileMenuQuery.addListener(syncMenuToViewport);
  }

  const setHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealNow = () => {
    revealItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < window.innerHeight * .96 && bounds.bottom > 0) item.classList.add('is-visible');
    });
  };
  revealNow();
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
  window.addEventListener('scroll', revealNow, { passive: true });
  window.setTimeout(revealNow, 80);

  const systemSteps = [...document.querySelectorAll('.system-flow li')];
  if ('IntersectionObserver' in window && systemSteps.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const systemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-current');
      });
    }, { threshold: .55, rootMargin: '-12% 0px -28% 0px' });
    systemSteps.forEach((step) => systemObserver.observe(step));
  }

  const indexLinks = [...document.querySelectorAll('[data-index] a')];
  const indexTargets = indexLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && indexTargets.length) {
    const indexObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        indexLinks.forEach((link) => link.parentElement.classList.toggle('is-active', link.getAttribute('href') === id));
      });
    }, { threshold: .42, rootMargin: '-20% 0px -45% 0px' });
    indexTargets.forEach((target) => indexObserver.observe(target));
  }

  document.querySelectorAll('[data-detail-toggle]').forEach((button) => {
    const panel = button.closest('.live-card')?.querySelector('[data-detail-panel]');
    if (!panel) return;
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      button.textContent = isExpanded ? 'Why this, now?' : 'Hide context';
      panel.hidden = isExpanded;
    });
  });

  document.querySelectorAll('[data-live-dismiss]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.live-card');
      const body = card?.querySelector('.live-card__blocks, .h-live-card__body');
      const detail = card?.querySelector('[data-detail-panel]');
      const status = card?.querySelector('[data-live-status]');
      if (!card || !body || !status) return;
      body.hidden = true;
      if (detail) detail.hidden = true;
      status.hidden = false;
      card.classList.add('is-dismissed');
      card.querySelector('[data-detail-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-live-restore]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.live-card');
      const body = card?.querySelector('.live-card__blocks, .h-live-card__body');
      const status = card?.querySelector('[data-live-status]');
      if (!card || !body || !status) return;
      body.hidden = false;
      status.hidden = true;
      card.classList.remove('is-dismissed');
      card.querySelector('[data-live-next]')?.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll('[data-live-next]').forEach((button) => {
    button.addEventListener('click', () => {
      button.textContent = button.textContent === 'Held' ? 'Next' : 'Held';
      button.classList.toggle('is-held');
    });
  });
})();
