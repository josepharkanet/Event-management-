/* =============================================================
   HADIYANA — main.js (shared across all pages)
   Vanilla JS niceties: scroll progress, sticky header, mobile
   nav, reveal-on-scroll (+ staggered groups), count-up stats,
   3D tilt, tabs, FAQ accordion, EN/AR toggle stub, lead form
   validation. No dependencies; progressive enhancement.
   ============================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dynamic year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Scroll progress bar + sticky header ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("progressBar");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
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
      if (open) { void scrim.offsetWidth; scrim.classList.add("is-open"); }
      else { scrim.classList.remove("is-open"); }
    }
    // menu-open neutralizes the header's backdrop-filter so the fixed nav
    // panel isn't clipped to a semi-transparent header box when scrolled.
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (hamburger) hamburger.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  if (navClose) navClose.addEventListener("click", function () { setNav(false); });
  if (scrim) scrim.addEventListener("click", function () { setNav(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- Reveal on scroll (single + staggered groups) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll("[data-countup]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var dur = 1500, start = null;
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

  /* ---------- 3D tilt on cards ---------- */
  if (!prefersReduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var raf = null;
      el.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = "perspective(800px) rotateY(" + (x * 6) + "deg) rotateX(" + (-y * 6) + "deg) translateY(-4px)";
          raf = null;
        });
      });
      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Tabs ---------- */
  var tabList = document.querySelector(".tabs__list");
  if (tabList) {
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll(".tabs__tab"));
    var selectTab = function (tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    };
    tabList.addEventListener("click", function (e) {
      var tab = e.target.closest(".tabs__tab");
      if (tab) selectTab(tab);
    });
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
      var panel = trigger.parentElement.nextElementSibling;
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (!panel) return;
      if (prefersReduced) { // no transition -> transitionend never fires
        panel.hidden = expanded;
        return;
      }
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
  if (!prefersReduced) {
    document.querySelectorAll(".acc__panel").forEach(function (p) { p.style.transition = "height .3s cubic-bezier(.22,1,.36,1)"; });
  }

  /* ---------- EN / AR language toggle (v1 stub) ----------
     Flips <html> lang/dir, lazy-loads css/rtl.css, and swaps nav
     strings via data-ar attributes. Expand by adding data-ar to
     any element you want translated, or serve localized pages. */
  var langToggle = document.getElementById("langToggle");
  var rtlLink = null;
  var isAR = document.documentElement.getAttribute("dir") === "rtl";

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
      document.querySelectorAll("[data-ar]").forEach(function (el) {
        if (isAR) { el.dataset.en = el.dataset.en || el.textContent; el.textContent = el.dataset.ar; }
        else if (el.dataset.en) { el.textContent = el.dataset.en; }
      });
    });
  }

  /* ---------- Lead form: client-side validation + success ----------
     Static stub. To wire a real backend: set the form action to your
     endpoint and replace the success block with a fetch() POST. */
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
    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") setError(el, ""); });
    });
  }
})();
