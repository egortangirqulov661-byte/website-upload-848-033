(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-page-search]"));
  var yearFilters = Array.prototype.slice.call(document.querySelectorAll("[data-year-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

  function matchYear(cardYear, selected) {
    var year = parseInt(cardYear || "0", 10);

    if (!selected) {
      return true;
    }

    if (selected === "2026") {
      return year >= 2026;
    }

    if (selected === "2022") {
      return year <= 2022;
    }

    return String(year) === selected;
  }

  function applyFilter() {
    var query = "";
    var selectedYear = "";

    searchInputs.forEach(function (input) {
      if (input.value.trim()) {
        query = input.value.trim().toLowerCase();
      }
    });

    yearFilters.forEach(function (select) {
      if (select.value) {
        selectedYear = select.value;
      }
    });

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-tags") || "",
        card.getAttribute("data-year") || ""
      ].join(" ").toLowerCase();

      var ok = (!query || text.indexOf(query) !== -1) && matchYear(card.getAttribute("data-year"), selectedYear);
      card.classList.toggle("is-hidden", !ok);
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener("input", applyFilter);
  });

  yearFilters.forEach(function (select) {
    select.addEventListener("change", applyFilter);
  });
})();
