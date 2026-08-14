/* PitchGenius — 08-eleven-clean. The signature: scrub the call, the live card assembles.
   All card data is the one real moment from PRODUCT.md. No invented numbers. */
(function () {
  "use strict";

  var DATA = {
    cue: "buyer is still describing the screen display",
    readinessMax: 45,
    stage: "Discovery",
    move: "Clarify the display behavior",
    say: "The display scales to fit the screen. What are you seeing on your screen?",
    whyPre: "reading the room",
    whyPost: "this is the moment it costs him something"
  };

  var BANDS = { cue: 8, ready: 30, move: 50, say: 68 };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage = document.querySelector("[data-call-stage]");
  if (!stage) return;

  var input = stage.querySelector("[data-scrub-input]");
  var fill = stage.querySelector("[data-scrub-fill]");
  var head = stage.querySelector("[data-scrub-head]");
  var hint = stage.querySelector("[data-scrub-hint]");
  var clock = stage.querySelector("[data-clock]");
  var recDot = stage.querySelector("[data-rec-dot]");
  var cueText = stage.querySelector("[data-cue-text]");
  var readiness = stage.querySelector("[data-readiness]");
  var stageBadge = stage.querySelector("[data-stage]");
  var moveBlock = stage.querySelector("[data-move-block]");
  var moveText = stage.querySelector("[data-move-text]");
  var sayBlock = stage.querySelector("[data-say-block]");
  var sayText = stage.querySelector("[data-say-text]");
  var whyBlock = stage.querySelector("[data-why-block]");
  var whyPre = stage.querySelector("[data-why-pre]");
  var whyPost = stage.querySelector("[data-why-post]");

  var typed = { cue: false, say: false };
  var countRAF = 0;

  function fmt(sec) {
    var s = Math.round(sec);
    return "0:" + (s < 10 ? "0" + s : s);
  }

  function setClock(pct) {
    clock.textContent = fmt((pct / 100) * 30) + " / 0:30";
  }

  function typeInto(el, text, done) {
    if (reduceMotion) { el.textContent = text; if (done) done(); return; }
    el.textContent = "";
    var i = 0;
    var caret = document.createElement("span");
    caret.className = "caret";
    el.appendChild(caret);
    function step() {
      if (i >= text.length) {
        caret.remove();
        if (done) done();
        return;
      }
      el.insertBefore(document.createTextNode(text.charAt(i)), caret);
      i++;
      setTimeout(step, 26);
    }
    step();
  }

  function countTo(target) {
    cancelAnimationFrame(countRAF);
    var start = parseInt(readiness.textContent, 10) || 0;
    if (reduceMotion || start === target) { readiness.textContent = target; return; }
    var t0 = null;
    var dur = 420;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      readiness.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) countRAF = requestAnimationFrame(frame);
    }
    countRAF = requestAnimationFrame(frame);
  }

  function resetCard() {
    cancelAnimationFrame(countRAF);
    cueText.textContent = "";
    readiness.textContent = "0";
    stageBadge.textContent = "";
    moveBlock.classList.remove("shown");
    sayBlock.classList.remove("shown");
    whyBlock.classList.remove("shown");
    moveText.textContent = "";
    sayText.textContent = "";
    whyPre.textContent = "";
    whyPost.textContent = "";
    typed.cue = false;
    typed.say = false;
  }

  function render(pct) {
    fill.style.width = pct + "%";
    head.style.left = pct + "%";
    input.setAttribute("aria-valuenow", String(Math.round(pct)));
    setClock(pct);

    recDot.classList.toggle("live", pct > 0);

    if (pct < BANDS.cue) {
      resetCard();
      return;
    }

    if (pct >= BANDS.cue && !typed.cue) {
      typed.cue = true;
      typeInto(cueText, DATA.cue, null);
    }

    if (pct >= BANDS.ready) {
      stageBadge.textContent = DATA.stage;
      var target;
      if (pct >= BANDS.move) target = DATA.readinessMax;
      else target = Math.round(DATA.readinessMax * (pct - BANDS.ready) / (BANDS.move - BANDS.ready));
      target = Math.max(0, Math.min(DATA.readinessMax, target));
      var cur = parseInt(readiness.textContent, 10);
      if (Math.abs(cur - target) >= 1 && !reduceMotion) {
        countTo(target);
      } else {
        readiness.textContent = target;
      }
    } else {
      stageBadge.textContent = "";
      readiness.textContent = "0";
    }

    if (pct >= BANDS.move) {
      if (!moveBlock.classList.contains("shown")) {
        moveText.textContent = DATA.move;
        moveBlock.classList.add("shown");
      }
    } else {
      moveBlock.classList.remove("shown");
    }

    if (pct >= BANDS.say) {
      whyPre.textContent = DATA.whyPre;
      whyPost.textContent = DATA.whyPost;
      whyBlock.classList.add("shown");
      if (!typed.say) {
        typed.say = true;
        typeInto(sayText, DATA.say, null);
        sayBlock.classList.add("shown");
      } else {
        sayBlock.classList.add("shown");
      }
    } else {
      sayBlock.classList.remove("shown");
      whyBlock.classList.remove("shown");
      typed.say = false;
      sayText.textContent = "";
    }
  }

  function setPct(pct) {
    pct = Math.max(0, Math.min(100, pct));
    input.value = String(pct);
    render(pct);
  }

  input.addEventListener("input", function () {
    if (hint) hint.textContent = "Live";
    render(parseFloat(input.value));
  });

  var nextBtn = stage.querySelector("[data-next]");
  var dismissBtn = stage.querySelector("[data-dismiss]");
  if (nextBtn) nextBtn.addEventListener("click", function () {
    setPct(parseFloat(input.value) + 12);
  });
  if (dismissBtn) dismissBtn.addEventListener("click", function () { setPct(0); });

  render(0);

  /* likert (rep calibration demo) */
  var liks = document.querySelectorAll("[data-lik]");
  liks.forEach(function (b) {
    b.addEventListener("click", function () {
      liks.forEach(function (x) { x.classList.remove("selected"); x.setAttribute("aria-label", x.getAttribute("aria-label").replace(", selected","")); });
      b.classList.add("selected");
      b.setAttribute("aria-label", b.getAttribute("aria-label") + ", selected");
    });
  });

  /* footer year */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear() + " \u00B7 " + y.textContent;
})();
