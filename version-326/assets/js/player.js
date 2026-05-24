(function () {
  var shells = Array.prototype.slice.call(document.querySelectorAll("[data-hls-player]"));

  shells.forEach(function (shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".player-play");

    if (!video || !button) {
      return;
    }

    var source = video.getAttribute("data-src");
    var loaded = false;

    function loadSource() {
      if (loaded || !source) {
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      loadSource();
      shell.classList.add("is-playing");

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          shell.classList.remove("is-playing");
        });
      }
    }

    button.addEventListener("click", playVideo);

    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener("play", function () {
      shell.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      shell.classList.remove("is-playing");
    });
  });
})();
