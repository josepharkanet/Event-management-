/* =============================================================
   HADIYANA — main.js
   Vanilla JS niceties only: sticky-header state, mobile nav,
   smooth-scroll-aware active link, audience tabs, FAQ accordion,
   scroll-reveal, count-up stats, EN/AR toggle stub, form validation.
   No dependencies. Progressive enhancement.
   ============================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dynamic year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("primaryNav");
  var navClose = document.getElementById("navClose");
  var scrim = document.getElementById("navScrim");

  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
    if (scrim) {
      scrim.hidden = !open;
      // force reflow so the opacity transition runs
      if (open) { void scrim.offsetWidth; scrim.classList.add("is-open"); }
      else { scrim.classList.remove("is-open"); }
    }
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (hamburger) hamburger.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  if (navClose) navClose.addEventListener("click", function () { setNav(false); });
  if (scrim) scrim.addEventListener("click", function () { setNav(false); });
  // Close after tapping a nav link on mobile
  if (nav) {
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { if (window.innerWidth <= 900) setNav(false); });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- Active nav link on scroll (scroll-spy) ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Audience tabs ---------- */
  var tabList = document.querySelector(".tabs__list");
  if (tabList) {
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll(".tabs__tab"));
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !selected;
          panel.classList.toggle("is-active", selected);
        }
      });
    }
    tabList.addEventListener("click", function (e) {
      var tab = e.target.closest(".tabs__tab");
      if (tab) selectTab(tab);
    });
    // Keyboard: left/right arrows
    tabList.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); selectTab(next); }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      var panel = trigger.parentElement.nextElementSibling; // <div class="acc__panel">
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (!panel) return;
      if (expanded) {
        panel.style.height = panel.scrollHeight + "px";
        requestAnimationFrame(function () { panel.style.height = "0px"; });
        panel.addEventListener("transitionend", function te() { panel.hidden = true; panel.style.height = ""; panel.removeEventListener("transitionend", te); });
      } else {
        panel.hidden = false;
        var h = panel.scrollHeight;
        panel.style.height = "0px";
        requestAnimationFrame(function () { panel.style.height = h + "px"; });
        panel.addEventListener("transitionend", function te() { panel.style.height = ""; panel.removeEventListener("transitionend", te); });
      }
    });
  });
  // accordion panel transition (added here so it doesn't fight reduced-motion users at load)
  if (!prefersReduced) {
    document.querySelectorAll(".acc__panel").forEach(function (p) { p.style.transition = "height .3s cubic-bezier(.22,1,.36,1)"; });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll("[data-countup]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObserver.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- EN / AR language toggle (v1 stub) ----------
     Flips <html> lang/dir and loads css/rtl.css on demand.
     A small documented subset of strings is swapped; the key
     deliverable is that layout does not break in RTL.
     Wire full i18n by expanding the AR_STRINGS map (keyed by
     a data-i18n attribute) or by serving a localized page.    */
  var AR_STRINGS = {
    home: "الرئيسية", how: "كيف يعمل", features: "المميزات",
    marketplace: "السوق", vendors: "للموردين", revenue: "الإيرادات",
    about: "من نحن", contact: "تواصل معنا", demo: "اطلب عرضاً"
  };
  var langToggle = document.getElementById("langToggle");
  var rtlLink = null;
  var isAR = false;

  function loadRTL() {
    if (rtlLink) return;
    rtlLink = document.createElement("link");
    rtlLink.rel = "stylesheet";
    rtlLink.href = "css/rtl.css";
    document.head.appendChild(rtlLink);
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      isAR = !isAR;
      var html = document.documentElement;
      html.setAttribute("lang", isAR ? "ar" : "en");
      html.setAttribute("dir", isAR ? "rtl" : "ltr");
      langToggle.setAttribute("aria-pressed", String(isAR));
      langToggle.querySelectorAll(".lang-toggle__opt").forEach(function (o) {
        o.classList.toggle("is-active", o.getAttribute("data-lang") === (isAR ? "ar" : "en"));
      });
      if (isAR) loadRTL();
      if (rtlLink) rtlLink.disabled = !isAR;
      // Swap the documented subset of nav strings (stub).
      var navMap = ["home", "how", "features", "marketplace", "vendors", "revenue", "about", "contact"];
      if (nav) {
        nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
          var key = a.getAttribute("href").slice(1);
          if (isAR && AR_STRINGS[key]) { a.dataset.en = a.dataset.en || a.textContent; a.textContent = AR_STRINGS[key]; }
          else if (a.dataset.en) { a.textContent = a.dataset.en; }
        });
      }
    });
  }

  /* ---------- Lead form: client-side validation + success state ----------
     NOTE: This is a static stub. To wire a real backend, set the form's
     `action` to your endpoint, switch method to POST, remove the
     e.preventDefault() short-circuit below, and handle the response. */
  var form = document.getElementById("leadForm");
  var success = document.getElementById("formSuccess");

  function setError(input, msg) {
    var slot = form.querySelector('[data-error-for="' + input.id + '"]');
    if (slot) slot.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate() {
    var ok = true;
    var name = document.getElementById("f-name");
    var email = document.getElementById("f-email");
    var phone = document.getElementById("f-phone");
    var role = document.getElementById("f-role");

    if (!name.value.trim()) { setError(name, "Please enter your name."); ok = false; } else setError(name, "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) { setError(email, "Enter a valid email address."); ok = false; } else setError(email, "");
    var phoneClean = phone.value.replace(/[\s-]/g, "");
    if (!/^(\+?9715\d{8}|05\d{8})$/.test(phoneClean)) { setError(phone, "Enter a valid UAE phone (e.g. +9715XXXXXXXX)."); ok = false; } else setError(phone, "");
    if (!role.value) { setError(role, "Please choose one."); ok = false; } else setError(role, "");
    return ok;
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // static stub — no backend
      if (!validate()) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      form.querySelectorAll("input, select, textarea, button").forEach(function (el) { el.disabled = true; });
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" }); }
    });
    // clear error as the user types
    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") setError(el, ""); });
    });
  }
})();
