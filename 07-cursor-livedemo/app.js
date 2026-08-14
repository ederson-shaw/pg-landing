document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const heroCue = document.querySelector('[data-hero-cue]');
const revealItems = document.querySelectorAll('.reveal, .reveal-copy');
const staggerLists = document.querySelectorAll('.stagger-list');
const transcriptLines = document.querySelectorAll('.js-transcript-line');
const callLog = document.querySelector('[data-call-log]');
const cue = document.querySelector('[data-cue]');
const nextButtons = document.querySelectorAll('[data-next]');
const dismissButtons = document.querySelectorAll('[data-dismiss]');
const foldButtons = document.querySelectorAll('[data-fold]');
const detailLinks = document.querySelectorAll('[data-detail-link]');

const fullTranscript = {
  buyer: 'buyer is still describing the screen display',
  rep: '“The display scales to fit the screen. What are you seeing on your screen?”',
  system: 'the exact sentence arrives before the call moves on'
};

const renderTranscriptLine = (line, text) => {
  const paragraph = line.querySelector('p');
  if (!paragraph) return;
  if (line.classList.contains('buyer')) {
    paragraph.innerHTML = 'buyer is still describing the <strong data-changed-word>screen display</strong>';
  } else if (line.classList.contains('system')) {
    paragraph.innerHTML = 'the exact sentence arrives <span class="amber-underline">before the call moves on</span>';
  } else {
    paragraph.textContent = text;
  }
};

const typeTranscriptLine = (line) => {
  const paragraph = line.querySelector('p');
  const key = line.classList.contains('buyer') ? 'buyer' : line.classList.contains('system') ? 'system' : 'rep';
  const text = fullTranscript[key];
  if (!paragraph || paragraph.dataset.typed) return;
  paragraph.dataset.typed = 'true';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    renderTranscriptLine(line, text);
    return;
  }
  paragraph.textContent = '';
  let index = 0;
  const write = () => {
    paragraph.textContent = text.slice(0, index);
    if (index < text.length) {
      index += 1;
      window.setTimeout(write, 18);
    } else {
      renderTranscriptLine(line, text);
      if (line.classList.contains('buyer')) line.querySelector('[data-changed-word]')?.classList.add('is-current');
    }
  };
  write();
};

// threshold 0.5 matches the reference's demo-component IntersectionObserver
// (ref/site/cursor.com marketing-static chunk 0w7...: interactive wrapper uses a 0.5
// visibility threshold before it starts/advances its in-view state).
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });

revealItems.forEach((item) => revealObserver.observe(item));
staggerLists.forEach((item) => revealObserver.observe(item));

if (mobileNav) mobileNav.inert = true;

if (heroCue && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setTimeout(() => {
    heroCue.textContent = 'buyer is still describing the screen display';
    heroCue.classList.add('is-live');
  }, 2200);
}

const lineObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    typeTranscriptLine(entry.target);
    callLog?.classList.add('is-reading');
    if (entry.target.classList.contains('buyer')) {
      if (cue) {
        cue.textContent = 'buyer is still describing the screen display';
        cue.classList.add('is-live');
      }
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });

transcriptLines.forEach((line) => lineObserver.observe(line));

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.textContent = isOpen ? 'menu' : 'close';
  mobileNav?.classList.toggle('is-open', !isOpen);
  if (mobileNav) mobileNav.inert = isOpen;
  if (isOpen) navToggle.focus();
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    if (navToggle) navToggle.textContent = 'menu';
    mobileNav.classList.remove('is-open');
    mobileNav.inert = true;
    navToggle?.focus();
  });
});

const toggleDetail = (button, detail) => {
  if (!detail) return;
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  detail.hidden = isOpen;
  button.textContent = isOpen ? '⌄' : '⌃';
};

foldButtons.forEach((button) => {
  const detail = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => toggleDetail(button, detail));
});

detailLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const card = link.closest('.live-card-v2');
    const button = card?.querySelector('[data-fold]');
    const detail = card?.querySelector('.live-card-detail');
    if (button && detail) toggleDetail(button, detail);
  });
});

nextButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.live-card-v2');
    button.textContent = 'Next ✓';
    button.setAttribute('aria-pressed', 'true');
    card?.classList.add('is-acknowledged');
    window.location.hash = card?.closest('.live-panel') ? 'after' : 'live-call';
  });
});

dismissButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.live-card-v2');
    if (card) card.hidden = true;
    button.textContent = 'Dismissed';
    button.setAttribute('aria-pressed', 'true');
  });
});
