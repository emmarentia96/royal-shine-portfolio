/* Royal Shine Digital Services — portfolio page behaviour
   1. Mobile navigation
   2. WhatsApp links + quote form (one number, set in one place)
   3. Footer year
*/

(function () {
  'use strict';

  /* =========================================================
     OWNER STEP — put the real WhatsApp number here.
     Digits only, full international format: drop the leading 0
     and start with 27.
     Example:  082 123 4567   ->   '27821234567'
     Until this is filled in, the WhatsApp buttons and the form
     will say so out loud instead of opening a dead link.
     ========================================================= */
  var WHATSAPP_NUMBER = '27772782712';

  /* ---------- 1. Mobile navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('is-open')) { setNav(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
    });
  }

  /* ---------- 2. WhatsApp ---------- */
  var heroStatus = document.getElementById('hero-status');
  var contactStatus = document.getElementById('contact-status');

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function openWhatsApp(text, statusEl) {
    if (!WHATSAPP_NUMBER) {
      if (statusEl) {
        statusEl.textContent = 'WhatsApp is not connected yet — the number still has to be added.';
      }
      console.warn('WhatsApp number not set. Message that would be sent:\n' + text);
      return;
    }
    if (statusEl) { statusEl.textContent = 'Opening WhatsApp…'; }
    window.open(waLink(text), '_blank', 'noopener');
  }

  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      openWhatsApp('Hi Royal Shine Digital Services! I would like a website. Can you send me a quote?',
                   el.id === 'hero-wa' ? heroStatus : contactStatus);
    });
  });

  var form = document.getElementById('quote-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      if (!get('name')) {
        formStatus.textContent = 'Please add your name so I know who I am replying to.';
        form.querySelector('#q-name').focus();
        return;
      }

      var message = 'Hi Royal Shine Digital Services! I would like a website quote.\n\n'
        + 'Name: ' + get('name') + '\n'
        + (get('business') ? 'Business: ' + get('business') + '\n' : '')
        + 'Package: ' + get('package') + '\n'
        + (get('notes') ? 'Notes: ' + get('notes') + '\n' : '');

      openWhatsApp(message, formStatus);
    });
  }

  /* ---------- 3. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
