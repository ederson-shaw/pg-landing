const body = document.body;
const clockTime = document.querySelector('#clock-time');
const clockScene = document.querySelector('#clock-scene');
const clockProgress = document.querySelector('#clock-progress');
const clockAnnouncement = document.querySelector('#clock-announcement');
const clockMarkers = [...document.querySelectorAll('.clock-markers span')];
const sceneLinks = [...document.querySelectorAll('[data-scene-link]')];
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('#mobile-nav');
let currentScene = '';
const liveFields = {
  kicker: document.querySelector('[data-live-kicker]'),
  stage: document.querySelector('[data-live-stage]'),
  label: document.querySelector('[data-live-label]'),
  main: document.querySelector('[data-live-main]'),
  sub: document.querySelector('[data-live-sub]')
};

const liveStates = {
  opening: ['buyer blueprint', 'CHALLENGER', 'BUYER ARCHETYPE', 'CHALLENGER', 'before the call → know who you are about to talk to'],
  before: ['buyer blueprint', 'CHALLENGER', 'TRUST TRIGGERS™', 'what makes this buyer trust you', 'the rep walks in with a head start'],
  during: ['live co-pilot', 'VALUE', 'NEXT BEST MOVE', 'Buyer has no champion pushing this internally.', 'Judd Barakove / Buyer Readiness 25 / 100'],
  manager: ['live co-pilot', 'VALUE', 'NEXT BEST MOVE', 'Buyer has no champion pushing this internally.', 'one manager cannot sit on every call'],
  'manager-photo': ['live co-pilot', 'VALUE', 'SAY THIS', '“Before we get into the mechanics, Judd — who is actually pushing for a change?”', 'the rep is still in the room'],
  rep: ['live co-pilot', 'VALUE', 'SAY THIS', '“Before we get into the mechanics, Judd — who is actually pushing for a change?”', 'calibration answers stay private'],
  after: ['post-call analysis', '65%', 'MEDDPICC AFTER THE CALL', 'MEDDPICC 65%', 'acceptance High / the next call starts with evidence'],
  category: ['post-call analysis', '65%', 'NEXT CALL', 'MEDDPICC 65%', 'what the buyer showed, not what the rep hoped'],
  faq: ['post-call analysis', '65%', 'THE HUMAN PART', 'the rep stays in the conversation', 'human judgment, better timed'],
  close: ['post-call analysis', '65%', 'THE HUMAN PART', 'the rep stays in the conversation', 'human judgment, better timed']
};

const clockStates = {
  opening: { time: '00:00', label: 'opening', progress: 8, marker: 0 },
  before: { time: '00:08', label: 'blueprint', progress: 29, marker: 1 },
  during: { time: '00:18', label: 'live cue', progress: 53, marker: 2 },
  manager: { time: '00:28', label: 'manager view', progress: 68, marker: 2 },
  'manager-photo': { time: '00:34', label: 'human layer', progress: 76, marker: 2 },
  rep: { time: '00:39', label: 'rep calibration', progress: 83, marker: 2 },
  after: { time: '00:47', label: 'evidence', progress: 92, marker: 3 },
  category: { time: '00:52', label: 'what changes', progress: 96, marker: 3 },
  faq: { time: '00:56', label: 'plain answers', progress: 98, marker: 3 },
  close: { time: '01:00', label: 'close', progress: 100, marker: 3 }
};

function setScene(scene) {
  const next = clockStates[scene] || clockStates.opening;
  body.dataset.scene = scene;
  clockTime.textContent = next.time;
  clockScene.textContent = next.label;
  clockProgress.style.height = `${next.progress}%`;
  clockMarkers.forEach((marker, index) => marker.classList.toggle('active', index === next.marker));
  sceneLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.sceneLink === scene));
  const fields = liveStates[scene] || liveStates.opening;
  if (liveFields.kicker) {
    liveFields.kicker.textContent = fields[0];
    liveFields.stage.textContent = fields[1];
    liveFields.label.textContent = fields[2];
    liveFields.main.textContent = fields[3];
    liveFields.sub.textContent = fields[4];
  }
  if (clockAnnouncement && currentScene !== scene) clockAnnouncement.textContent = `Call scene: ${next.label}.`;
  currentScene = scene;
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) setScene(entry.target.dataset.scene);
  });
}, { rootMargin: '-40% 0px -48% 0px', threshold: 0 });

document.querySelectorAll('[data-scene]').forEach((element) => sceneObserver.observe(element));

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mobileNav.classList.toggle('is-open', !open);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
    menuButton?.click();
    menuButton?.focus();
  }
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    mobileNav.classList.remove('is-open');
  });
});

setScene('opening');
