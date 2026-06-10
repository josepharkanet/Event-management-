// Convene — small interactions for the static UI.
// No dependencies; progressive enhancement only.

(function () {
  "use strict";

  // --- Mobile sidebar toggle ---
  var menuToggle = document.getElementById("menuToggle");
  var sidebar = document.getElementById("sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("is-open");
    });
    // Close when tapping outside the sidebar on small screens.
    document.addEventListener("click", function (e) {
      if (window.innerWidth > 860) return;
      if (sidebar.contains(e.target) || menuToggle.contains(e.target)) return;
      sidebar.classList.remove("is-open");
    });
  }

  // --- Event type filtering ---
  var filterBar = document.getElementById("filters");
  var eventList = document.getElementById("events");
  if (filterBar && eventList) {
    var filters = filterBar.querySelectorAll(".filter");
    var events = eventList.querySelectorAll(".event");

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;

      filters.forEach(function (f) { f.classList.remove("is-active"); });
      btn.classList.add("is-active");

      var type = btn.getAttribute("data-filter");
      events.forEach(function (ev) {
        var show = type === "all" || ev.getAttribute("data-type") === type;
        ev.classList.toggle("is-hidden", !show);
      });
    });
  }

  // --- Segmented time range (visual only) ---
  var segmented = document.querySelector(".segmented");
  if (segmented) {
    segmented.addEventListener("click", function (e) {
      var btn = e.target.closest(".segmented__btn");
      if (!btn) return;
      segmented.querySelectorAll(".segmented__btn").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
    });
  }

  // --- ⌘K / Ctrl+K focuses search ---
  var searchInput = document.querySelector(".search input");
  if (searchInput) {
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }
})();
