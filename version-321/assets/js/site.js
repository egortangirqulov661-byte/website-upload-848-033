(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var type = scope.querySelector("[data-filter-type]");
            var region = scope.querySelector("[data-filter-region]");
            var year = scope.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-card, .rank-item"));
            if (!cards.length) {
                return;
            }

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function apply() {
                var q = normalize(input && input.value);
                var typeValue = type ? type.value : "";
                var regionValue = region ? region.value : "";
                var yearValue = year ? year.value : "";
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-search"));
                    var cardType = card.getAttribute("data-type") || "";
                    var cardRegion = card.getAttribute("data-region") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var matched = true;
                    if (q && text.indexOf(q) === -1) {
                        matched = false;
                    }
                    if (typeValue && cardType !== typeValue) {
                        matched = false;
                    }
                    if (regionValue && cardRegion !== regionValue) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    card.classList.toggle("hidden-card", !matched);
                });
            }

            [input, type, region, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-player-button]");
            if (!video || !button) {
                return;
            }
            var src = video.getAttribute("data-m3u8");
            var loaded = false;
            var hls = null;

            function loadVideo() {
                if (loaded || !src) {
                    return;
                }
                loaded = true;
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                } else {
                    video.src = src;
                }
            }

            function play() {
                loadVideo();
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            }

            button.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
            video.addEventListener("pause", function () {
                player.classList.remove("is-playing");
            });
            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    }
})();
