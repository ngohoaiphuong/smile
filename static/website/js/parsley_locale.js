if (! gettext) {
  throw Error('gettext is required to retrieve localized parsley errors');
}

if (! Parsley) {
  throw Error('Parsley is required to set validation messages');
}

/*
As part of our i18n effort, we will utilize the django gettext function
to localize parsley values.
*/


Parsley.addMessages('local', {
  defaultMessage: gettext('This value seems to be invalid.'),
  type: {
    email:        gettext('This value should be a valid email.'),
    url:          gettext('This value should be a valid url.'),
    number:       gettext('This value should be a valid number.'),
    integer:      gettext('This value should be a valid integer.'),
    digits:       gettext('This value should be digits.'),
    alphanum:     gettext('This value should be alphanumeric.'),
  },
  notblank:       gettext('This value should not be blank.'),
  required:       gettext('This value is required.'),
  pattern:        gettext('This value seems to be invalid.'),
  min:            gettext('This value should be greater than or equal to %s.'),
  max:            gettext('This value should be lower than or equal to %s.'),
  range:          gettext('This value should be between %s and %s.'),
  minlength:      gettext('This value is too short. It should have %s characters or more.'),
  maxlength:      gettext('This value is too long. It should have %s characters or fewer.'),
  length:         gettext('This value length is invalid. It should be between %s and %s characters long.'),
  mincheck:       gettext('You must select at least %s choices.'),
  maxcheck:       gettext('You must select %s choices or fewer.'),
  check:          gettext('You must select between %s and %s choices.'),
  equalto:        gettext('This value should be the same.'),
  dateiso:        gettext('This value should be a valid date (YYYY-MM-DD).'),
  minwords:       gettext('This value is too short. It should have %s words or more.'),
  maxwords:       gettext('This value is too long. It should have %s words or fewer.'),
  words:          gettext('This value length is invalid. It should be between %s and %s words long.'),
  gt:             gettext('This value should be greater.'),
  gte:            gettext('This value should be greater or equal.'),
  lt:             gettext('This value should be less.'),
  lte:            gettext('This value should be less or equal.'),
  notequalto:     gettext('This value should be different.'),
  containsLower: gettext('Passwords must contain at least one lowercase letter'),
  containsUpper:  gettext('Passwords must contain at least one uppercase letter'),
  passIsLong:     gettext('Passwords must be at least 6 characters in length.'),
  isCognitoCompliant: gettext('Password can only contain letters, numbers, spaces and following special characters: +=^$*.[]{}()?-"!@#%&/\\,><\':;|_~`'),
  isPassLengthSane: gettext('Passwords must be 99 or fewer characters in length.'),
  isNotCareCreditCard: gettext('To ensure that your CareCredit order is processed correctly, please call %s.'),
  validPostalCode:  gettext('<br>This seems to be a valid postal code for %s. Click <div class="country-chooser-link jsCountryChooserButton"><span>here</span></div> to find our service areas in %s.'),
  validPhone:     gettext('Please enter a valid phone number.'),
});

Parsley.setLocale('local');
