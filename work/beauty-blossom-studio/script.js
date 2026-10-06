/* Beauty Blossom Studio — page behaviour
   1. Mobile navigation (toggle, close on link, Escape, focus return)
   2. Booking form -> WhatsApp deep link
   3. Footer year
*/

(function () {
  'use strict';

  /* ---------- 1. Mobile navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && nav.classList.contains('is-open')) {
        setNav(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Booking form -> WhatsApp ---------- */
  // OWNER STEP: put the real WhatsApp number here, digits only, full international
  // format. South Africa = 27, and drop the leading 0.
  // Example: 082 123 4567  ->  '27821234567'
  var WHATSAPP_NUMBER = ''; // <-- empty until the real number is supplied

  var form = document.getElementById('booking-form');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };
      var name = get('name');

      if (!name) {
        status.textContent = 'Please add your name so the studio knows who is booking.';
        form.querySelector('#b-name').focus();
        return;
      }

      var message = 'Hi Beauty Blossom Studio! I would like to book.\n\n'
        + 'Name: ' + name + '\n'
        + 'Service: ' + get('service') + '\n'
        + (get('when') ? 'Preferred time: ' + get('when') + '\n' : '')
        + (get('notes') ? 'Details: ' + get('notes') + '\n' : '');

      if (!WHATSAPP_NUMBER) {
        // Honest failure instead of a link that goes nowhere: the number is not set yet.
        status.textContent =
          'This is a design sample — the form goes live once the studio WhatsApp number is '
          + 'connected. Your details are ready to copy and send by hand.';
        console.warn('WhatsApp number not configured yet. Message that will be sent:\n' + message);
        return;
      }

      status.textContent = 'Opening WhatsApp…';
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }

  /* ---------- 3. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
