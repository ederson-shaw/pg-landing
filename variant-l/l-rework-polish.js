/* Final interaction layer: one honest, accessible Learn more disclosure per
   chapter and a compact HTML readiness surface. It intentionally does not
   resurrect the removed duplicate boards. */
(() => {
  const descriptions = {
    hero: 'The buyer-evidence layer sits beside the CRM record so a seller can see what changed before, during, and after the call.',
    top: 'The buyer-evidence layer sits beside the CRM record so a seller can see what changed before, during, and after the call.',
    problem: 'The comparison separates logged activity from the buyer evidence a manager still needs to validate.',
    evidence: 'The sequence preserves observable conversational changes so the team can review what shifted instead of relying on memory.',
    system: 'The same buyer context moves from preparation to live guidance, readiness, alignment, and coaching without becoming six disconnected reports.',
    precall: 'The brief groups direct evidence, supported hypotheses, and unknowns into questions the seller can test in the next conversation.',
    blueprint: 'The Blueprint is a working point of view: a buyer-specific objective, risk hypothesis, question path, and next validation.',
    transition: 'HumanCue checks whether a moment is meaningful and actionable before interrupting the seller.',
    humancue: 'The live surface gives the seller one grounded move, optional language, and the evidence behind the intervention.',
    belief: 'PitchGenius supports the decision in front of the seller while keeping judgment and the relationship human.',
    readiness: 'Readiness distinguishes polite activity from buyer-owned movement across trust, confidence, urgency, safety, risk, and willingness.',
    alignment: 'The manager view keeps CRM activity and buyer evidence in one frame so stage can be interpreted instead of worshipped.',
    leadership: 'The workbench lets a leader open the conversations where buyer evidence needs attention across the team.',
    coaching: 'The coaching workspace connects a repeated behavior to the reps and call evidence that make the next coaching conversation specific.',
    development: 'The directional progression shows support receding as the seller builds judgment; it is not a performance score.',
    loop: 'The loop preserves what was observed, tested, and still unknown as context moves into the next call.',
    close: 'A pilot shows the buyer-evidence layer in the team’s real pre-call, live-call, and manager workflows.'
  };

  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  document.querySelectorAll('main > section[data-section]').forEach((section) => {
    if (section.querySelector(':scope > .polish-learn')) return;
    const key = section.dataset.section || section.id;
    const text = descriptions[key];
    if (!text) return;
    const details = document.createElement('details');
    details.className = 'polish-learn';
    details.innerHTML = `<summary>Learn more <span aria-hidden="true">›</span></summary><div class="polish-learn__body"><p>${esc(text)}</p><small>DIRECT PRODUCT DESCRIPTION</small></div>`;
    section.append(details);
  });

  /* The Hero proof belongs to the photograph. Keeping it as a sibling makes
     the first fold read like two unrelated columns and lets the board fall
     below a tall portrait at wide viewports. Nesting the existing HTML board
     in the figure gives it a real anchor without changing any message. */
  const heroPhoto = document.querySelector('#top .hero-photo');
  const heroBand = document.querySelector('#top > .l-feature-band--hero');
  if (heroPhoto && heroBand && !heroBand.dataset.heroAnchored) {
    heroBand.dataset.heroAnchored = 'true';
    heroBand.classList.add('polish-hero-band');
    heroPhoto.append(heroBand);
  }

  /* Rebuild the Hero proof as one compact, app-shaped surface. The original
     enhancement was a marketing card with two equal boxes; this version keeps
     the same words but gives them the hierarchy of the live product: chrome,
     call context, a live trace, then the CRM → buyer evidence relationship. */
  const heroBoard = document.querySelector('#top .l-board--hero');
  if (heroBoard && !heroBoard.dataset.appSurface) {
    heroBoard.dataset.appSurface = 'true';
    heroBoard.setAttribute('aria-label', 'HumanCue live buyer-evidence preview');
    heroBoard.innerHTML = `
      <div class="hero-app-chrome">
        <span class="hero-app-close" aria-hidden="true"><i></i></span>
        <strong>HumanCue™</strong>
        <span class="hero-app-live">LIVE</span>
      </div>
      <div class="hero-app-signal">
        <article><small>CRM ACTIVITY</small><strong>Proposal sent</strong></article>
        <span class="hero-app-plus" aria-hidden="true">→</span>
        <article class="is-buyer"><small>BUYER EVIDENCE</small><strong>Implementation risk returned</strong></article>
      </div>
      <div class="hero-app-footer"><span>before / during / after the call</span><b aria-hidden="true"></b></div>`;
  }

  /* On a wide Hero the disclosure belongs to the thesis column, directly
     after its supporting line. Leaving it after the full two-column grid
     creates an avoidable band of empty space under the copy. Keep it in the
     section flow at tablet/mobile widths so the image remains the next visual
     beat, and move it back on resize without duplicating the control. */
  const heroSection = document.querySelector('#top');
  const heroCopy = heroSection?.querySelector('.hero-copy');
  const heroLayout = heroSection?.querySelector('.hero-layout');
  const heroLearn = heroSection?.querySelector(':scope > .polish-learn');
  if (heroSection && heroCopy && heroLayout && heroLearn && heroBand) {
    const syncHeroPlacement = () => {
      const width = window.innerWidth;
      const wide = width >= 1101;
      const tablet = width >= 721 && width <= 1100;
      if (tablet) {
        if (heroBand.parentElement !== heroLayout) heroLayout.append(heroBand);
        if (heroLearn.parentElement !== heroLayout) heroLayout.append(heroLearn);
        heroBand.classList.add('hero-band-grid');
        heroLearn.classList.add('hero-learn-grid');
        delete heroLearn.dataset.inlineHero;
        return;
      }
      if (heroBand.parentElement !== heroPhoto) heroPhoto.append(heroBand);
      heroBand.classList.remove('hero-band-grid');
      heroLearn.classList.remove('hero-learn-grid');
      if (wide && heroLearn.parentElement !== heroCopy) {
        heroCopy.append(heroLearn);
        heroLearn.dataset.inlineHero = 'true';
      } else if (!wide && heroLearn.parentElement !== heroSection) {
        heroSection.append(heroLearn);
        delete heroLearn.dataset.inlineHero;
      }
    };
    syncHeroPlacement();
    window.addEventListener('resize', syncHeroPlacement, { passive: true });
  }

  const readinessFigure = document.querySelector('#readiness .readiness-top figure');
  if (readinessFigure) {
    readinessFigure.classList.add('polish-readiness-figure');
    readinessFigure.setAttribute('aria-label', 'Buyer Readiness product view');
    readinessFigure.innerHTML = `
      <div class="polish-readiness-head"><span>BUYER READINESS / NORTHSTAR</span><b>WATCH</b></div>
      <div class="polish-readiness-main">
        <article><small>RECENT SHIFT</small><strong>Buyer opened a decision process</strong><span>Trust ↑ · willingness ↑</span></article>
        <article><small>OPEN GAP</small><strong>Economic owner is not involved</strong><span>Perceived risk remains open.</span></article>
        <article class="is-next"><small>NEXT ACTION</small><strong>Invite the decision owner</strong><span>Validate before advancing the stage.</span></article>
      </div>
      <div class="polish-readiness-foot"><span>CALL 08:42</span><span>Evidence, not a score</span></div>`;
  }
})();
