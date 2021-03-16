function VimeoHeroVideo($videoContainer, $placeholder, videoId) {
  this.$videoContainer = $videoContainer;
  this.$placeholder = $placeholder;
  this.$extraPlayButtons = $('.vimeo-hero-video-play-btn');
  this.videoId = videoId;
  this.player = new Vimeo.Player($videoContainer.find('iframe')[0], {
    responsive: true
  });
}

VimeoHeroVideo.prototype.init = function() {
  this.$placeholder.add(
    this.$placeholder.next('.white-section')
  ).find('a.btn').add(
    this.$extraPlayButtons
  ).on('click', this.onPlaybackStart.bind(this));
  this.player.on('ended', this.onPlaybackEnd.bind(this));
  return this;
};

VimeoHeroVideo.prototype.onPlaybackEnd = function() {
  this.$placeholder.add(this.$extraPlayButtons).removeClass('hidden');
  this.$videoContainer.addClass('hidden');
  this.player.loadVideo(this.videoId);
};

VimeoHeroVideo.prototype.onPlaybackStart = function(e) {
  e.preventDefault();
  this.$placeholder.add(this.$extraPlayButtons).addClass('hidden');
  this.$videoContainer.removeClass('hidden');
  this.player.play();
};
