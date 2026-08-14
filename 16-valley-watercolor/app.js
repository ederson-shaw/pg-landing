(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (reduceMotion) return;

  var liveCard = document.querySelector("[data-live-card]");
  var readinessEls = document.querySelectorAll("[data-readiness]");
  var humancueEls = document.querySelectorAll("[data-humancue]");

  var baseReadiness = 45;
  var activated = false;

  function startLiveAnimations() {
    if (activated) return;
    activated = true;

    if (readinessEls.length) {
      setInterval(function () {
        var nudge = baseReadiness + Math.floor(Math.random() * 3) - 1;
        readinessEls.forEach(function (el) { el.textContent = nudge; });
        setTimeout(function () {
          readinessEls.forEach(function (el) { el.textContent = baseReadiness; });
        }, 1200);
      }, 5000);
    }

    if (humancueEls.length) {
      setInterval(function () {
        humancueEls.forEach(function (el) { el.style.opacity = "0.5"; });
        setTimeout(function () {
          humancueEls.forEach(function (el) { el.style.opacity = "1"; });
        }, 400);
      }, 6000);
    }
  }

  if (liveCard) {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startLiveAnimations();
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    cardObserver.observe(liveCard);
  }
})();
