import OktaSignInWidget from './okta_widget';

var NavCtrl;
$(window).on('load', function () {
  var $window = $(window);
  var $authPopover = $('.popover.auth-popover');
  var $navUser = $('a.nav-user');
  var $stickyDesktopNav = $('.desktop-navbar.sticky');
  var $firstSection = $('.first-section');

  var stickyDesktopNavHeight = $stickyDesktopNav.outerHeight();
  var firstSectionHeight;
  var revealStickyNavWhenScrollReachesHere;

  if ($firstSection.length) {
    measureFirstSection();
    // could use timeouts here if this creates performance issues
    $window.on('scroll', handleScroll);
    $window.on('resize', measureFirstSection);
  }

  var $stickyNavs = $('.v3-navbar.sticky');

  // handle "collapsing" of navbar
  function handleScroll() {
    var currentScroll = window.scrollY || window.pageYOffset; // IE fix
    if (currentScroll > revealStickyNavWhenScrollReachesHere) {
      $stickyNavs.addClass('stuck');
    } else {
      if ($stickyNavs.hasClass('stuck')) {
        $('.patient-portal-nav-desktop .dropdown').removeClass('open');
      }
      $stickyNavs.removeClass('stuck');
    }
  }

  function measureFirstSection() {
    firstSectionHeight = $firstSection.outerHeight();
    revealStickyNavWhenScrollReachesHere = firstSectionHeight - stickyDesktopNavHeight;
  }

  // return necessary function for use in template onclick= attributes
  var ctrl = {};
  ctrl.toggleShowAuthPopup = function () {
    $authPopover.toggleClass('in');
    $navUser.toggleClass('selected');
  };

  // dismiss popover when user clicks outside of it
  $('body').on('click', function (e) {
    var $target = $(e.target);

    var userRequestedThePopover = $navUser.toArray().reduce(function (acc, elem) {
      var $elem = $(elem);
      var userClickedTheNavUserIcon = $elem[0] === $target[0];
      var userClickedChildOfNavUserIcon = $.contains($elem[0], $target[0]);
      return acc || userClickedTheNavUserIcon || userClickedChildOfNavUserIcon;
    }, false);

    var userClickedWithinPopover = $target.hasClass('.popover.in') || $target.parents('.popover.in').length;

    if (!(userRequestedThePopover || userClickedWithinPopover)) {
      $('.popover.auth-popover').removeClass('in');
      $navUser.removeClass('selected');
    }
  });

  if (typeof (oktaWidgetConfigGlobal) != "undefined" &&
    typeof (oktaWidgetConfigGlobal.isOktaWidgetEnabled) != "undefined" &&
    oktaWidgetConfigGlobal.isOktaWidgetEnabled) {

    $('.logout-link').on('click', function (e) {
      // end session and logout
      e.preventDefault();
      var href = $(e.target).data('href');
      let oktaWidget = new OktaSignInWidget(oktaWidgetConfigGlobal, i18nLangDef);
      oktaWidget.closeSession(href);
    });

  }

  NavCtrl = ctrl;
});
