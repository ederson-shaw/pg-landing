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

  const syncDetailState = (card, expanded) => {
    card.querySelectorAll('[data-detail-toggle]').forEach((control) => {
      control.setAttribute('aria-expanded', String(expanded));
      control.setAttribute('aria-label', expanded ? 'Hide HumanCue context' : 'Show HumanCue context');
      if (control.classList.contains('live-card__why')) control.textContent = expanded ? 'Hide context' : 'Why this, now?';
    });
    const panel = card.querySelector('[data-detail-panel]');
    if (panel) panel.hidden = !expanded;
  };

  document.querySelectorAll('[data-detail-toggle]').forEach((button) => {
    const card = button.closest('.live-card');
    const panel = card?.querySelector('[data-detail-panel]');
    if (!panel || !card) return;
    button.addEventListener('click', () => syncDetailState(card, panel.hidden));
  });

  document.querySelectorAll('.live-card').forEach((card) => {
    const next = card.querySelector('[data-cue-next]');
    const dismiss = card.querySelector('[data-cue-dismiss]');
    const reset = card.querySelector('[data-cue-reset]');
    const blocks = card.querySelector('[data-cue-current]');
    const status = card.querySelector('[data-cue-status]');
    const detail = card.querySelector('[data-detail-panel]');
    const state = card.querySelector('.live-card__state');
    if (!next || !dismiss || !reset || !blocks || !status) return;

    next.addEventListener('click', () => {
      if (card.dataset.cueState === 'dismissed') return;
      card.dataset.cueState = 'advanced';
      if (state) state.textContent = 'Ready';
      card.setAttribute('aria-label', 'HumanCue example decision support, ready for the next buyer signal');
      next.textContent = 'Next ✓';
    });

    dismiss.addEventListener('click', () => {
      card.dataset.cueState = 'dismissed';
      card.classList.add('is-dismissed');
      blocks.hidden = true;
      if (detail) syncDetailState(card, false);
      status.hidden = false;
      if (state) state.textContent = 'Quiet';
      next.textContent = 'Next';
      card.setAttribute('aria-label', 'HumanCue is quiet while evidence is insufficient');
      reset.focus({ preventScroll: true });
    });

    reset.addEventListener('click', () => {
      card.dataset.cueState = 'active';
      card.classList.remove('is-dismissed');
      blocks.hidden = false;
      status.hidden = true;
      syncDetailState(card, false);
      if (state) state.textContent = 'Listening';
      card.setAttribute('aria-label', 'HumanCue example decision support');
      next.textContent = 'Next';
    });
  });


  // Desktop HumanCue placement is interactive: the seller can move the live
  // surface away from a face or any other important call detail.
  const dragMedia = window.matchMedia('(min-width:1121px)');
  const clampDragOffset = (target, container, x, y) => {
    if (!dragMedia.matches) return;
    const rect = target.getBoundingClientRect();
    const bounds = container.getBoundingClientRect();
    const maxX = Math.max(0, bounds.width - rect.width);
    const maxY = Math.max(0, bounds.height - rect.height);
    const nextX = Math.max(0, Math.min(maxX, x));
    const nextY = Math.max(0, Math.min(maxY, y));
    target.style.transform = 'translate3d(' + nextX + 'px, ' + nextY + 'px, 0)';
    target.dataset.pgDragX = String(nextX);
    target.dataset.pgDragY = String(nextY);
  };

  document.querySelectorAll('[data-drag-handle]').forEach((handle) => {
    const card = handle.closest('.live-card');
    const target = card?.closest('.h-cue-readout') || card;
    const container = target?.closest('.h-live-stage, .call-stage');
    if (!target || !container) return;
    handle.title = 'Drag to reposition HumanCue';
    const readOffset = (key) => Number(target.dataset[key] || 0);
    const moveBy = (dx, dy) => clampDragOffset(target, container, readOffset('pgDragX') + dx, readOffset('pgDragY') + dy);

    let pointerStart = null;
    handle.addEventListener('pointerdown', (event) => {
      if (!dragMedia.matches || event.button !== 0 || event.target.closest('button, a')) return;
      pointerStart = { x: event.clientX, y: event.clientY, offsetX: readOffset('pgDragX'), offsetY: readOffset('pgDragY') };
      target.classList.add('pg-hc-dragging');
      card?.setAttribute('aria-grabbed', 'true');
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener('pointermove', (event) => {
      if (!pointerStart) return;
      clampDragOffset(target, container, pointerStart.offsetX + event.clientX - pointerStart.x, pointerStart.offsetY + event.clientY - pointerStart.y);
      event.preventDefault();
    });
    const stopDrag = (event) => {
      if (!pointerStart) return;
      handle.releasePointerCapture?.(event.pointerId);
      pointerStart = null;
      target.classList.remove('pg-hc-dragging');
      card?.setAttribute('aria-grabbed', 'false');
    };
    handle.addEventListener('pointerup', stopDrag);
    handle.addEventListener('pointercancel', stopDrag);
    handle.addEventListener('keydown', (event) => {
      if (!dragMedia.matches) return;
      const step = event.shiftKey ? 48 : 16;
      const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      const move = moves[event.key];
      if (!move) return;
      moveBy(move[0], move[1]);
      event.preventDefault();
    });
  });
})();
