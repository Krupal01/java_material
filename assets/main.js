/* =========================================================
   Java Interview Site — Shared interactivity
   - Accordion / expand-all
   - Search + difficulty filters
   - Sidebar scroll-spy
   - Theme toggle (light <-> dark, persisted to localStorage)
   ========================================================= */

(function () {
  "use strict";

  var THEME_KEY = "java-theme";

  function applyTheme(theme) {
    var t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch (e) {
      /* ignore */
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  window.toggleTheme = function () {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  };

  /* Card accordion */
  window.toggle = function (header) {
    var card = header.parentElement;
    if (card) card.classList.toggle("open");
  };

  var allExpanded = false;
  window.toggleAll = function () {
    allExpanded = !allExpanded;
    document.querySelectorAll(".card").forEach(function (c) {
      if (allExpanded) c.classList.add("open");
      else c.classList.remove("open");
    });
    var btn = document.querySelector(".expand-all");
    if (btn) btn.textContent = allExpanded ? "Collapse All" : "Expand All";
  };

  /* Filters */
  var activeFilter = "all";
  window.filterBy = function (level, btn) {
    activeFilter = level;
    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    if (btn) btn.classList.add("active");
    applyFilters();
  };
  window.filterCards = function () {
    applyFilters();
  };

  function applyFilters() {
    var input = document.getElementById("searchInput");
    var query = input ? input.value.toLowerCase() : "";
    document.querySelectorAll(".card").forEach(function (card) {
      var titleEl = card.querySelector(".q-title");
      var bodyEl = card.querySelector(".answer");
      var diffEls = card.querySelectorAll(".difficulty");
      var title = titleEl ? titleEl.textContent.toLowerCase() : "";
      var body = bodyEl ? bodyEl.textContent.toLowerCase() : "";
      var matchesText =
        !query || title.indexOf(query) !== -1 || body.indexOf(query) !== -1;
      var matchesFilter = activeFilter === "all";
      if (!matchesFilter) {
        for (var i = 0; i < diffEls.length; i++) {
          if (diffEls[i].className.indexOf("diff-" + activeFilter) !== -1) {
            matchesFilter = true;
            break;
          }
        }
      }
      if (matchesText && matchesFilter) {
        card.style.display = "";
        if (query) card.classList.add("open");
      } else {
        card.style.display = "none";
      }
    });
    document.querySelectorAll(".section-title").forEach(function (st) {
      var next = st.nextElementSibling;
      var hasVisible = false;
      while (next && !next.classList.contains("section-title")) {
        if (next.style.display !== "none") hasVisible = true;
        next = next.nextElementSibling;
      }
      st.style.display = hasVisible ? "" : "none";
    });

    /* Methods page: filter rows in method tables */
    var methodSections = document.querySelectorAll(".method-section");
    if (methodSections.length) {
      var totalVisible = 0;
      methodSections.forEach(function (section) {
        var visibleInSection = 0;
        section.querySelectorAll("tbody tr").forEach(function (row) {
          var text = row.textContent.toLowerCase();
          if (!query || text.indexOf(query) !== -1) {
            row.style.display = "";
            visibleInSection++;
          } else {
            row.style.display = "none";
          }
        });
        section.style.display = visibleInSection === 0 && query ? "none" : "";
        if (query && visibleInSection > 0) section.classList.add("open");
        totalVisible += visibleInSection;
      });
      var noResults = document.getElementById("noResults");
      if (noResults) {
        noResults.classList.toggle("visible", query && totalVisible === 0);
      }
    }
  }

  /* Sidebar navigation */
  window.scrollToCard = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("open", "highlighted");
    setTimeout(function () {
      el.classList.remove("highlighted");
    }, 2000);
    document.querySelectorAll(".sidebar-link").forEach(function (l) {
      l.classList.remove("active");
    });
    var link = document.querySelector(
      '.sidebar-link[data-target="' + id + '"]',
    );
    if (link) link.classList.add("active");
  };

  /* Scroll-spy */
  if (typeof IntersectionObserver !== "undefined") {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.id;
            document.querySelectorAll(".sidebar-link").forEach(function (l) {
              l.classList.remove("active");
            });
            var link = document.querySelector(
              '.sidebar-link[data-target="' + id + '"]',
            );
            if (link) link.classList.add("active");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
    );
    document.querySelectorAll(".card[id]").forEach(function (c) {
      observer.observe(c);
    });
  }
})();
