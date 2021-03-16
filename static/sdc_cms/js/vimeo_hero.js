function VimeoHeroVideoPluginController($videoContainer) {
  this.$videoContainer = $videoContainer;
  this.$placeholder = $videoContainer.siblings();
  this.videoId = parseInt($videoContainer.attr("data-video-id"));
  this.player = new Vimeo.Player($videoContainer.find("iframe")[0], {
    responsive: true
  });
  this.player.on("ended", this.onPlaybackEnd.bind(this));
  this.$ready = Promise.all([
    this.player.getVideoHeight(),
    this.player.getVideoWidth()
  ]).then(([height, width]) => {
    this.height = height;
    this.width = width;
    this._whenDimensionsReady();
  });
}

VimeoHeroVideoPluginController.prototype._whenDimensionsReady = function() {
  const ratio = (this.height / this.width) * 100,
    pd = `${ratio}vw 0 0 0`;
  this.$videoContainer.css("padding", pd);
};

VimeoHeroVideoPluginController.prototype.onPlaybackEnd = function() {
  this.$placeholder.removeClass("hidden");
  this.$videoContainer.addClass("hidden");
  this.player.loadVideo(this.videoId);
};

VimeoHeroVideoPluginController.prototype.onPlaybackStart = function(e) {
  e.preventDefault();
  this.$placeholder.addClass("hidden");
  this.$videoContainer.removeClass("hidden");
  this.player.play();
};

(function() {
  if (typeof CMS !== "undefined" && CMS) {
    if ($ && CMS.$) {
      CMS.$(window).on("cms-content-refresh", connectActivators);
    }
  }
  $(document).ready(connectActivators);
  function connectActivators() {
    const activators = $('[data-type="sdc-video"]'),
      targets = {};
    activators.map(function(_, handler) {
      let target = handler.attributes["data-target"].value;
      if (!targets[target]) {
        let $videoContainer = $(`.${target}`);
        targets[target] = new VimeoHeroVideoPluginController($videoContainer);
      }
    });
    activators.on("click", function($event) {
      targets[this.attributes["data-target"].value].onPlaybackStart($event);
    });
  }
})();
