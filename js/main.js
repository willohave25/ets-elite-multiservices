/* =============================================
   ETS Elite Multiservices — Script principal
   Navigation, interactions, animations
   W2K-Digital 2025
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------
     Header scroll effect
     ----------------------------------------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* -----------------------------------------
     Navigation mobile — Hamburger
     ----------------------------------------- */
  const toggleBtn = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navFermer = document.getElementById('nav-fermer');
  const overlay = document.getElementById('overlay-nav');

  function ouvrirNav() {
    if (navMobile) navMobile.classList.add('ouverte');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function fermerNav() {
    if (navMobile) navMobile.classList.remove('ouverte');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', ouvrirNav);
  if (navFermer) navFermer.addEventListener('click', fermerNav);
  if (overlay) overlay.addEventListener('click', fermerNav);

  /* Sous-menus mobile */
  var subToggles = document.querySelectorAll('.submenu-toggle');
  subToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = this.parentElement;
      var submenu = parent.querySelector('.nav-mobile-submenu');
      if (submenu) {
        submenu.classList.toggle('ouverte');
        this.classList.toggle('ouverte');
      }
    });
  });

  /* -----------------------------------------
     Animations au scroll (fade-in)
     ----------------------------------------- */
  var animElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  function checkVisible() {
    animElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  if (animElements.length > 0) {
    window.addEventListener('scroll', checkVisible, { passive: true });
    checkVisible();
  }

  /* -----------------------------------------
     Compteurs animés (chiffres clés)
     ----------------------------------------- */
  var compteurs = document.querySelectorAll('[data-compteur]');
  var compteursAnimes = false;

  function animerCompteurs() {
    if (compteursAnimes) return;
    var premierCompteur = compteurs[0];
    if (!premierCompteur) return;
    var rect = premierCompteur.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      compteursAnimes = true;
      compteurs.forEach(function (el) {
        var cible = parseInt(el.getAttribute('data-compteur'), 10);
        var duree = 2000;
        var debut = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duree, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * cible);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            var suffix = el.getAttribute('data-suffix') || '';
            el.textContent = cible + suffix;
          }
        }
        requestAnimationFrame(step);
      });
    }
  }

  if (compteurs.length > 0) {
    window.addEventListener('scroll', animerCompteurs, { passive: true });
    animerCompteurs();
  }

  /* -----------------------------------------
     Active page navigation
     ----------------------------------------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav-desktop > li > a, .dropdown li a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('actif');
      var parentLi = link.closest('.dropdown')?.parentElement;
      if (parentLi) {
        var parentLink = parentLi.querySelector(':scope > a');
        if (parentLink) parentLink.classList.add('actif');
      }
    }
  });

  /* -----------------------------------------
     Formulaire contact validation
     ----------------------------------------- */
  var formContact = document.getElementById('form-contact');
  if (formContact) {
    formContact.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var champs = formContact.querySelectorAll('[required]');
      champs.forEach(function (champ) {
        if (!champ.value.trim()) {
          champ.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          champ.style.borderColor = '#ddd';
        }
        if (champ.type === 'email' && champ.value) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(champ.value)) {
            champ.style.borderColor = '#e74c3c';
            valid = false;
          }
        }
      });
      if (valid) {
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        formContact.reset();
      }
    });
  }

  /* -----------------------------------------
     Smooth scroll ancres
     ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -----------------------------------------
     Carousel témoignages auto-défilant
     ----------------------------------------- */
  var carousels = document.querySelectorAll('.carousel-temoignages');
  carousels.forEach(function (carousel) {
    var piste = carousel.querySelector('.carousel-piste');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var btnPrec = carousel.querySelector('.carousel-btn-prec');
    var btnSuiv = carousel.querySelector('.carousel-btn-suiv');
    var points = carousel.querySelectorAll('.carousel-point');
    var progressBar = carousel.querySelector('.carousel-progress-bar');

    if (!piste || slides.length === 0) return;

    var indexActuel = 0;
    var total = slides.length;
    var intervalle = 5000;
    var timer = null;
    var progressTimer = null;
    var progressStart = 0;

    function allerA(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      indexActuel = index;
      piste.style.transform = 'translateX(-' + (indexActuel * 100) + '%)';
      majPoints();
      resetProgress();
    }

    function suivant() {
      allerA(indexActuel + 1);
    }

    function precedent() {
      allerA(indexActuel - 1);
    }

    function majPoints() {
      points.forEach(function (p, i) {
        if (i === indexActuel) {
          p.classList.add('actif');
        } else {
          p.classList.remove('actif');
        }
      });
    }

    function resetProgress() {
      if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        void progressBar.offsetWidth;
        progressBar.style.transition = 'width ' + intervalle + 'ms linear';
        progressBar.style.width = '100%';
      }
    }

    function demarrerAuto() {
      stopperAuto();
      resetProgress();
      timer = setInterval(suivant, intervalle);
    }

    function stopperAuto() {
      clearInterval(timer);
    }

    /* Boutons navigation */
    if (btnPrec) btnPrec.addEventListener('click', function () {
      precedent();
      demarrerAuto();
    });
    if (btnSuiv) btnSuiv.addEventListener('click', function () {
      suivant();
      demarrerAuto();
    });

    /* Points cliquables */
    points.forEach(function (p, i) {
      p.addEventListener('click', function () {
        allerA(i);
        demarrerAuto();
      });
    });

    /* Swipe tactile */
    var touchStartX = 0;
    var touchEndX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { suivant(); } else { precedent(); }
        demarrerAuto();
      }
    }, { passive: true });

    /* Pause au survol */
    carousel.addEventListener('mouseenter', stopperAuto);
    carousel.addEventListener('mouseleave', demarrerAuto);

    /* Initialisation */
    majPoints();
    demarrerAuto();
  });

});
