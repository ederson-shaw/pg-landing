(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numEl = document.getElementById("readiness-num");
  const terminal = document.getElementById("terminal");
  if (!numEl || !terminal) return;

  const BASE = 45;
  const steps = [42, 44, 45, 47, 45, 43, 45, 46, 44, 45];
  let i = 0;

  if (reduce) {
    numEl.textContent = String(BASE);
    return;
  }

  let ticking = false;
  let last = 0;
  const INTERVAL = 1400;

  function step() {
    numEl.textContent = String(steps[i % steps.length]);
    numEl.animate(
      [{ opacity: 0.35 }, { opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.4,0,.2,1)" }
    );
    i += 1;
  }

  function onScroll() {
    if (ticking) return;
    if (Date.now() - last < INTERVAL) return;
    const r = terminal.getBoundingClientRect();
    const inView = r.top < window.innerHeight && r.bottom > 0;
    if (!inView) return;
    ticking = true;
    last = Date.now();
    window.requestAnimationFrame(() => {
      step();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();
