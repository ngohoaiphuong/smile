var loader = (function() {
  var messageFadeTime = 0.3; // seconds
  var $wrapper = $('.loader-wrapper');
  var $message = $('.loader-message');
  var $spinner = $('.loader-spinner');
  var $window = $(window);

  function Loader() {
    this.on = function(message) {
      if (message) {
        $message.text(message);
      }
      $wrapper.removeClass('hidden');
      centerContent();
      $window.on('resize', function() {
        centerContent();
      });
    };

    this.off = function() {
      $wrapper.addClass('hidden');
    };

    this.changeMessage = function(message) {
      $message.css('opacity', '0');
      setTimeout(function(){
        $message.text(message);
        recenterMessage();
        $message.css('opacity', '1');
      }, messageFadeTime * 1000);
    };
  }

  function centerContent() {
    recenterMessage();
    centerSpinner();
  }

  function recenterMessage() {
    var leftPosition = ($window.width() - $message.width()) / 2;
    $message.css('left', leftPosition + 'px');
  }

  function centerSpinner() {
    var leftPosition = ($window.width() - $spinner.width()) / 2;
    $spinner.css('left', leftPosition + 'px');
  }

  $message.css('transition', 'opacity ' + messageFadeTime + 's ease');

  return new Loader();
})();
