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
