"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "open navigation" : "close navigation");
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "open navigation");
      mobileNav.hidden = true;
      menuToggle.focus();
    });
  });
}

document.querySelectorAll(".live-detail-toggle").forEach((toggle) => {
  const details = toggle.closest(".live-card")?.querySelector(".live-details");
  if (!details) return;
  toggle.addEventListener("click", () => {
    details.open = !details.open;
    toggle.setAttribute("aria-expanded", String(details.open));
  });
  details.addEventListener("toggle", () => toggle.setAttribute("aria-expanded", String(details.open)));
});

document.querySelectorAll("[data-live-action]").forEach((action) => {
  action.addEventListener("click", () => {
    const card = action.closest(".live-card");
    const body = card?.querySelector(".live-card-body");
    const state = card?.querySelector(".live-state");
    if (!card || !body || !state) return;
    const dismissed = action.dataset.liveAction === "dismiss";
    state.textContent = dismissed ? "Listening" : "waiting for the next moment";
    body.innerHTML = `<div class="live-empty-state">${dismissed ? "Suggestion dismissed. Keep listening." : "Listening for the next moment."}</div>`;
  });
});

const journeyVisual = document.querySelector(".journey-visual");
const journeySteps = [...document.querySelectorAll(".journey-step")];
const readoutNumber = document.querySelector(".readout-number");
const readoutAfter = document.querySelector(".readout-after");
const readoutCaption = document.querySelector(".readout-caption");
const journeyImage = document.querySelector(".journey-image");
const journeyProofMedia = document.querySelector(".journey-proof-media");
const journeyLiveSlot = document.querySelector(".journey-live-slot");
const stickyContext = document.querySelector(".sticky-context");

const journeyStates = {
  "1": {
    image: "assets/buyer-blueprint.webp",
    alt: "PitchGenius Buyer Blueprint for Judd Barakove before the call",
    context: "Buyer Blueprint / before the call",
    current: "—",
    after: "—",
    caption: "before the call"
  },
  "2": {
    context: "Live co-pilot / value / 25",
    current: "25",
    after: "—",
    caption: "during the call"
  },
  "3": {
    image: "assets/post-call-analysis.webp",
    alt: "PitchGenius post-call analysis showing the later buyer readiness state at 78",
    context: "Post-call analysis / later / 78",
    current: "25",
    after: "78",
    caption: "after the call"
  }
};

const setJourneyStep = (step) => {
  if (!journeyVisual) return;
  const state = journeyStates[step];
  journeyVisual.dataset.active = step;
  journeySteps.forEach((item) => item.classList.toggle("is-active", item.dataset.step === step));
  if (journeyProofMedia) journeyProofMedia.hidden = step === "2";
  if (journeyLiveSlot) journeyLiveSlot.hidden = step !== "2";
  if (state && readoutNumber) readoutNumber.textContent = state.current;
  if (state && readoutAfter) readoutAfter.textContent = state.after;
  if (state && readoutCaption) readoutCaption.textContent = state.caption;
  if (state && journeyImage && state.image) {
    journeyImage.src = state.image;
    journeyImage.alt = state.alt;
  }
  if (state && stickyContext) stickyContext.textContent = state.context;
};

if (journeyVisual && journeySteps.length) {
  setJourneyStep("2");
  const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setJourneyStep(entry.target.dataset.step);
    });
  }, { rootMargin: "-38% 0px -42% 0px", threshold: 0 });
  journeySteps.forEach((step) => journeyObserver.observe(step));
}

const proofTabs = [...document.querySelectorAll(".proof-tab")];
const proofPanels = [...document.querySelectorAll(".proof-panel")];

const setProofPanel = (panelName) => {
  proofTabs.forEach((tab) => {
    const active = tab.dataset.panel === panelName;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  proofPanels.forEach((panel) => {
    const active = panel.dataset.panelContent === panelName;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
};

proofTabs.forEach((tab) => tab.addEventListener("click", () => setProofPanel(tab.dataset.panel)));

const benchmarkTabs = [...document.querySelectorAll(".benchmark-tab")];
const benchmarkPanels = [...document.querySelectorAll(".benchmark-bars-panel")];
const benchmarkReadout = document.querySelector(".benchmark-readout-text");
const benchmarkStates = {
  after: "a record of what happened.",
  during: "a sentence while it can still change the outcome."
};

const setBenchmark = (benchmarkName) => {
  benchmarkTabs.forEach((item) => {
    const selected = item.dataset.benchmark === benchmarkName;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
  });
  benchmarkPanels.forEach((panel) => {
    const selected = panel.dataset.benchmarkPanel === benchmarkName;
    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
    panel.setAttribute("aria-hidden", String(!selected));
  });
  if (benchmarkReadout && benchmarkStates[benchmarkName]) benchmarkReadout.textContent = benchmarkStates[benchmarkName];
};

benchmarkTabs.forEach((tab) => tab.addEventListener("click", () => setBenchmark(tab.dataset.benchmark)));
if (benchmarkTabs.length) setBenchmark(benchmarkTabs.find((tab) => tab.classList.contains("is-active"))?.dataset.benchmark || "after");
