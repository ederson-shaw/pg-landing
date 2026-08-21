(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: dark theme over dark sections + burger */
  (function () {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    if (!nav) return;
    var themed = Array.prototype.slice.call(document.querySelectorAll("[data-nav-theme]"));
    function onScroll() {
      var navRect = nav.getBoundingClientRect();
      var midY = navRect.top + navRect.height / 2;
      var dark = false;
      var darkId = "";
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= midY && r.bottom >= midY) { dark = true; darkId = themed[i].id; break; }
      }
      nav.classList.toggle("nav--dark", dark);
      nav.classList.toggle("nav--s07", darkId === "s07");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (burger) {
      var lastFocus = null;
      function closeMenu(restore) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
        if (restore && lastFocus) lastFocus.focus();
      }
      burger.addEventListener("click", function () {
        lastFocus = document.activeElement;
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (open) {
          var first = nav.querySelector(".nav__links a");
          if (first) window.requestAnimationFrame(function () { first.focus(); });
        }
      });
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () { closeMenu(false); });
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && nav.classList.contains("open")) {
          event.preventDefault();
          closeMenu(true);
        }
      });
    }
  })();

  /* one-shot reveal sweep (jump-immune) */
  (function () {
    var pending = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], [data-stagger], .s02__photo, .s04__journey"));
    if (reduce || !("IntersectionObserver" in window)) {
      pending.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var tick = false;
    function sweep() {
      if (tick || !pending.length) return;
      tick = true;
      requestAnimationFrame(function () {
        var keep = [];
        var line = window.innerHeight * 0.86;
        pending.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < line) el.classList.add("is-in");
          else keep.push(el);
        });
        pending = keep;
        tick = false;
      });
    }
    window.addEventListener("scroll", sweep, { passive: true });
    sweep();
    /* A deep link or a full-section capture must not show an empty shell just
       because its observer threshold has not been crossed yet. Keep the
       staggered entrance for the viewport, then settle the remaining content. */
    window.setTimeout(function () {
      pending.forEach(function (el) { el.classList.add("is-in"); });
      pending = [];
    }, 1200);
  })();

  /* s03: curve draw scrubbed by scroll position of the curve element */
  (function () {
    var path = document.querySelector(".s03__path");
    var curveBox = document.querySelector(".s03__curve");
    if (!path || !curveBox || reduce) return;
    if (!("getTotalLength" in path)) return;
    var len = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    var shown = false;
    function frame() {
      var r = curveBox.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.9 - r.top) / (vh * 0.85);
      progress = Math.max(0, Math.min(1, progress));
      path.style.strokeDashoffset = String(len * (1 - progress));
      if (progress >= 1) shown = true;
    }
    window.addEventListener("scroll", frame, { passive: true });
    frame();
    if (shown) return;
  })();

  /* HumanCue demo states: the controls change the live surface itself rather
     than pretending to navigate to another section. The language stays
     evidence-led and the seller remains the decision maker. */
  (function () {
    var panel = document.querySelector(".s08__panel");
    if (!panel) return;
    var next = panel.querySelector("[data-cue-next]");
    var dismiss = panel.querySelector("[data-cue-dismiss]");
    var end = panel.querySelector("[data-cue-end]");
    var toggle = panel.querySelector(".s08__context-toggle");
    var contextDetail = panel.querySelector(".s08__context-detail");
    var state = panel.querySelector(".s08__context-state");
    var move = panel.querySelector(".s08__panel-block:first-child p");
    var say = panel.querySelector(".s08__say");
    var why = panel.querySelector(".s08__panel-block--why .s08__why");

    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("s08__context-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close call context" : "Open call context");
        if (contextDetail) contextDetail.hidden = !open;
      });
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "s08-context-detail");
    }

    if (next) {
      next.addEventListener("click", function () {
        if (panel.dataset.cueState === "ended") return;
        panel.dataset.cueState = "noted";
        if (state) state.textContent = "Risk remains unresolved. Buyer is still engaged.";
        if (move) move.textContent = "Test the implementation concern before advancing.";
        if (say) say.innerHTML = '<span class="s08__quote">“</span>What would make the rollout feel safe enough to move forward?<span class="s08__quote">”</span>';
        if (why) why.textContent = "The next useful move is to make the unresolved risk discussable.";
        next.textContent = "Noted";
        next.disabled = true;
      });
    }

    if (dismiss) {
      dismiss.addEventListener("click", function () {
        if (panel.dataset.cueState === "ended") return;
        if (panel.dataset.cueState === "quiet") {
          panel.dataset.cueState = "live";
          dismiss.textContent = "Dismiss";
          dismiss.setAttribute("aria-pressed", "false");
          return;
        }
        panel.dataset.cueState = "quiet";
        dismiss.textContent = "Bring cue back";
        dismiss.setAttribute("aria-pressed", "true");
      });
    }

    if (end) {
      end.addEventListener("click", function () {
        panel.dataset.cueState = "ended";
        panel.style.opacity = ".72";
        var endLabel = end.querySelector("span:last-child");
        if (endLabel) endLabel.textContent = "Ended";
        else end.textContent = "Ended";
        end.disabled = true;
        if (state) state.textContent = "Call ended. HumanCue is no longer listening.";
      });
    }
  })();
})();
