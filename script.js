/* ===================================
   FINEX PRO — script.js
   Animations & Interactions (multi-page)
   =================================== */

// -------- NAVBAR SCROLL --------
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
}

// -------- MOBILE NAV TOGGLE --------
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// -------- ACTIVE NAV LINK ON SCROLL (index.html only) --------
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

if (sections.length && navAnchors.length) {
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
}

// -------- REVEAL ON SCROLL --------
const reveals = document.querySelectorAll('.reveal');

function checkReveals() {
  const windowBottom = window.scrollY + window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top + window.scrollY < windowBottom - 80) {
      el.classList.add('visible');
    }
  });
}
checkReveals();
window.addEventListener('scroll', checkReveals, { passive: true });

// -------- HERO TEXT ROTATOR --------
const heroRotate = document.getElementById('heroRotate');
if (heroRotate) {
  const words = ['T-shirts', 'Mugs', 'Bâches', 'Objets perso', 'Flyers', 'Uniformes'];
  let wordIndex = 0;

  function rotateHeroWord() {
    heroRotate.classList.add('fade-out');
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      heroRotate.textContent = words[wordIndex];
      heroRotate.classList.remove('fade-out');
      heroRotate.classList.add('fade-in');
      setTimeout(() => {
        heroRotate.classList.remove('fade-in');
        heroRotate.classList.add('visible');
      }, 20);
    }, 380);
  }

  heroRotate.classList.add('visible');
  setInterval(rotateHeroWord, 2400);
}

// -------- PORTFOLIO FILTER --------
const filterBtns     = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          item.classList.remove('hidden');
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });
}

// -------- PORTFOLIO LIGHTBOX --------
const lightbox        = document.getElementById('lightbox');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxContent = document.getElementById('lightboxContent');

if (lightbox && portfolioItems.length) {
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgWrap = lightbox.querySelector('#lightboxImg');
      const infoWrap = lightbox.querySelector('#lightboxInfo');

      if (imgWrap && infoWrap) {
        // portfolio.html enhanced lightbox
        const clonedImg = item.querySelector('.portfolio-img').cloneNode(true);
        clonedImg.style.cssText = 'width:100%;height:100%;';
        imgWrap.innerHTML = '';
        imgWrap.appendChild(clonedImg);

        const title    = item.dataset.title || item.querySelector('.portfolio-overlay span')?.textContent || '';
        const catLabel = item.dataset.categoryLabel || item.querySelector('.portfolio-overlay small')?.textContent || '';
        const desc     = item.dataset.desc || '';
        infoWrap.innerHTML = `<h3>${title}</h3><span class="lbox-cat">${catLabel}</span>${desc ? `<p>${desc}</p>` : ''}`;
      } else if (lightboxContent) {
        // index.html basic lightbox
        const img = item.querySelector('.portfolio-img').cloneNode(true);
        img.style.width  = 'min(600px, 90vw)';
        img.style.height = 'min(400px, 70vh)';
        img.style.borderRadius = '14px';
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(img);
      }

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// -------- CONTACT FORM → WHATSAPP --------
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = (document.getElementById('name')?.value || '').trim();
    const phone   = (document.getElementById('phone')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const subject = (document.getElementById('subject')?.value || '');
    const email   = (document.getElementById('email')?.value || '').trim();

    if (!name || !phone || !message) {
      [['name', name], ['phone', phone], ['message', message]].forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && !val) {
          el.style.borderColor = '#ff4d4f';
          el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    let waText = `Bonjour FINEX PRO,\n\nJe m'appelle ${name}.`;
    if (email) waText += `\nEmail: ${email}`;
    waText += `\nTél: ${phone}`;
    if (subject) waText += `\nSujet: ${subject}`;
    waText += `\n\n${message}`;

    window.open(`https://wa.me/22897511723?text=${encodeURIComponent(waText)}`, '_blank');
    contactForm.reset();

    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✓ Message envoyé via WhatsApp !';
      btn.style.background = '#25d366';
      setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 3000);
    }
  });
}

// -------- SMOOTH ANCHOR SCROLL --------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// -------- CARD PARALLAX TILT (subtle) --------
document.querySelectorAll('.hcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `rotate(${card._baseRot || 0}deg) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
if (document.querySelector('.hcard-1')) document.querySelector('.hcard-1')._baseRot = -3;
if (document.querySelector('.hcard-2')) document.querySelector('.hcard-2')._baseRot = 2;
if (document.querySelector('.hcard-3')) document.querySelector('.hcard-3')._baseRot = -1;

// -------- STATS COUNTER ANIMATION (hero) --------
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = entry.target.querySelectorAll('.stat-num');
        const targets  = [500, 9, 48];
        const suffixes = ['+', '+', 'h'];
        statNums.forEach((el, i) => animateCounter(el, targets[i], suffixes[i]));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// -------- SERVICE CARD ENTRANCE STAGGER --------
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length) {
  const serviceObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  serviceCards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(28px)';
    c.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease, border-color 0.35s ease';
    serviceObserver.observe(c);
  });
}

// -------- FAQ ACCORDION --------
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => openItem.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// -------- ANIMATED COUNTERS (about.html) --------
const countersGrid = document.getElementById('countersGrid');
if (countersGrid) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 50);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 30);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterObserver.observe(countersGrid);
}

// -------- DEVIS STEPPER --------
const stepperWrap = document.getElementById('stepperWrap');
if (stepperWrap) {
  let currentStep = 1;
  let selectedService = null;

  const panels     = stepperWrap.querySelectorAll('.stepper-panel');
  const stepDots   = stepperWrap.querySelectorAll('.stepper-step');
  const stepLines  = stepperWrap.querySelectorAll('.stepper-line');
  const barFill    = document.getElementById('stepperBarFill');

  function goToStep(n) {
    panels.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('stepPanel' + n);
    if (target) target.classList.add('active');

    stepDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 < n) dot.classList.add('done');
      else if (i + 1 === n) dot.classList.add('active');
    });

    stepLines.forEach((line, i) => {
      line.classList.toggle('active', i + 1 < n);
    });

    if (barFill) barFill.style.width = (n / 3 * 100) + '%';
    currentStep = n;

    stepperWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Step 1 : service selection
  const serviceChoiceCards = stepperWrap.querySelectorAll('.service-choice-card');
  const nextStep1 = document.getElementById('nextStep1');

  serviceChoiceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceChoiceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedService = card.dataset.service;
      if (nextStep1) nextStep1.disabled = false;
    });
  });

  if (nextStep1) {
    nextStep1.addEventListener('click', () => {
      if (!selectedService) return;
      // Show relevant fields
      stepperWrap.querySelectorAll('.detail-fields').forEach(f => f.style.display = 'none');
      const targetFields = document.getElementById('fields-' + selectedService);
      if (targetFields) targetFields.style.display = 'block';
      goToStep(2);
    });
  }

  // Step 2 navigation
  const prevStep2 = document.getElementById('prevStep2');
  const nextStep2 = document.getElementById('nextStep2');
  if (prevStep2) prevStep2.addEventListener('click', () => goToStep(1));
  if (nextStep2) nextStep2.addEventListener('click', () => goToStep(3));

  // Step 3 navigation
  const prevStep3 = document.getElementById('prevStep3');
  if (prevStep3) prevStep3.addEventListener('click', () => goToStep(2));

  // Final submission
  const submitDevis = document.getElementById('submitDevis');
  if (submitDevis) {
    submitDevis.addEventListener('click', () => {
      const nom = (document.getElementById('coord-nom')?.value || '').trim();
      const tel = (document.getElementById('coord-tel')?.value || '').trim();

      if (!nom || !tel) {
        ['coord-nom', 'coord-tel'].forEach(id => {
          const el = document.getElementById(id);
          if (el && !el.value.trim()) {
            el.style.borderColor = '#ff4d4f';
            el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
          }
        });
        return;
      }

      const entreprise = (document.getElementById('coord-entreprise')?.value || '').trim();
      const email      = (document.getElementById('coord-email')?.value || '').trim();
      const message    = (document.getElementById('coord-message')?.value || '').trim();

      // Build service details
      const serviceLabels = {
        serigraphie: 'Sérigraphie Textile',
        impression:  'Impression Numérique',
        design:      'Design Graphique',
        objets:      'Objets Personnalisés'
      };
      let details = '';

      if (selectedService === 'serigraphie') {
        const produit  = document.getElementById('seri-produit')?.value || '';
        const qte      = document.getElementById('seri-qte')?.value || '';
        const couleurs = document.getElementById('seri-couleurs')?.value || '';
        const delai    = document.getElementById('seri-delai')?.value || '';
        const notes    = document.getElementById('seri-notes')?.value || '';
        details = `Produit: ${produit}\nQuantité: ${qte}\nCouleurs: ${couleurs || 'N/A'}\nDélai: ${delai || 'Flexible'}\nNotes: ${notes || '-'}`;
      } else if (selectedService === 'impression') {
        const support = document.getElementById('imp-support')?.value || '';
        const format  = document.getElementById('imp-format')?.value || '';
        const qte     = document.getElementById('imp-qte')?.value || '';
        const delai   = document.getElementById('imp-delai')?.value || '';
        const fichier = document.getElementById('imp-fichier')?.value || '';
        const notes   = document.getElementById('imp-notes')?.value || '';
        details = `Support: ${support}\nFormat: ${format || 'N/A'}\nQuantité: ${qte}\nDélai: ${delai || 'Flexible'}\nFichier dispo: ${fichier}\nNotes: ${notes || '-'}`;
      } else if (selectedService === 'design') {
        const prestation = document.getElementById('des-prestation')?.value || '';
        const brief      = document.getElementById('des-brief')?.value || '';
        const refs       = document.getElementById('des-refs')?.value || '';
        const delai      = document.getElementById('des-delai')?.value || '';
        details = `Prestation: ${prestation}\nBrief: ${brief || '-'}\nRéférences: ${refs || '-'}\nDélai: ${delai || 'Flexible'}`;
      } else if (selectedService === 'objets') {
        const type  = document.getElementById('obj-type')?.value || '';
        const qte   = document.getElementById('obj-qte')?.value || '';
        const perso = document.getElementById('obj-perso')?.value || '';
        const delai = document.getElementById('obj-delai')?.value || '';
        details = `Type d'objet: ${type}\nQuantité: ${qte}\nPersonnalisation: ${perso || '-'}\nDélai: ${delai || 'Flexible'}`;
      }

      let waMsg = `🎯 DEMANDE DE DEVIS — FINEX PRO\n`;
      waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
      waMsg += `📋 Service: ${serviceLabels[selectedService] || selectedService}\n\n`;
      waMsg += `📝 DÉTAILS DU PROJET:\n${details}\n\n`;
      waMsg += `👤 COORDONNÉES:\n`;
      waMsg += `Nom: ${nom}\n`;
      if (entreprise) waMsg += `Entreprise: ${entreprise}\n`;
      waMsg += `Téléphone: ${tel}\n`;
      if (email) waMsg += `Email: ${email}\n`;
      if (message) waMsg += `\nMessage: ${message}`;
      waMsg += `\n━━━━━━━━━━━━━━━━━━━━`;

      window.open(`https://wa.me/22897511723?text=${encodeURIComponent(waMsg)}`, '_blank');

      submitDevis.textContent = '✓ Demande envoyée !';
      submitDevis.style.background = '#25d366';
      submitDevis.disabled = true;
    });
  }
}

// -------- URL PARAM: pre-select service on devis.html --------
if (stepperWrap) {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const card = stepperWrap.querySelector(`.service-choice-card[data-service="${serviceParam}"]`);
    if (card) {
      card.click();
    }
  }
}

console.log('✅ FINEX PRO website loaded');
