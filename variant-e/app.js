(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.getElementById("nav");
  var menuToggle = document.getElementById("menu-toggle");
  var primaryNav = document.getElementById("primary-nav");
  var menuLabel = document.getElementById("menu-toggle-label");
  var menuLinks = primaryNav ? Array.prototype.slice.call(primaryNav.querySelectorAll("a")) : [];
  var narrowNavMedia = window.matchMedia ? window.matchMedia("(max-width: 900px)") : null;

  function updateNav() {
    if (!nav) return;
    var navCenter = nav.getBoundingClientRect().top + nav.offsetHeight / 2;
    var darkSections = document.querySelectorAll("[data-nav-theme='dark']");
    var isDark = false;

    for (var i = 0; i < darkSections.length; i += 1) {
      var rect = darkSections[i].getBoundingClientRect();
      if (rect.top <= navCenter && rect.bottom >= navCenter) {
        isDark = true;
        break;
      }
    }

    nav.classList.toggle("nav--dark", isDark);
    nav.classList.toggle("nav--scrolled", window.scrollY > 8 && !isDark);
  }

  var scrollTicking = false;
  function requestNavUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      updateNav();
      scrollTicking = false;
    });
  }

  updateNav();
  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate);

  function isNarrowNav() {
    return narrowNavMedia ? narrowNavMedia.matches : window.innerWidth <= 900;
  }

  function setMenuLinksFocusable(canFocus) {
    menuLinks.forEach(function (link) {
      if (canFocus) {
        if (!link.hasAttribute("data-menu-tabindex")) return;
        var previousTabindex = link.getAttribute("data-menu-tabindex");
        link.removeAttribute("data-menu-tabindex");
        if (previousTabindex) {
          link.setAttribute("tabindex", previousTabindex);
        } else {
          link.removeAttribute("tabindex");
        }
        return;
      }

      if (!link.hasAttribute("data-menu-tabindex")) {
        link.setAttribute("data-menu-tabindex", link.getAttribute("tabindex") || "");
      }
      link.setAttribute("tabindex", "-1");
    });
  }

  function setMenuState(open, returnFocus) {
    if (!nav || !menuToggle) return;
    var narrow = isNarrowNav();
    var isOpen = narrow && Boolean(open);

    nav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (menuLabel) menuLabel.textContent = isOpen ? "Close menu" : "Open menu";

    if (primaryNav) {
      if (narrow) {
        primaryNav.setAttribute("aria-hidden", String(!isOpen));
        if ("inert" in primaryNav) primaryNav.inert = !isOpen;
        setMenuLinksFocusable(isOpen);
      } else {
        primaryNav.removeAttribute("aria-hidden");
        if ("inert" in primaryNav) primaryNav.inert = false;
        setMenuLinksFocusable(true);
      }
    }

    if (returnFocus) menuToggle.focus();
  }

  function syncMenuForViewport() {
    if (!nav || !menuToggle) return;
    if (!isNarrowNav()) {
      setMenuState(false, false);
      return;
    }
    setMenuState(nav.classList.contains("open"), false);
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var opening = !nav.classList.contains("open");
      setMenuState(opening, false);
      if (opening && isNarrowNav() && menuLinks[0]) menuLinks[0].focus();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !nav.classList.contains("open")) return;
      event.preventDefault();
      setMenuState(false, true);
    });

    document.addEventListener("pointerdown", function (event) {
      if (!isNarrowNav() || !nav.classList.contains("open") || nav.contains(event.target)) return;
      setMenuState(false, false);
    });

    window.addEventListener("resize", syncMenuForViewport);
    syncMenuForViewport();
  }

  if (primaryNav && nav) {
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false, false);
      });
    });
  }

  document.querySelectorAll("[data-cue-detail-toggle]").forEach(function (toggle) {
    var detailId = toggle.getAttribute("aria-controls");
    var detail = detailId ? document.getElementById(detailId) : null;
    if (!detail) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      detail.hidden = expanded;
      toggle.textContent = expanded ? "Show context" : "Hide context";
    });
  });

  var revealElements = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal], [data-reveal-group]")
  );

  function showAll() {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });

    /* IntersectionObserver is intentionally supplemented with a layout sweep.
       It keeps first paint reliable in local/file previews and reveals sections
       reached through a fragment link before the observer's first callback. */
    function revealInView() {
      var threshold = window.innerHeight * 0.92;
      revealElements.forEach(function (element) {
        var rect = element.getBoundingClientRect();
        if (rect.top < threshold) {
          element.classList.add("is-visible");
        }
      });
    }

    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView);
    window.requestAnimationFrame(revealInView);
    window.setTimeout(revealInView, 90);
  }

  var signalTrace = document.getElementById("signal-trace");
  if (signalTrace) {
    var traceLength = signalTrace.getTotalLength();
    signalTrace.style.strokeDasharray = String(traceLength);
    signalTrace.style.strokeDashoffset = reduceMotion ? "0" : String(traceLength);

    if (!reduceMotion && "IntersectionObserver" in window) {
      var traceObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          signalTrace.style.strokeDashoffset = "0";
          traceObserver.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      traceObserver.observe(signalTrace);
    }
  }
}());
