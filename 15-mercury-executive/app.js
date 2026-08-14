document.documentElement.classList.add("js-ready");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const liveCard = document.querySelector(".live-card");
const focusTargets = [...document.querySelectorAll(".focus-target")];
const nextButton = document.querySelector("[data-next]");
const dismissButton = document.querySelector(".dismiss-button");
const whyLink = document.querySelector(".why-link");
const foldButton = document.querySelector(".fold-button");
const detailPanel = document.querySelector("#live-card-detail");

const setFocus = (name) => {
  focusTargets.forEach((target) => target.classList.toggle("is-current", target.dataset.focus === name));
};

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }));
}

// mercury.com samples window.scrollY with a 50ms-leading throttle before toggling
// the hardened nav state (ref/EXTRACT.md:242). Leading-edge: fire immediately,
// then ignore further scroll events until 50ms have passed.
const leadingThrottle = (fn, ms) => {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => { waiting = false; }, ms);
  };
};

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", leadingThrottle(updateHeader, 50), { passive: true });
}

if (nextButton && liveCard) {
  const order = ["move", "say", "why"];
  let index = 0;
  nextButton.addEventListener("click", () => {
    liveCard.classList.remove("is-dismissed");
    dismissButton.textContent = "Dismiss";
    dismissButton.setAttribute("aria-expanded", "true");
    index = (index + 1) % order.length;
    setFocus(order[index]);
  });
}

if (dismissButton && liveCard) {
  dismissButton.addEventListener("click", () => {
    const isDismissed = liveCard.classList.toggle("is-dismissed");
    dismissButton.textContent = isDismissed ? "Open" : "Dismiss";
    dismissButton.setAttribute("aria-expanded", String(!isDismissed));
    if (!isDismissed) setFocus("move");
  });
}

// Disclosure animates via CSS grid-template-rows 0fr -> 1fr at 300ms ease-out,
// matching mercury's own accordion pattern (ref/EXTRACT.md:257) instead of an
// abrupt hidden-attribute toggle.
const setDetailOpen = (isOpen) => {
  if (!detailPanel) return;
  detailPanel.classList.toggle("is-open", isOpen);
  detailPanel.setAttribute("aria-hidden", String(!isOpen));
  whyLink?.setAttribute("aria-expanded", String(isOpen));
  foldButton?.setAttribute("aria-expanded", String(isOpen));
  foldButton?.setAttribute("aria-label", isOpen ? "Hide live-call detail" : "Show live-call detail");
};

if (whyLink) {
  whyLink.addEventListener("click", () => {
    const isOpen = detailPanel ? !detailPanel.classList.contains("is-open") : false;
    setDetailOpen(isOpen);
    setFocus("why");
    whyLink.focus({ preventScroll: true });
  });
}

if (foldButton) {
  foldButton.addEventListener("click", () => {
    setDetailOpen(!(detailPanel?.classList.contains("is-open") ?? false));
    foldButton.focus({ preventScroll: true });
  });
}

if (hero && !reduceMotion) {
  const updateHeroProgress = () => {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    hero.style.setProperty("--hero-progress", progress.toFixed(3));
  };
  updateHeroProgress();
  window.addEventListener("scroll", updateHeroProgress, { passive: true });
  window.addEventListener("resize", updateHeroProgress, { passive: true });
}

const revealItems = [...document.querySelectorAll(".reveal")];
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  // Trigger geometry copied from mercury.com's own reveal container component
  // (ref chunk 24321: rootMargin "0px 0px -35% 0px", once: true) — a section
  // fires once it has crossed 35% into the viewport from the bottom, not at
  // the first sliver of intersection.
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      instance.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -35% 0px" });
  revealItems.forEach((item) => observer.observe(item));
}
