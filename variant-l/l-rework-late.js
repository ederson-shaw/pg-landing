/* Late chapters are intentionally rebuilt as a small set of working surfaces.
   This runs after l-enhancements.js: the original marketing copy stays in the
   document, while the repeated appended L boards are removed from the reading
   path. */
(() => {
  const byId = (id) => document.getElementById(id);
  const hideProof = (section) => section?.querySelector(':scope > .l-feature-band')?.remove();

  const reps = [
    ['Mia Chen', 'Acme Health', 'WATCH', 'Implementation question returned'],
    ['Russell Pontone', 'Northstar', 'ALIGNED', 'Buyer-owned next step logged'],
    ['Priya Shah', 'Loomline', 'DIVERGED', 'Economic buyer still unknown'],
    ['Andre Silva', 'Helio Systems', 'IN REVIEW', 'Champion language needs context'],
    ['Sofia Martins', 'Meridian', 'NEW SIGNAL', 'Risk language detected in call'],
    ['Jon Bell', 'Rivet Labs', 'READY TO COACH', 'Pattern queued for manager review']
  ];

  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const repRows = (modifier = '') => reps.map(([name, account, state, evidence]) => `
    <li class="late-rep-row ${modifier}">
      <span class="late-rep-name"><b>${esc(name)}</b><small>${esc(account)}</small></span>
      <span class="late-rep-state late-rep-state--${state.toLowerCase().replace(/[^a-z]+/g, '-')}">${esc(state)}</span>
      <span class="late-rep-evidence">${esc(evidence)}</span>
    </li>`).join('');

  const leadership = byId('leadership');
  const coaching = byId('coaching');
  const development = byId('development');
  const loop = byId('loop');
  const close = byId('close');
  [leadership, coaching, development, loop, close].forEach(hideProof);

  if (leadership && !leadership.querySelector('.late-leadership-workbench')) {
    const copy = leadership.querySelector('.split-copy');
    const states = leadership.querySelector('.leadership-states');
    const photo = leadership.querySelector('.split-photo');
    const workbench = document.createElement('section');
    workbench.className = 'late-leadership-workbench';
    workbench.setAttribute('aria-label', 'Manager workbench');
    workbench.innerHTML = `
      <header><span>MANAGER WORKBENCH</span><p>Open the conversations where the buyer evidence needs attention.</p></header>
      <div class="late-leadership-main">
        <div class="late-rep-queue"><div class="late-queue-head"><span>REP / ACCOUNT</span><span>BUYER STATE</span><span>EVIDENCE TO OPEN</span></div><ol>${repRows()}</ol></div>
        <aside class="late-state-key"><span>HOW TO READ THE QUEUE</span></aside>
      </div>`;
    if (states) workbench.querySelector('.late-state-key').append(states);
    if (copy) copy.after(workbench);
    photo?.remove();
  }

  if (coaching && !coaching.querySelector('.late-coach-workbench')) {
    const grid = coaching.querySelector('.coaching-grid');
    const patterns = coaching.querySelector('.patterns');
    const workbench = document.createElement('section');
    workbench.className = 'late-coach-workbench';
    workbench.setAttribute('aria-label', 'Manager coaching workspace');
    workbench.innerHTML = `
      <header><div><span>COACHING WORKSPACE</span><b>Explaining instead of exploring</b></div><p>One repeated behavior, reviewed with the team context around it.</p></header>
      <div class="late-coach-roster"><div class="late-queue-head"><span>REP / ACCOUNT</span><span>COACHING STATE</span><span>REVIEW CONTEXT</span></div><ol>${repRows('late-coach-row')}</ol></div>
      <div class="late-coach-detail"><span>THE REVIEW</span></div>`;
    const detail = workbench.querySelector('.late-coach-detail');
    if (grid) detail.append(grid);
    if (patterns) detail.append(patterns);
    coaching.querySelector('.coaching-intro')?.after(workbench);
  }

  if (development && !development.querySelector('.late-development-surface')) {
    const card = development.querySelector('.development-card');
    const benefits = development.querySelector('.development-benefits');
    const surface = document.createElement('section');
    surface.className = 'late-development-surface';
    surface.setAttribute('aria-label', 'Rep development progression');
    if (card) surface.append(card);
    if (benefits) surface.append(benefits);
    development.querySelector('.development-cycle')?.after(surface);
  }

  if (loop && !loop.querySelector('.late-loop-surface')) {
    const orbit = loop.querySelector('.loop-orbit');
    const notes = loop.querySelector('.loop-notes');
    const bottom = loop.querySelector('.loop-bottom');
    const surface = document.createElement('section');
    surface.className = 'late-loop-surface';
    surface.setAttribute('aria-label', 'Evidence handoff loop');
    if (orbit) surface.append(orbit);
    const aside = document.createElement('aside');
    aside.className = 'late-loop-notes';
    aside.innerHTML = '<span>WHAT EACH HANDOFF PRESERVES</span>';
    if (notes) aside.append(notes);
    surface.append(aside);
    if (bottom) surface.append(bottom);
    loop.querySelector('.loop-heading')?.after(surface);
  }

  if (close) close.classList.add('late-close');
  document.body.classList.add('late-rework-ready');
})();
