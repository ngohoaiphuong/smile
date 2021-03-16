(function () {
  var $payPalButtonContainer = $('#paypal-button-container');
  var $paypalAuth = $('input[name="paypal_authorization"]');
  var paypalEnabled = $paypalAuth.length && $payPalButtonContainer.length;

  if (paypalEnabled) {
    paypal.Buttons({
      createOrder: function (data, actions) {
        var $email = $('input[name="email"]');
        var $firstName = $('input[name="first_name"]');
        var $lastName = $('input[name="last_name"]');
        var $address1 = $('input[name="address_1"]');
        var $address2 = $('input[name="address_2"]');
        var $state = $('select[name="state"]');
        var $city = $('input[name="city"]');
        var $postalCode = $('input[name="postal_code"]');
        var $countryCode = $('input[name="shipping_country_code"]');
        var $amount = $('input[name="paypal_authorization"]');

        return actions.order.create({
          purchase_units: [{
            amount: {
              value: $amount.attr('data-payment-amount'),
            },
          }],
          payer: {
            name: {
              given_name: $firstName.val(),
              surname: $lastName.val(),
            },
            email: $email.val(),
            address: {
              address_line_1: $address1.val(),
              address_line_2: $address2.val(),
              admin_area_1: $state.val(),
              admin_area_2: $city.val(),
              postal_code: $postalCode.val(),
              country_code: $countryCode.val(),
            },
          },
        });
      },
      onApprove: function (data, actions) {
        $payPalButtonContainer.addClass('disabled-overlay');
        return actions.order.authorize()
          .then(function (details) {
            $paypalAuth.val(details.purchase_units[0].payments.authorizations[0].id);
            $paypalAuth.trigger('change');
          })
          .catch(() => {
            $payPalButtonContainer.removeClass('disabled-overlay');
          });
      },
    }).render('#paypal-button-container');
  }
}());
