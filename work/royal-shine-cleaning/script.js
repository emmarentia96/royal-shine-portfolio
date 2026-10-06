/* Royal Shine Cleaning — page behaviour
   1. Mobile navigation toggle (with keyboard + close-on-link behaviour)
   2. Quote form -> WhatsApp deep link
   3. Footer year
*/

(function () {
  'use strict';

  /* ---------- 1. Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the menu after choosing a destination on mobile
    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });

    // Escape closes it
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Quote form -> WhatsApp ---------- */
  // STEP FOR THE OWNER: replace the number below with the real WhatsApp number
  // in full international format, digits only (South Africa = 27, drop the leading 0).
  // Example: 082 123 4567  ->  '27821234567'
  var WHATSAPP_NUMBER = ''; // <-- leave empty until the real number is supplied

  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var suburb = (data.get('suburb') || '').toString().trim();
      var service = (data.get('service') || '').toString().trim();
      var notes = (data.get('notes') || '').toString().trim();

      var message = 'Hi Royal Shine Cleaning! I would like a quote.\n\n'
        + 'Name: ' + name + '\n'
        + 'Area: ' + suburb + '\n'
        + 'Service: ' + service + '\n'
        + (notes ? 'Details: ' + notes + '\n' : '');

      if (!WHATSAPP_NUMBER) {
        // Honest failure instead of a dead link: the business number is not set yet.
        status.textContent =
          'This is a design sample — the form goes live once the business WhatsApp number is '
          + 'connected. Your details are ready to copy and send manually.';
        console.warn('WhatsApp number not configured. Message that would be sent:\n' + message);
        return;
      }

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      status.textContent = 'Opening WhatsApp…';
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- 3. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
