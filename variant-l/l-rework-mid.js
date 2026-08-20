/* Mid-page product surfaces. Loaded after app.js and l-enhancements.js.
   It does not replace their handlers: it only adds state classes after their
   accessible Dismiss / End / reset behavior has completed. */
(() => {
  const makeTransitionProof = () => {
    const section = document.querySelector('#cue-transition');
    if (!section || section.querySelector('.mid-transition-proof')) return;
    const proof = document.createElement('aside');
    proof.className = 'mid-transition-proof';
    proof.setAttribute('aria-label', 'Live HumanCue evidence');
    proof.innerHTML = '<span class="mid-transition-proof__live" aria-hidden="true"></span><div class="mid-transition-proof__copy"><small>LIVE SIGNAL</small><b>Buyer returned to rollout risk.</b><span>HumanCue checks whether the moment is actionable before it speaks.</span></div>';
    section.append(proof);
  };

  const makeManagerScreen = () => {
    const section = document.querySelector('#alignment');
    if (!section || section.querySelector('.mid-manager-screen')) return;
    const screen = document.createElement('section');
    screen.className = 'mid-manager-screen';
    screen.setAttribute('aria-label', 'Stage and buyer evidence manager view');
    screen.innerHTML = `
      <header class="mid-manager-head"><strong>Northstar / stage 04</strong><span>MANAGER VIEW</span></header>
      <div class="mid-manager-summary">
        <div class="mid-manager-status"><div class="mid-manager-side"><small>CRM ACTIVITY</small><b>Stage 04 · proposal delivered</b><p>Follow-up scheduled. Forecast remains positive.</p></div><div class="mid-manager-side mid-manager-side--buyer"><small>BUYER EVIDENCE</small><b>Watch <span>·</span> not confirmed</b><p>Buyer-backed movement is incomplete.</p></div></div>
        <div class="mid-manager-action"><small>NEXT MANAGER QUESTION</small><b>Who owns the decision path?</b><p>Validate ownership before the opportunity advances.</p></div>
      </div>
      <div class="mid-manager-grid">
        <div class="mid-stakeholders"><small>STAKEHOLDERS</small><div class="mid-stakeholder"><div><b>Russell Pontone</b><span> · operational sponsor</span></div><span class="mid-tag">ENGAGED</span></div><div class="mid-stakeholder"><div><b>Economic buyer</b><span> · not confirmed</span></div><span class="mid-tag mid-tag--watch">UNKNOWN</span></div><div class="mid-stakeholder"><div><b>Implementation lead</b><span> · risk returned</span></div><span class="mid-tag mid-tag--watch">WATCH</span></div></div>
        <div class="mid-evidence"><small>RECENT BUYER EVIDENCE</small><ul><li>Proposal delivered; decision process is still unclear.</li><li>Implementation risk remains unresolved.</li><li>No buyer-owned next step is recorded.</li></ul></div>
      </div>`;
    section.insertBefore(screen, section.querySelector('.alignment-bottom'));
  };

  const cueState = () => {
    const card = document.querySelector('[data-hc-card]');
    const dismiss = document.querySelector('[data-cue-dismiss]');
    const end = document.querySelector('[data-cue-end]');
    const reset = document.querySelector('[data-cue-reset]');
    if (!card) return;
    dismiss?.addEventListener('click', () => window.setTimeout(() => card.classList.add('is-quiet'), 0));
    end?.addEventListener('click', () => window.setTimeout(() => { card.classList.add('is-quiet'); card.classList.add('is-ended'); }, 0));
    reset?.addEventListener('click', () => { card.classList.remove('is-quiet', 'is-ended'); });
  };

  makeTransitionProof();
  makeManagerScreen();
  cueState();
})();
