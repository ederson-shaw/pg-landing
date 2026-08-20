/* L product-proof layer.
 *
 * The page keeps K's narrative and copy, then adds one useful interaction to
 * every chapter: a compact Learn more disclosure with a direct explanation
 * and a real HTML/CSS product surface. Nothing here is a screenshot or a
 * fabricated performance metric; the rows describe states a seller or manager
 * can actually inspect.
 */
(() => {
  const reps = [
    ['Mia Chen', 'Acme Health', 'WATCH', 'Implementation question returned'],
    ['Russell Pontone', 'Northstar', 'ALIGNED', 'Buyer-owned next step logged'],
    ['Priya Shah', 'Loomline', 'DIVERGED', 'Economic buyer still unknown'],
    ['Andre Silva', 'Helio Systems', 'IN REVIEW', 'Champion language needs context'],
    ['Sofia Martins', 'Meridian', 'NEW SIGNAL', 'Risk language detected in call'],
    ['Jon Bell', 'Rivet Labs', 'READY TO COACH', 'Pattern queued for manager review']
  ];

  const data = {
    top: {
      eyebrow: 'BUYER LAYER',
      title: 'Make the invisible part of the deal inspectable.',
      copy: 'PitchGenius adds a buyer-evidence layer around the CRM: prepare with context, notice meaningful change, and decide what to do while the conversation is still live.',
      kind: 'hero',
      detail: 'The system keeps the CRM as the system of record, then adds the buyer movement the CRM cannot capture on its own.'
    },
    problem: {
      eyebrow: 'FUNCTIONAL VIEW',
      title: 'Compare logged activity with the buyer state underneath it.',
      copy: 'The blind-spot view places familiar CRM events beside unresolved buyer evidence so a manager can choose what to validate next.',
      kind: 'compare',
      detail: 'This view does not overwrite the opportunity. It makes the missing buyer evidence explicit before confidence hardens into a forecast.'
    },
    evidence: {
      eyebrow: 'CONVERSATION EVIDENCE',
      title: 'Turn small conversational changes into a reviewable trail.',
      copy: 'Each moment is preserved as an evidence cue: what shifted, where it happened, and why it deserves a closer look.',
      kind: 'moments',
      detail: 'The evidence trail keeps the team anchored to observable language and behavior instead of post-call impressions.'
    },
    system: {
      eyebrow: 'ONE CONNECTED FLOW',
      title: 'Move one buyer context through six working surfaces.',
      copy: 'The platform hands the same context from preparation to live guidance, readiness, alignment, and manager coaching.',
      kind: 'rail',
      detail: 'Every surface answers a different decision question; together they form one buyer-intelligence layer around the conversation.'
    },
    precall: {
      eyebrow: 'PRE-CALL WORKSPACE',
      title: 'Open the call with a brief you can challenge.',
      copy: 'The brief separates direct evidence, supported hypotheses, and important unknowns so the rep knows what to test—not just what to repeat.',
      kind: 'brief',
      detail: 'Sources are grouped by confidence, then turned into questions the seller can validate in the next conversation.'
    },
    blueprint: {
      eyebrow: 'CONVERSATION PLAN',
      title: 'Turn context into a buyer-specific point of view.',
      copy: 'The Blueprint gives the rep a working objective, risk hypothesis, trust trigger, and question path for this buyer—not a generic script.',
      kind: 'blueprint',
      detail: 'The plan stays deliberately provisional: observe the buyer, validate the hypothesis, and adjust the approach.'
    },
    'cue-transition': {
      eyebrow: 'LIVE MOMENT',
      title: 'The cue appears only when a decision is available.',
      copy: 'HumanCue watches for meaningful change and protects the seller from another wall of live AI commentary.',
      kind: 'moment',
      detail: 'The intervention is intentionally sparse: one useful decision, one optional sentence, and the evidence behind it.'
    },
    humancue: {
      eyebrow: 'LIVE DECISION SUPPORT',
      title: 'Give the rep one grounded move—not ten more facts.',
      copy: 'HumanCue keeps the call visible, names the buyer signal, and offers a next best move the seller can accept, adapt, or ignore.',
      kind: 'cue',
      detail: 'The card is a live decision surface: signal → context → evidence → meaning → actionability. If the gates are not met, the cue stays quiet.'
    },
    belief: {
      eyebrow: 'HUMAN-FIRST CONTROL',
      title: 'The seller keeps the judgment.',
      copy: 'PitchGenius supports a stronger call without turning the seller into a passenger or replacing the human relationship.',
      kind: 'belief',
      detail: 'The product is designed to improve the decision in front of the rep, not to automate the relationship away.'
    },
    readiness: {
      eyebrow: 'EVIDENCE OVER ACTIVITY',
      title: 'See what changed because of the conversation.',
      copy: 'Readiness records movement across trust, confidence, urgency, emotional safety, perceived risk, and willingness to move.',
      kind: 'readiness',
      detail: 'The index is a structured evidence view, not a promise of precision: it distinguishes a polite response from a buyer-owned action.'
    },
    alignment: {
      eyebrow: 'REALITY CHECK',
      title: 'Put CRM stage and buyer evidence in the same frame.',
      copy: 'A manager can scan the activity story and the buyer story side by side before deciding whether a deal deserves confidence.',
      kind: 'alignment',
      detail: 'Stage stays useful for process. Buyer evidence adds the missing decision context needed to interpret that stage.'
    },
    leadership: {
      eyebrow: 'MANAGER WORKBENCH',
      title: 'Give leaders a queue of conversations worth opening.',
      copy: 'The manager view brings multiple reps, accounts, and buyer states into one calm evidence queue—without reducing a person to a score.',
      kind: 'reps',
      detail: 'Each row links a rep to the evidence that needs attention, making coaching capacity easier to focus and discuss.'
    },
    coaching: {
      eyebrow: 'COACHING WORKSPACE',
      title: 'Coach the repeated miss across the team.',
      copy: 'The report groups call evidence into a manager agenda and keeps several reps visible so a single review is not mistaken for the whole pattern.',
      kind: 'coaching',
      detail: 'Managers can move from a specific call to a recurring behavior, then choose the next coaching conversation with evidence in hand.'
    },
    development: {
      eyebrow: 'REP DEVELOPMENT',
      title: 'Watch prompts give way to seller judgment.',
      copy: 'The development view shows the intended direction: more guidance early, fewer interventions as the rep builds their own call decisions.',
      kind: 'development',
      detail: 'The trace is directional, not a performance score. It describes the product’s coaching aim: support, practice, reinforcement, ownership.'
    },
    loop: {
      eyebrow: 'EVIDENCE HANDOFF',
      title: 'Carry validated context into the next call.',
      copy: 'Preparation, live evidence, readiness, alignment, and coaching feed one evolving buyer context instead of six disconnected reports.',
      kind: 'loop',
      detail: 'The loop gets stronger when each handoff preserves what was observed, what was tested, and what still needs to be learned.'
    },
    close: {
      eyebrow: 'READY FOR A REAL CALL',
      title: 'See the layer in the work your team already does.',
      copy: 'Start with one pipeline, one manager, and the conversations where buyer movement matters most.',
      kind: 'close',
      detail: 'A pilot shows the product in context: pre-call preparation, a live HumanCue moment, and a manager view after the call.'
    }
  };

  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const repRows = (withCoaching = false) => reps.map(([name, account, state, note], index) => `
    <div class="l-rep-row" style="--row:${index}">
      <span class="l-avatar" aria-hidden="true">${esc(name.split(' ').map((part) => part[0]).join(''))}</span>
      <span class="l-rep-name"><b>${esc(name)}</b><small>${esc(account)}</small></span>
      <span class="l-rep-state l-state--${state.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}">${esc(state)}</span>
      <span class="l-rep-note">${esc(withCoaching && index % 2 ? 'Pattern: ' : '')}${esc(note)}</span>
    </div>`).join('');

  const board = (kind) => {
    switch (kind) {
      case 'hero':
        return `<div class="l-board l-board--hero"><div class="l-board-head"><span>BUYER INTELLIGENCE LAYER</span><i>LIVE</i></div><div class="l-hero-signal"><div><small>CRM ACTIVITY</small><b>Proposal sent</b></div><em>+</em><div class="l-hero-signal--buyer"><small>BUYER EVIDENCE</small><b>Implementation risk returned</b></div></div><div class="l-board-foot"><span>before / during / after the call</span><span class="l-live-dot">●</span></div></div>`;
      case 'compare':
        return `<div class="l-board l-board--compare"><div class="l-board-head"><span>OPPORTUNITY / NORTHSTAR</span><i>STAGE 04</i></div><div class="l-compare-grid"><div><small>CRM RECORD</small><b>Proposal delivered</b><span>Follow-up scheduled</span><span>Forecast positive</span></div><div class="l-compare-divider" aria-hidden="true">↔</div><div class="l-compare-risk"><small>BUYER EVIDENCE</small><b>Risk still unresolved</b><span>Economic buyer unknown</span><span>No owned next step</span></div></div><div class="l-board-foot"><span>last evidence · 08:42</span><span class="l-chip l-chip--amber">REVIEW</span></div></div>`;
      case 'moments':
        return `<div class="l-board l-board--moments"><div class="l-board-head"><span>CONVERSATION TRACE / CALL 08:42</span><i>5 MOMENTS</i></div><div class="l-trace"><span style="--at:12%"><b>01</b>certainty softens</span><span style="--at:31%"><b>02</b>polite agreement</span><span class="l-trace--risk" style="--at:57%"><b>03</b>risk returns</span><span style="--at:76%"><b>04</b>next step fades</span><span class="l-trace--risk" style="--at:91%"><b>05</b>late visibility</span></div><div class="l-board-foot"><span>signal strength follows context</span><span class="l-chip">EVIDENCE</span></div></div>`;
      case 'rail':
        return `<div class="l-board l-board--rail"><div class="l-board-head"><span>BUYER CONTEXT</span><i>ONE FLOW</i></div><div class="l-product-rail"><span class="is-live"><b>01</b>Understand<small>Known context</small></span><span><b>02</b>Prepare<small>Buyer plan</small></span><span><b>03</b>Perceive<small>Live cue</small></span><span><b>04</b>Measure<small>Readiness</small></span><span><b>05</b>See reality<small>Stage gap</small></span><span><b>06</b>Improve<small>Coach pattern</small></span></div><div class="l-board-foot"><span>one buyer · six decisions</span><span class="l-live-dot">↗</span></div></div>`;
      case 'brief':
        return `<div class="l-board l-board--brief"><div class="l-board-head"><span>PRE-CALL BRIEF / RUSSELL P.</span><i>DISCOVERY</i></div><div class="l-brief-grid"><article><small>KNOWN</small><b>Previous rollout concern</b><span>Direct call evidence</span></article><article><small>LIKELY</small><b>Needs internal proof</b><span>Context-supported hypothesis</span></article><article><small>UNKNOWN</small><b>Who owns approval?</b><span>Question to validate live</span></article></div><div class="l-board-foot"><span>sources · linked context</span><span class="l-chip">OPEN BRIEF</span></div></div>`;
      case 'blueprint':
        return `<div class="l-board l-board--blueprint"><div class="l-board-head"><span>BUYER'S BLUEPRINT / NORTHSTAR</span><i>WORKING HYPOTHESIS</i></div><div class="l-blueprint-grid"><div><small>OBJECTIVE</small><b>Make rollout risk discussable</b></div><div><small>TRUST TRIGGER</small><b>Proof from a similar team</b></div><div><small>QUESTION PATH</small><b>Who must believe this?</b></div><div class="l-blueprint-accent"><small>RISK TO TEST</small><b>Internal bandwidth</b></div></div><div class="l-board-foot"><span>prepare → observe → validate</span><span class="l-chip l-chip--amber">NOT FINAL</span></div></div>`;
      case 'moment':
        return `<div class="l-board l-board--moment"><div class="l-mini-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div><small>LIVE DETECTION</small><b>Something changed.</b><span>HumanCue checks whether the change is actionable before it speaks.</span></div><span class="l-live-dot">●</span></div>`;
      case 'cue':
        return `<div class="l-board l-board--cue"><div class="l-board-head"><span>HUMANCUE / LIVE CALL</span><i>45 · DISCOVERY</i></div><div class="l-cue-context"><span class="l-live-dot">●</span><b>Buyer returned to rollout risk</b><small>signal · context · evidence · actionability</small></div><div class="l-cue-actions"><article><small>NEXT BEST MOVE</small><b>Clarify the specific obstacle</b></article><article><small>SAY THIS</small><b>“What makes it difficult to move?”</b></article><article><small>WHY THIS NOW?</small><b>Risk appeared after value was agreed</b></article></div><div class="l-board-foot"><span>the seller decides</span><span class="l-chip">QUIET WHEN UNCERTAIN</span></div></div>`;
      case 'belief':
        return `<div class="l-board l-board--belief"><span class="l-belief-mark">PG</span><div><small>CONTROL REMAINS WITH THE SELLER</small><b>Evidence in. Judgment stays human.</b><span>HumanCue can be dismissed, adapted, or used as a prompt to ask a better question.</span></div></div>`;
      case 'readiness':
        return `<div class="l-board l-board--readiness"><div class="l-board-head"><span>READINESS EVIDENCE / NORTHSTAR</span><i>NOT A SCORECARD</i></div><div class="l-readiness-row"><span>WEAK SIGNAL</span><b>“Send me a proposal.”</b><em>→</em><span class="l-readiness-strong">STRONGER EVIDENCE</span><b>Buyer schedules the decision process.</b></div><div class="l-readiness-row"><span>WEAK SIGNAL</span><b>“I’ll speak with my team.”</b><em>→</em><span class="l-readiness-strong">STRONGER EVIDENCE</span><b>Buyer invites the seller into that conversation.</b></div><div class="l-board-foot"><span>trust · confidence · urgency · safety · risk · willingness</span><span class="l-chip l-chip--cyan">SHIFT</span></div></div>`;
      case 'alignment':
        return `<div class="l-board l-board--alignment"><div class="l-board-head"><span>STAGE / READINESS CHECK</span><i>STAGE 04</i></div><div class="l-alignment-grid"><article><small>CRM SAYS</small><b>Late-stage activity</b><span>Demo · proposal · follow-up</span><span>Forecast positive</span></article><article class="l-alignment-arrow">↔</article><article class="l-alignment-warning"><small>BUYER EVIDENCE SAYS</small><b>Decision path is unclear</b><span>Authority not confirmed</span><span>Risk still open</span></article></div><div class="l-board-foot"><span>interpret the stage, don't worship it</span><span class="l-chip l-chip--amber">VALIDATE</span></div></div>`;
      case 'reps':
        return `<div class="l-board l-board--reps"><div class="l-board-head"><span>MANAGER WORKBENCH / 06 REPS</span><i>BUYER EVIDENCE</i></div><div class="l-rep-list">${repRows()}</div><div class="l-board-foot"><span>invite the right conversation</span><span class="l-chip">OPEN QUEUE</span></div></div>`;
      case 'coaching':
        return `<div class="l-board l-board--coaching"><div class="l-board-head"><span>COACHING QUEUE / THIS WEEK</span><i>06 REPS</i></div><div class="l-coaching-summary"><div><small>REPEATED PATTERN</small><b>Explaining instead of exploring</b></div><div><small>COACH NEXT</small><b>Priya Shah · Loomline</b></div></div><div class="l-rep-list">${repRows(true)}</div><div class="l-board-foot"><span>evidence → pattern → agenda</span><span class="l-chip l-chip--amber">COACH</span></div></div>`;
      case 'development':
        return `<div class="l-board l-board--development"><div class="l-board-head"><span>REP DEVELOPMENT / RUSSELL P.</span><i>DIRECTIONAL TRACE</i></div><div class="l-development-track"><article><small>EARLY CALLS</small><b>Support</b><div class="l-prompt-meter"><i></i><i></i><i></i><i></i><i></i></div><span>more guidance</span></article><article><small>PRACTICE</small><b>Reinforce</b><div class="l-prompt-meter"><i></i><i></i><i></i></div><span>fewer prompts</span></article><article><small>OWNERSHIP</small><b>Judgment</b><div class="l-prompt-meter"><i></i></div><span>rep leads the call</span></article></div><div class="l-board-foot"><span>support should recede as judgment grows</span><span class="l-chip l-chip--cyan">PROGRESS</span></div></div>`;
      case 'loop':
        return `<div class="l-board l-board--loop"><div class="l-board-head"><span>BUYER CONTEXT / HANDOFF</span><i>READY FOR NEXT CALL</i></div><div class="l-loop-handoff"><span><b>PAST</b>Observed risk</span><em>→</em><span><b>NOW</b>Validate authority</span><em>→</em><span><b>NEXT</b>Coach the move</span></div><div class="l-board-foot"><span>the evidence gets better</span><span class="l-live-dot">↗</span></div></div>`;
      case 'close':
        return `<div class="l-board l-board--close"><div class="l-board-head"><span>PITCHGENIUS / PILOT VIEW</span><i>ONE BUYER</i></div><div class="l-close-stack"><span>PRE-CALL BRIEF</span><span>HUMANCUE LIVE</span><span>MANAGER WORKBENCH</span></div><div class="l-board-foot"><span>see the human movement behind the pipeline</span><span class="l-live-dot">●</span></div></div>`;
      default:
        return '';
    }
  };

  const makeBand = (id, item) => {
    const band = document.createElement('div');
    band.className = `l-feature-band l-feature-band--${item.kind}`;
    const panelId = `learn-panel-${id}`;
    band.innerHTML = `
      <div class="l-feature-copy">
        <div class="l-feature-eyebrow">${esc(item.eyebrow)}</div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.copy)}</p>
        <button class="l-learn-more" type="button" aria-expanded="false" aria-controls="${panelId}">Learn more <span aria-hidden="true">↗</span></button>
        <div class="l-learn-panel" id="${panelId}" hidden><p tabindex="-1">${esc(item.detail)}</p><span>Direct product description</span></div>
      </div>
      ${board(item.kind)}
    `;
    return band;
  };

  Object.entries(data).forEach(([id, item]) => {
    const selector = id === 'top' ? '[data-section="hero"]' : id === 'cue-transition' ? '#cue-transition' : `[data-section="${id}"]`;
    const section = document.querySelector(selector);
    if (!section || section.querySelector(':scope > .l-feature-band')) return;
    section.classList.add('l-enhanced');
    section.append(makeBand(id, item));
  });

  document.querySelectorAll('.l-learn-more').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      button.classList.toggle('is-open', !open);
      if (!open) panel.querySelector('p')?.focus?.();
    });
  });
})();
