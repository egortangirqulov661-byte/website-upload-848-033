(function () {
    const navButton = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navButton && mobileMenu) {
        navButton.addEventListener('click', function () {
            const expanded = navButton.getAttribute('aria-expanded') === 'true';
            navButton.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let activeIndex = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, position) {
            slide.classList.toggle('is-active', position === activeIndex);
        });

        dots.forEach(function (dot, position) {
            dot.classList.toggle('is-active', position === activeIndex);
        });
    }

    function moveSlide(step) {
        showSlide(activeIndex + step);
    }

    function startTimer() {
        if (slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            moveSlide(1);
        }, 5200);
    }

    function resetTimer() {
        if (timer) {
            window.clearInterval(timer);
        }
        startTimer();
    }

    if (slides.length) {
        showSlide(0);
        startTimer();
    }

    if (prev) {
        prev.addEventListener('click', function () {
            moveSlide(-1);
            resetTimer();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            moveSlide(1);
            resetTimer();
        });
    }

    dots.forEach(function (dot, position) {
        dot.addEventListener('click', function () {
            showSlide(position);
            resetTimer();
        });
    });

    const searchBox = document.querySelector('[data-search-box]');
    const yearFilter = document.querySelector('[data-year-filter]');
    const regionFilter = document.querySelector('[data-region-filter]');
    const typeFilter = document.querySelector('[data-type-filter]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        const keyword = normalize(searchBox ? searchBox.value : '');
        const year = normalize(yearFilter ? yearFilter.value : '');
        const region = normalize(regionFilter ? regionFilter.value : '');
        const type = normalize(typeFilter ? typeFilter.value : '');
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.dataset.text);
            const cardYear = normalize(card.dataset.year);
            const cardRegion = normalize(card.dataset.region);
            const cardType = normalize(card.dataset.type);
            const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            const matchedYear = !year || cardYear === year;
            const matchedRegion = !region || cardRegion.indexOf(region) !== -1;
            const matchedType = !type || cardType.indexOf(type) !== -1;
            const matched = matchedKeyword && matchedYear && matchedRegion && matchedType;

            card.classList.toggle('is-hidden-card', !matched);

            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    [searchBox, yearFilter, regionFilter, typeFilter].forEach(function (element) {
        if (element) {
            element.addEventListener('input', applyFilters);
            element.addEventListener('change', applyFilters);
        }
    });
})();
