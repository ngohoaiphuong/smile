$(document).ready(() => {
  const $form = $('.checkout-form');
  const $phone = $('.phone-input');

  $form.removeInputMasksAfterParsleyValidatesSuccessfully();

  $('form').parsley({
    errorsContainer(parsleyField) {
      const $errBlock = $('<div>').addClass('errors');
      parsleyField.$element.parents('.field-container').after($errBlock);
      return $errBlock;
    },
  });

  const $error = $('.errorlist').eq(0);
  if ($error.length) {
    // Wait for the form to slide down after the previously entered fields are programmatically refilled.
    sdc.utils.scrollTo($error, 200);
  }

  window.PersistingAttributesDataManager.assign($form.get(0), {
    afterSet() {
      // Call field-specific functions after value is set to avoid conflicts
      $phone.setUpPhoneField();
    },
  });
});
