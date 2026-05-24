(function () {
    const mobileButton = document.querySelector('[data-mobile-menu-button]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let slideIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        slideIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
            slide.classList.toggle('active', current === slideIndex);
        });
        dots.forEach(function (dot, current) {
            dot.classList.toggle('active', current === slideIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(slideIndex + 1);
        }, 5200);
    }

    function filterCards(input) {
        const target = input.getAttribute('data-search-target') || '#movie-grid';
        const grid = document.querySelector(target);
        const empty = document.querySelector(input.getAttribute('data-empty-target') || '[data-empty-state]');
        if (!grid) {
            return;
        }
        const keyword = input.value.trim().toLowerCase();
        const cards = Array.from(grid.querySelectorAll('[data-movie-card]'));
        let visible = 0;
        cards.forEach(function (card) {
            const value = (card.getAttribute('data-search-text') || '').toLowerCase();
            const matched = !keyword || value.indexOf(keyword) !== -1;
            card.classList.toggle('card-hidden', !matched);
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    Array.from(document.querySelectorAll('[data-search-input]')).forEach(function (input) {
        input.addEventListener('input', function () {
            filterCards(input);
        });
    });
})();
