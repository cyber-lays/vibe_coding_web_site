document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("main-nav");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollTopBtn = document.getElementById("scrollTop");

  const hero = document.querySelector(".hero");
  const heroBg = document.querySelector(".hero-bg");

  const statsSection = document.querySelector(".stats-container");
  const statValues = document.querySelectorAll(".stat-value");

  const mapModal = document.getElementById("mapModal");
  const openMapButton = document.getElementById("openMap");
  const closeMapButton = document.getElementById("closeMap");

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  const revealElements = document.querySelectorAll(".reveal");

  /* NAV MOBILE */
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      if (hamburger) {
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* SMOOTH SCROLL CUSTOM (pour gérer le header fixe) */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight + 12 : 0;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - headerOffset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth"
      });
    });
  });

  /* HEADER SCROLL, BOUTON TOP & NAV ACTIVE */
  const sections = document.querySelectorAll("main section[id]");

  const handleScroll = () => {
    const currentY = window.scrollY || window.pageYOffset;

    // Fond / ombre header
    if (header) {
      if (currentY > 10) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    // Bouton remonter
    if (scrollTopBtn) {
      if (currentY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }

    // Lien actif
    const offsetFromTop = (header ? header.offsetHeight : 0) + 60;
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        currentY + offsetFromTop >= sectionTop &&
        currentY + offsetFromTop < sectionTop + sectionHeight
      ) {
        currentSectionId = section.id;
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === `#${currentSectionId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* BOUTON REMONTER EN HAUT */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* REVEAL AU SCROLL */
  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* COMPTEUR STATS */
  let statsAnimated = false;

  function animateNumber(el, target, duration, suffix = "") {
    const start = 0;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = start + (target - start) * progress;
      el.textContent = `${Math.round(value)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && statsSection && statValues.length) {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statValues.forEach((el) => {
              const target = parseFloat(el.dataset.target);
              const suffix = el.dataset.suffix || "";
              if (!isNaN(target)) {
                animateNumber(el, target, 1400, suffix);
              }
            });
            obs.unobserve(statsSection);
          }
        });
      },
      {
        threshold: 0.4
      }
    );

    statsObserver.observe(statsSection);
  }

  /* PARALLAX HERO */
  if (hero && heroBg) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        const factor = rect.top * -0.12;
        heroBg.style.transform = `translate3d(0, ${factor}px, 0) scale(1.08)`;
      },
      { passive: true }
    );
  }

  /* MODAL CARTE */
  const openModal = () => {
    if (!mapModal) return;
    mapModal.classList.add("open");
    mapModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
  };

  const closeModal = () => {
    if (!mapModal) return;
    mapModal.classList.remove("open");
    mapModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
  };

  if (openMapButton) {
    openMapButton.addEventListener("click", openModal);
  }

  if (closeMapButton) {
    closeMapButton.addEventListener("click", closeModal);
  }

  if (mapModal) {
    mapModal.addEventListener("click", (e) => {
      if (e.target === mapModal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mapModal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  /* FORMULAIRE CONTACT (simulation d'envoi) */
  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formMessage.textContent =
          "Merci de remplir tous les champs avant d'envoyer.";
        formMessage.className = "form-message error";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formMessage.textContent = "L'adresse e-mail ne semble pas valide.";
        formMessage.className = "form-message error";
        return;
      }

      formMessage.textContent =
        "Merci ! Votre message a bien été envoyé (simulation).";
      formMessage.className = "form-message success";
      contactForm.reset();

      setTimeout(() => {
        formMessage.textContent = "";
        formMessage.className = "form-message";
      }, 5000);
    });
  }
});
