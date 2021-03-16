(function () {
  var ArrayUtils = {
    includes: function (arr, el) {
      return arr.indexOf(el) !== -1;
    },
    includesTerm: function (arr, term) {
      return arr.some(function (el) {
        return el.indexOf(term) > -1;
      })
    }
  };
  var marker = null;

  function getMarker() {
    marker = new Mark(document.querySelectorAll('.faq-search-success'));
  }

  function hideFilteredResultsDiv() {
    let filteredResultsDiv = $('.filtered-results');
    filteredResultsDiv.text('');
    filteredResultsDiv.addClass('hidden');
  }

  function resetCategories() {
    let categories = $('.faqs-category');
    let categoryLinks = $('.category-link');
    categories.removeClass('hidden');
    categoryLinks.removeClass('disabled');
  }

  function resetQuestions() {
    let questions = $('.question');
    questions.removeClass('faq-search-success');
    questions.removeClass('hidden');
  }

  function resetSearch() {
    if (marker) {
      marker.unmark();
      marker = null;
    }
    hideFilteredResultsDiv();
    resetQuestions();
    resetCategories();
    $('svg.search-icon').removeClass('hidden');
    $('svg.search-close').addClass('hidden');
  }

  function markFoundTerms(foundTerms) {
    getMarker();
    foundTerms.forEach(function (item) {
      marker.mark(item);
    })
  }

  function searchQuestions() {
    let foundTerms = {};
    let value = $('.faq-search-box').val();
    resetSearch();
    if (value !== "") {
      updateSearchState(value);
      let values = value.trim().replace(/,/g, '').toLowerCase().split(' ');
      let questions = $('.question');
      resetSearch();
      let questionsFound = {};
      questions.each(function () {
        let currentQuestion = $(this)[0];
        let searchSuccessCount = 0;
        let words = currentQuestion.getAttribute('data-words').split(' ');
        values.forEach(function (term) {
          // .includes is not supported by IE
          if (ArrayUtils.includesTerm(words, term)) {
            $(currentQuestion).addClass('faq-search-success');
            searchSuccessCount++;
            if (!foundTerms[term]) foundTerms[term] = 1;
            else foundTerms[term]++;
          }
        });
        if (searchSuccessCount)
          questionsFound[currentQuestion.id] = searchSuccessCount;
      });

      showFilteredResultsDiv(Object.keys(questionsFound).length);
      showOnlySearchResults();
      markFoundTerms(Object.keys(foundTerms));
    }
  }

  function setUpCategoryMenu() {
    let categoryLinks = $('.category-link');
    categoryLinks.click(function (e) {
      e.preventDefault();
      $(this).addClass('active');
      $(this).siblings().removeClass('active');
      $('html, body').animate({
        scrollTop: $($(e.target).attr("href")).offset().top
      }, 250);
    });
  }

  function setUpSearchData() {
    let questions = $('.question');
    questions.each(function () {
      let currentQuestion = $(this)[0];
      let words = currentQuestion
        .innerText
        .replace(/[,\.\-\?\!]/g, '')
        .replace(/\n/g, ' ')
        .toLowerCase();
      currentQuestion.setAttribute('data-words', words);
    });
  }

  function setUpSearchEvents() {
    let search = $(".faq-search");
    let searchInput = $('.faq-search-box');
    searchInput.keypress(function( event ) {
      if ( event.which === 13 ) {
        // Call this here to clear search param on enter without doing so for page load and empty searches
        updateSearchState();
        searchQuestions();
      }
    });
    search.find('svg.search-close').click(function() {
      searchInput.val('');
      searchQuestions();
      updateSearchState();
    });
    search.find('svg.search-icon').click(function() {
      searchQuestions();
    });
  }

  function showFilteredResultsDiv(searchSuccessCount) {
    let filteredResultsDiv = $('.filtered-results');
    filteredResultsDiv.text(searchSuccessCount + ' filtered result(s) shown');
    filteredResultsDiv.removeClass('hidden');
  }

  function showOnlySearchResults() {
    let questions = $('.question');
    let categories = $('.faqs-category');

    questions.find('.faq-search-success').removeClass('hidden');
    questions.not('.faq-search-success').addClass('hidden');
    categories.each(function() {
      let category = $(this);
      let questionCount = category.find('.question').length;
      let hiddenQuestionCount = category.find('.question.hidden').length;
      if (questionCount === hiddenQuestionCount) {
        $(this).addClass('hidden');
        let categoryLinkId = '#' + category.attr('id') + '-link';
        let categoryLink = $('.faqs-category-list').find(categoryLinkId);

        categoryLink.addClass('disabled');
      }
    });
    $('svg.search-icon').addClass('hidden');
    $('svg.search-close').removeClass('hidden');
  }

  function updateSearchState(value) {
    // Default params are not supported by IE
    if (typeof value === 'undefined') value = '';
    let currentQuery = window.location.search;
    let queryArray = currentQuery.substring(1).split('&');

    queryArray.forEach(function (item, index, object) {
      let key = item.split('=')[0];
      if (key === 'search') {
        object.splice(index, 1);
      }
    });

    if (value !== '') {
      let newSearch = 'search=' + value;
      queryArray.push(newSearch);
    }
    let newQuery = '?' + queryArray.join('&');

    window.history.replaceState({'search': value}, '', newQuery);
  }

  $(function() {
    setUpCategoryMenu();
    setUpSearchData();
    setUpSearchEvents();
    searchQuestions();
  });
})();
