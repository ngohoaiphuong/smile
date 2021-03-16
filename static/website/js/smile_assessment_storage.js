$(document).ready(function () {
  var $biggest_concern = $('#biggest_concern');
  var value = $biggest_concern.val();
  if (value === 'spacing' || value === 'crowding') {
    sessionStorage.setItem('biggest_concern', value)
  }
  
  $biggest_concern.on('change', function() {
    var value = $(this).val();
    if (value === 'spacing' || value === 'crowding') {
      sessionStorage.setItem('biggest_concern', value)
    } else {
      sessionStorage.removeItem('biggest_concern')
    }
  })
})
