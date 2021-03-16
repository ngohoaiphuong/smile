(function() {
  if (! window.gettext) {
    // if gettext isn't available, make it a simple identity function
    window.gettext = function (text) {
      return text;
    };
  }

  $(document).ready(function () {
    var $postalCode = $("input[name='postal_code']");
    $postalCode.setUpCustomField('postalCode', sdc.postalCodeErrorMessage);

    var $phone = $("input[name='phone']");
    $phone.setUpPhoneField();

    var $why_straighten = $('#why_straighten');
    var $why_straighten_other = $('.why-straighten-other');
    $why_straighten.on('change', function () {
      $why_straighten_other.css('display', $why_straighten.val() === 'other' ? 'block' : 'none');
    });
  });

  function step1() {
    var deferred = jQuery.Deferred();
    loader.on(window.gettext('Hang On…'));

    setTimeout(function () {
      loader.changeMessage(window.gettext('We\'re Grading Your Tooth Test'));
      deferred.resolve();
    }, 1400)

    return deferred.promise();
  }

  function step2() {
    var deferred = jQuery.Deferred();

    setTimeout(function () {
      jQuery("#sa-form")[0].submit();
      deferred.resolve();
    }, 1400)
  }

  jQuery('#sa-form').on('submit', function (e) {
    e.preventDefault();

    window.Parsley.addValidator('isValidCheckoutEmail', function (value) {
      return value.endsWith('smiledirectclub.com') ? false : true;
    }).addMessage('en', 'isValidCheckoutEmail', 'Please use an email that is not part of the Smile Direct Club domain.');

    var parsley = jQuery(this).parsley();

    if (parsley.isValid()) {
      step1().then(step2);
    }
  });

  window.PersistingAttributesDataManager.init();
})();
