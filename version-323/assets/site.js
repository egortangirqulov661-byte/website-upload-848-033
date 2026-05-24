(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });
        show(0);
        restart();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function setupSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var pills = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
        if (!inputs.length || !cards.length) {
            return;
        }
        var activeFilter = '';

        function apply() {
            var query = normalize(inputs[0].value);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type')
                ].join(' '));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchFilter = !activeFilter || haystack.indexOf(normalize(activeFilter)) !== -1;
                var showCard = matchQuery && matchFilter;
                card.classList.toggle('is-filtered-out', !showCard);
                if (showCard) {
                    visible += 1;
                }
            });
            updateNoResult(visible);
        }

        function updateNoResult(visible) {
            var grid = document.querySelector('.category-movie-grid') || document.querySelector('.rank-list') || document.querySelector('.movie-grid');
            var existing = document.querySelector('[data-no-result]');
            if (visible === 0 && grid && !existing) {
                var node = document.createElement('div');
                node.className = 'no-result';
                node.setAttribute('data-no-result', 'true');
                node.textContent = '没有找到匹配的影片';
                grid.appendChild(node);
            } else if (visible > 0 && existing) {
                existing.remove();
            }
        }

        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                apply();
            });
        });

        pills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                pills.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                pill.classList.add('is-active');
                activeFilter = pill.getAttribute('data-filter-value') || '';
                apply();
            });
        });
    }

    function setupScrollPlay() {
        var link = document.querySelector('[data-scroll-play]');
        var overlay = document.querySelector('[data-play-overlay]');
        if (!link || !overlay) {
            return;
        }
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var player = document.querySelector('[data-player-root]');
            if (player) {
                player.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(function () {
                overlay.click();
            }, 260);
        });
    }

    window.initMoviePlayer = function (source) {
        var root = document.querySelector('[data-player-root]');
        if (!root) {
            return;
        }
        var video = root.querySelector('video');
        var overlay = root.querySelector('[data-play-overlay]');
        if (!video || !overlay || !source) {
            return;
        }
        var hlsInstance = null;
        var attached = false;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            attach();
            overlay.classList.add('is-hidden');
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    overlay.classList.remove('is-hidden');
                });
            }
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                overlay.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupSearch();
        setupScrollPlay();
    });
})();
