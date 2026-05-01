(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const revealTargets = document.querySelectorAll(
    '.card, .why-item, .step, .project, .section-head'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formStatus = document.getElementById('form-status');
  const formSubmit = document.getElementById('form-submit');

  const setStatus = (msg, type) => {
    if (!formStatus) return;
    formStatus.textContent = msg || '';
    formStatus.className = 'form-status' + (type ? ' is-' + type : '');
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const type = (data.get('type') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !email || !type || !message) {
        setStatus('Merci de remplir tous les champs.', 'error');
        return;
      }

      data.set('subject', `BIMaghreb — Demande de devis (${type})`);

      formSubmit.disabled = true;
      formSubmit.textContent = 'Envoi en cours…';
      setStatus('', '');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });
        const json = await res.json().catch(() => ({}));

        if (res.ok && json.success) {
          form.hidden = true;
          if (formSuccess) {
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          throw new Error(json.message || 'Erreur réseau');
        }
      } catch (err) {
        setStatus(
          "Envoi impossible pour le moment. Contactez BIMaghreb directement à bimaghreb@outlook.com.",
          'error'
        );
        formSubmit.disabled = false;
        formSubmit.textContent = 'Envoyer la demande';
      }
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
