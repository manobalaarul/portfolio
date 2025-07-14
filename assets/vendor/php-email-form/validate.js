<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

(function () {
  "use strict";

  $('.php-email-form').on('submit', function (event) {
    event.preventDefault();

    let $form = $(this);
    let action = $form.attr('action');
    let recaptcha = $form.data('recaptcha-site-key');

    if (!action) {
      displayError($form, 'The form action property is not set!');
      return;
    }

    $form.find('.loading').addClass('d-block');
    $form.find('.error-message').removeClass('d-block');
    $form.find('.sent-message').removeClass('d-block');

    let formData = new FormData(this);

    if (recaptcha) {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.ready(function () {
          try {
            grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
              .then(function (token) {
                formData.set('recaptcha-response', token);
                sendForm($form, action, formData);
              });
          } catch (error) {
            displayError($form, error);
          }
        });
      } else {
        displayError($form, 'The reCaptcha javascript API url is not loaded!');
      }
    } else {
      sendForm($form, action, formData);
    }
  });

  function sendForm($form, action, formData) {
    $.ajax({
      url: action,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      success: function (response) {
        $form.find('.loading').removeClass('d-block');

        if (response.trim() === 'OK') {
          $form.find('.sent-message').addClass('d-block');
          $form[0].reset();
        } else {
          displayError($form, response || 'Form submission failed with no message.');
        }
      },
      error: function (xhr, status, error) {
        $form.find('.loading').removeClass('d-block');
        displayError($form, `${xhr.status} ${xhr.statusText}`);
      }
    });
  }

  function displayError($form, error) {
    $form.find('.loading').removeClass('d-block');
    $form.find('.error-message').html(error).addClass('d-block');
  }
})();
