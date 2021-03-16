
(function() {
  var $form = $('form');
  var $isPolicyholder = $('#is-policyholder-btn');
  var $notPolicyholder = $('#not-policyholder-btn');
  var $policyholderCheckbox = $("input[name='is_policyholder']").get(0);
  var $isPatient = $('#is-patient-btn');
  var $notPatient = $('#not-patient-btn');
  var $patientCheckbox = $("input[name='is_patient']").get(0);
  var $leadUuidField = $("input[name='lead_uuid']");

  var $contactPhone = $("input[name='contact_phone']");
  var $contactEmail = $("input[name='contact_email']");

  var $policyholderDobMonth = $("input[name='policyholder_dob_month']");
  var $policyholderDobDay = $("input[name='policyholder_dob_day']");
  var $policyholderDobYear = $("input[name='policyholder_dob_year']");

  var $patientDobMonth = $("input[name='patient_dob_month']");
  var $patientDobDay = $("input[name='patient_dob_day']");
  var $patientDobYear = $("input[name='patient_dob_year']");

  var $policyholderZip = $("input[name='policyholder_zip_code']");
  var $patientZip = $("input[name='patient_zip_code']");

  var insuranceSelector = $("select[name='insurance_provider']");
  var $policyNumberInput = $("input[name='policy_number']");
  var $otherInsurance = $('#other-insurance-name');
  var $otherInsuranceInput = $otherInsurance.find('input');
  var $groupNumber = $('#group-number');
  var $groupNumberField = $groupNumber.find('input');
  var $insurancePhone = $("input[name='insurance_phone']");

  var $policyholderSection = $('.policyholder-info, .you-or-someone-else');
  var $policyholderFields = $('.policyholder-info :input');
  var $providerSection = $('.insurance-provider-info, .insurance-submit-button');
  var $providerFields = $providerSection.find('input').not($otherInsuranceInput).not($groupNumberField);
  var $patientAndProviderSection = $('.patient-info, .insurance-provider-info, .insurance-submit-button');
  var $patientAndProviderFields = $patientAndProviderSection.find('input').not($otherInsuranceInput).not($groupNumberField).not($policyNumberInput);
  var parsleyReqAttributes = {
    'data-parsley-required': 'true'
  };
  // Persisting attributes field sets
  var $patientPAFields = $patientAndProviderSection.find('[data-pa]');
  var $policyholderPAFields = $policyholderFields.filter('[data-pa]');

  // setup inputmasks on fields
  $contactPhone.setUpPhoneField();
  $insurancePhone.setUpPhoneField();
  $policyholderDobMonth.setUpCustomField('month', gettext('Please enter valid date of month in MM format.'));
  $policyholderDobDay.setUpCustomField('day', gettext('Please enter valid date of day in DD format.'));
  $policyholderDobYear.setUpCustomField('year', gettext('Please enter valid date of year in YYYY format.'));
  $patientDobMonth.setUpCustomField('month', gettext('Please enter valid date of month in MM format.'));
  $patientDobDay.setUpCustomField('day', gettext('Please enter valid date of day in DD format.'));
  $patientDobYear.setUpCustomField('year', gettext('Please enter valid date of year in YYYY format.'));
  $policyholderZip.setUpCustomField('postalCode', sdc.postalCodeErrorMessage);
  $patientZip.setUpCustomField('postalCode', sdc.postalCodeErrorMessage);


  function addRequiredField($showElement) {
    $showElement.fadeIn('slow');
    $showElement.find('input').attr(parsleyReqAttributes);
  };

    function removeRequiredField($hideElement) {
    $hideElement.hide();
    $hideElement.find('input').removeAttr('data-parsley-required data-parsley-required-message');
  };

  /**
   * Makes 2 buttons function like boolean input, shows/hides dependent fields and updates required form fields
   * @param $onElement - selected button
   * @param $offElement - boolean pair with $onElement.  When $onElement is clicked, $offElement is 'unselected'.
   * @param $formElement - corresponds to a hidden checkbox in the form
   * @param checkedValue - true or false, the expected value of the checkbox when $onElement is clicked
   * @param $showSection - section of form to unhide
   * @param $requiredFields - fields to add parsley required attributes to
   * @param $hideSection - section to hide and remove required attributes from all inputs
   * @param submitLead - whether to submit Lead on click--really only used on the policyholder/dependent buttons
   */
  function boolSwitch($onElement, $offElement, $formElement, checkedValue, $showSection, $requiredFields, $hideSection,
                      submitLead) {
    $onElement.click(function() {
      // validate contact fields (phone and email) before taking any action
      var validateFields = $('#insurance-form-id').parsley().validate('lead-fields');
      if (validateFields) {
        var $this = $(this);
        $this.addClass('btn-selected');
        if ($offElement.hasClass('btn-selected')) {
          $offElement.removeClass('btn-selected');
          $hideSection.find('input').removeAttr('data-parsley-required data-parsley-required-message');
          $hideSection.hide();
        }
        if($leadUuidField.val()) {
          $formElement.checked = checkedValue;
          $showSection.fadeIn('slow');
          $requiredFields.attr(parsleyReqAttributes);
        }

        // if Lead has not been submitted, submit lead on click
        if (submitLead && !$leadUuidField.val()) {
          $.post({
            url: createLeadUrl,
            data: {
              'phone': $contactPhone.val(),
              'email': $contactEmail.val(),
            }
          })
          .done(function(response) {
            $('#id_contact_email').parsley().destroy();
            $leadUuidField.val(response.lead_uuid);
            $formElement.checked = checkedValue;
            $showSection.fadeIn('slow');
            $requiredFields.attr(parsleyReqAttributes);
          })
          .fail(function(xhr, errmsg, err) {
            $('#id_contact_email').parsley().destroy();
            $('#id_contact_email').parsley().addError('data-parsley-error-message', {message: "This value should be a valid email."});
            $formElement.checked = checkedValue;
            $showSection.fadeOut('slow');
          });
        }
      }
    });
  }

  // 'Policyholder' and 'Dependent' buttons
  boolSwitch($isPolicyholder, $notPolicyholder, $policyholderCheckbox, true, $policyholderSection, $policyholderFields,
    $patientAndProviderSection, true);
  boolSwitch($notPolicyholder, $isPolicyholder, $policyholderCheckbox, false, $patientAndProviderSection,
    $patientAndProviderFields, $policyholderSection, true);

  // 'Someone Else' and 'Myself' buttons
  boolSwitch($isPatient, $notPatient, $patientCheckbox, true, $providerSection, $providerFields,
    $patientAndProviderSection);
  boolSwitch($notPatient, $isPatient, $patientCheckbox, false, $patientAndProviderSection, $patientAndProviderFields,
    $providerSection);

  // On selecting insurance provider, show help text and update required fields
  insuranceSelector.change(function () {
    var insuranceId = insuranceSelector.val()

    //- check if Id exists, in case of selecting empty value in list
    if (insuranceId) {
      var getInsuranceUrl = getInsuranceEndpoint.replace('999', insuranceId);

      $.get(getInsuranceUrl)
        .done(function (insuranceCompanyObject) {
          //- conditionally show/hide fields for 'OTHER' insurance
          if (insuranceCompanyObject.name === 'OTHER') {
            addRequiredField($otherInsurance);
          } else {
            removeRequiredField($otherInsurance);
          }

          //- conditionally show/hide fields for 'MetLife' insurance
          if (insuranceCompanyObject.name === 'MetLife') {
            addRequiredField($groupNumber);
            $policyNumberInput.removeAttr('data-parsley-required data-parsley-required-message');
          } else {
            removeRequiredField($groupNumber);
            $policyNumberInput.attr(parsleyReqAttributes);
          }

          $('#policy-num-help-text').text(insuranceCompanyObject.policy_num_help_text);
        })
        .fail(function (error) {
          console.log(error);
        });
    }
  });

  // On load, check which insurance provider is selected and apply appropriate logic to fields
  if (insuranceSelector.find(':selected').text() === 'OTHER') {
    addRequiredField($otherInsurance);
    removeRequiredField($groupNumber);
  }

  if (insuranceSelector.find(':selected').text() === 'MetLife') {
    addRequiredField($groupNumber);
    removeRequiredField($otherInsurance);
    $policyNumberInput.removeAttr('data-parsley-required data-parsley-required-message');
  } else {
    //- Add required attributes to Policy Number field, which is required in all instances except for MetLife
    $policyNumberInput.attr(parsleyReqAttributes);
  }

   // prevent multiple submissions on form submit, but only after parsley validation
  $('#insurance-form-id').on('submit', function() {
    var $this = $(this);
    if ($this.parsley().validate()) {
      $this.find('button[type="submit"]').attr('disabled', 'disabled');
    }
  });

  $form.parsley({errorsContainer: function(parsleyField) {
    var $errBlock = $('<div>').addClass('errors');
    parsleyField.$element.parents('.field-container').after($errBlock);
    return $errBlock;
  }});

  window.PersistingAttributesDataManager.assign($form.get(0), {
    afterSet: function() {
      $contactPhone.setUpPhoneField();
    },
  });

  // Block store on submit for "Patient information" persisting attributes fields
  // Unblock store on submit for "Policyholder information" persisting attributes fields
  $isPolicyholder.on('click', function() {
    var i;
    var field;
    for (i = 0; i < $patientPAFields.length; i += 1) {
      field = $patientPAFields[i];
      window.PersistingAttributesDataManager.addNoStore(field);
    }
    for (i = 0; i < $policyholderPAFields.length; i += 1) {
      field = $policyholderPAFields[i];
      window.PersistingAttributesDataManager.removeNoStore(field);
    }
  });

  // Block store on submit for "Policyholder information" persisting attributes fields
  // Unblock store on submit for "Patient information" persisting attributes fields
  // Set values for "Patient information" fields
  $notPolicyholder.on('click', function() {
    var i;
    var field;
    for (i = 0; i < $patientPAFields.length; i += 1) {
      field = $patientPAFields[i];
      window.PersistingAttributesDataManager.removeNoSet(field);
      window.PersistingAttributesDataManager.removeNoStore(field);
    }
    for (i = 0; i < $policyholderPAFields.length; i += 1) {
      field = $policyholderPAFields[i];
      window.PersistingAttributesDataManager.addNoStore(field);
    }
    window.PersistingAttributesDataManager.setAttributes($form.get(0));
  });
})();
