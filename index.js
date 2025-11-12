// index.js - navigation, formulaire et modal carte
document.addEventListener('DOMContentLoaded', function () {
  // ===== NAVBAR =====
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  hamburger && hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FORM VALIDATION =====
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    formMessage.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formMessage.style.color = 'crimson';
      formMessage.textContent = 'Veuillez remplir tous les champs.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      formMessage.style.color = 'crimson';
      formMessage.textContent = 'Veuillez entrer un email valide.';
      return;
    }

    formMessage.style.color = '#0b7a39';
    formMessage.textContent = 'Merci — ton message a bien été envoyé (simulation).';
    form.reset();
  });

  // ===== MODAL MAP (agrandir l’image) =====
  const mapBtn = document.querySelector('.map-card .btn');
  const mapModal = document.getElementById('mapModal');
  const closeMap = document.getElementById('closeMap');

  if (mapBtn && mapModal) {
    mapBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mapModal.classList.add('open');
    });
  }

  closeMap && closeMap.addEventListener('click', () => {
    mapModal.classList.remove('open');
  });

  // fermer si on clique à l’extérieur de l’image
  mapModal && mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) {
      mapModal.classList.remove('open');
    }
  });
});
