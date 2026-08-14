const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const setMenu = (isOpen, restoreFocus = false) => {
    mobileMenu.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      mobileMenu.removeAttribute("inert");
      window.requestAnimationFrame(() => mobileMenu.querySelector("a")?.focus());
    } else {
      mobileMenu.setAttribute("inert", "");
      if (restoreFocus) menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) setMenu(false, true);
  });
}

document.querySelectorAll("[data-live-card]").forEach((card) => {
  const toggle = card.querySelector(".hc-toggle");
  const detailLink = card.querySelector(".hc-detail-link");
  const detail = card.querySelector(".hc-detail");
  const stateSlot = card.querySelector(".hc-state-slot");
  const next = card.querySelector(".hc-next");
  const dismiss = card.querySelector(".hc-dismiss");

  const setDetails = (isOpen) => {
    detail.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Hide live details" : "Show live details");
    detailLink.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => setDetails(detail.hidden));
  detailLink.addEventListener("click", () => setDetails(detail.hidden));
  next.addEventListener("click", () => {
    stateSlot.textContent = "Writing the line";
    stateSlot.classList.add("is-writing");
  });
  dismiss.addEventListener("click", () => {
    stateSlot.textContent = "Listening";
    stateSlot.classList.remove("is-writing");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const storyCards = [...document.querySelectorAll(".story-card")];
const storyIndex = [...document.querySelectorAll(".story-index span")];

if (storyCards.length && storyIndex.length && "IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = storyCards.indexOf(entry.target);
        storyIndex.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
      }
    });
  }, { rootMargin: "-35% 0px -50% 0px", threshold: 0 });

  storyCards.forEach((card) => observer.observe(card));
}

/* Hand-drawn ink stroke, drawn on scroll — not faded in. Mirrors oysterhr.com's real
   arrow-drawing technique (ref/index.raw.html, "Second Section - Purple Green Card"
   IIFE): strokeDasharray set from the path's own getTotalLength(), strokeDashoffset
   driven to 0 with ease: none. Same technique drives the integration-band arrows
   (.arrow-stem / .arrow-tip-1 / .arrow-tip-2) flanking the marquee heading. */
const wavePaths = [...document.querySelectorAll(".live-wave-strip path, .integration-arrow path")];
if (wavePaths.length && "IntersectionObserver" in window && !reducedMotion.matches) {
  wavePaths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  });

  const strokeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.strokeDashoffset = "0";
        strokeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });

  wavePaths.forEach((path) => strokeObserver.observe(path));
}

/* Grow-in, not slide-up: oysterhr.com's real card timeline scales content from .4 to
   1 plus a fade, never a translateY (same IIFE, cardTimeline.to scale:1, autoAlpha:1,
   duration:.7). reveal-pending primes the pre-scroll state; is-in plays it once. */
if (storyCards.length && "IntersectionObserver" in window && !reducedMotion.matches) {
  storyCards.forEach((card) => card.classList.add("reveal-pending"));

  const growObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        growObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .2 });

  storyCards.forEach((card) => growObserver.observe(card));
}

/* Staggered wipe: mirrors the reference's mask-reveal clip-path timeline, staggered
   between siblings (same IIFE, .fromTo('.mask-reveal', clipPath..., stagger: .4)). */
const momentEls = [...document.querySelectorAll(".moment")];
if (momentEls.length && "IntersectionObserver" in window && !reducedMotion.matches) {
  momentEls.forEach((moment) => moment.classList.add("reveal-pending"));

  const wipeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        wipeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .3 });

  momentEls.forEach((moment) => wipeObserver.observe(moment));
}
