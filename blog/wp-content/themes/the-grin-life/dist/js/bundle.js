/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var $win = $(window);
var $doc = $(document);
var $body = $('body');
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var classes = {
  IsTouch: 'is-touch'
};

var is = {
  IsTouch: false
};

if (isSafari && iOS) {
  $('html').addClass('ios');
}

initSearchFunctionality();
loadMorePosts();
getDeviceWidthAndIsToch();

$('.btn-scroll-to-top').on('click', function () {
  $('html, body').animate({
    scrollTop: 0
  }, 800);
  return false;
});

$('.nav-trigger').on('click', function (event) {
  event.preventDefault();
  $(this).toggleClass('active');
  $body.toggleClass('has-open-nav');
});

$('.menu-item-has-children').on('click', function (event) {
  if ($(this).hasClass('open')) {
    $(this).removeClass('open');
  } else {
    $('.open').removeClass('open');
    $(this).addClass('open');
  }
});

$('.post-single .post__body table tr').each(function () {
  var $tr = $(this);
  var $th = $tr.closest('table').find('th');

  $tr.find('td').each(function (i) {
    $(this).attr('data-title', $th.eq(i).text());
  });
});

$win.on('scroll', function () {
  var scrollTop = $(this).scrollTop();

  if (scrollTop > 100) {
    $('.btn-scroll-to-top').addClass('show-btn');
  } else {
    $('.btn-scroll-to-top').removeClass('show-btn');
  }

  if (scrollTop > 30) {
    $('.header').addClass('header-fixed');
  } else {
    $('.header').removeClass('header-fixed');
  }
});

$win.on('load', function () {
  $('body').css('padding-top', $('.header').outerHeight());
});

$win.on('resize orientationchange', function () {
  getDeviceWidthAndIsToch();
});

function initSearchFunctionality() {
  $('.btn--search').on('click touchstart', function (event) {
    event.preventDefault();
    $body.addClass('has-open-search');
    $('.search-wrapper .search__field').focus();
    setTimeout(function () {}, 100);
  });

  $('.btn-close-search').on('click', function (event) {
    event.preventDefault();
    $body.removeClass('has-open-search');
  });
}

function getDeviceWidthAndIsToch() {
  is.Desktop = $win.width() > 1024 ? true : false;
  is.Tablet = $win.width() <= 1024 && $win.width() ? true : false;
  is.Mobile = $win.width() <= 767 ? true : false;
  is.Touch = 'ontouchstart' in window ? true : false;

  $body.toggleClass(classes.IsTouch, is.Touch || $win.width() <= 1024);
}

function loadMorePosts() {
  var containerSelector = '.section-posts.section-posts--blog';
  var postsContainerSelector = containerSelector + ' ul.posts';
  var paginationSelector = '.section__actions';
  var $container = $(containerSelector);
  var is_ajax = false;

  $container.on('click', paginationSelector + ' a', function (e) {
    e.preventDefault();

    if (!is_ajax) {
      $.ajax({
        url: $(this).attr('href'),
        type: 'GET',
        beforeSend: function beforeSend() {
          is_ajax = true;
          $container.find('ul.posts').addClass('ajax-loading');
        },
        complete: function complete(response) {
          var $response = $(response.responseText);
          var $newPosts = $response.find(postsContainerSelector);

          if ($newPosts) {
            $container.find('ul.posts').append($newPosts.html());
            var $newMoreLink = $response.find(paginationSelector);

            if ($newMoreLink) {
              $container.find(paginationSelector).html($newMoreLink.html());
            } else {
              $container.find(paginationSelector).remove();
            }
          } else {
            $container.find(paginationSelector).remove();
          }

          $container.find('ul.posts').removeClass('ajax-loading');
          is_ajax = false;
        }
      });
    }
  });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map