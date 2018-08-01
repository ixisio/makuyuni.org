var $ = require('jquery');

//
// Newsletter subscribe button field
//

$('[data-newsletter-subscription]').on('click', function (event) {
    event.preventDefault();

    var $button = $(this);
    var $form = $button.closest('.newsletter');
    var $email = $form.find('input[name="email"]');

    if ($form.hasClass('is-active-newsletter-section')) {
        $form.submit()
    } else {
        $form.addClass('is-active-newsletter-section');
        $button.find('.newsletter__submit-text')
                .text('Abonnieren')
        $email.focus();
    }
});

