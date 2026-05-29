/* ===================================
   FINEX PRO — script.js
   Animations, Interactions, Theme & i18n
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
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function openMenu() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navOverlay.classList.add('open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  navOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
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
const _heroWordsList = {
  fr: ['T-shirts', 'Mugs', 'Bâches', 'Objets perso', 'Flyers', 'Uniformes'],
  en: ['T-shirts', 'Mugs', 'Banners', 'Custom items', 'Flyers', 'Uniforms']
};

if (heroRotate) {
  let wordIndex = 0;

  function rotateHeroWord() {
    heroRotate.classList.add('fade-out');
    setTimeout(() => {
      const lang = localStorage.getItem('finex-lang') || 'fr';
      const words = _heroWordsList[lang] || _heroWordsList.fr;
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
      const imgWrap  = lightbox.querySelector('#lightboxImg');
      const infoWrap = lightbox.querySelector('#lightboxInfo');

      if (imgWrap && infoWrap) {
        const clonedImg = item.querySelector('.portfolio-img').cloneNode(true);
        clonedImg.style.cssText = 'width:100%;height:100%;';
        imgWrap.innerHTML = '';
        imgWrap.appendChild(clonedImg);

        const title    = item.dataset.title || item.querySelector('.portfolio-overlay span')?.textContent || '';
        const catLabel = item.dataset.categoryLabel || item.querySelector('.portfolio-overlay small')?.textContent || '';
        const desc     = item.dataset.desc || '';
        infoWrap.innerHTML = `<h3>${title}</h3><span class="lbox-cat">${catLabel}</span>${desc ? `<p>${desc}</p>` : ''}`;
      } else if (lightboxContent) {
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

}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Fermeture globale — fonctionne sur toutes les pages (portfolio, about, etc.)
if (lightbox) {
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (!e.target.closest('.lightbox-inner') && !e.target.closest('.lightbox-close')) closeLightbox();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// -------- PARTNER LOGO LIGHTBOX --------
document.querySelectorAll('.partner-logo[data-partner]').forEach(card => {
  card.addEventListener('click', () => {
    if (!lightbox || !lightboxContent) return;
    const img  = card.querySelector('img');
    const name = card.dataset.partner;
    const bg        = name === 'GSC TG' ? '#0a1628' : '#fff';
    const textColor = name === 'GSC TG' ? '#fff'    : '#0a1628';
    lightboxContent.innerHTML = `
      <div style="background:${bg};border-radius:16px;padding:40px 48px;display:flex;flex-direction:column;align-items:center;gap:20px;max-width:min(420px,90vw);">
        <img src="${img.src}" alt="${img.alt}" style="max-width:280px;max-height:180px;width:auto;height:auto;object-fit:contain;">
        <p style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:${textColor};margin:0;">${name}</p>
      </div>`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

// -------- CEO PHOTO LIGHTBOX --------
const ceoPhotoCard = document.querySelector('.team-card--photo');
if (ceoPhotoCard && lightbox) {
  ceoPhotoCard.style.cursor = 'zoom-in';
  ceoPhotoCard.addEventListener('click', () => {
    const img = ceoPhotoCard.querySelector('img');
    if (!img) return;
    const imgWrap  = lightbox.querySelector('#lightboxImg');
    const infoWrap = lightbox.querySelector('#lightboxInfo');
    if (imgWrap) {
      // Format portrait pour la photo CEO
      imgWrap.style.cssText = 'width:min(380px,88vw);height:min(520px,65vh);border-radius:14px;overflow:hidden;';
      imgWrap.innerHTML = '';
      const clone = img.cloneNode();
      clone.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center 15%;display:block;';
      imgWrap.appendChild(clone);
    }
    if (infoWrap) {
      infoWrap.innerHTML = '<h3>FIANKE Komlan</h3><span class="lbox-cat">Directeur Général — FINEX PRO</span>';
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
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

    window.open(`https://wa.me/22890436929?text=${encodeURIComponent(waText)}`, '_blank');
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
        const targets  = [500, 4, 48];
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

  const panels    = stepperWrap.querySelectorAll('.stepper-panel');
  const stepDots  = stepperWrap.querySelectorAll('.stepper-step');
  const stepLines = stepperWrap.querySelectorAll('.stepper-line');
  const barFill   = document.getElementById('stepperBarFill');

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
      stepperWrap.querySelectorAll('.detail-fields').forEach(f => f.style.display = 'none');
      const targetFields = document.getElementById('fields-' + selectedService);
      if (targetFields) targetFields.style.display = 'block';
      goToStep(2);
    });
  }

  const prevStep2 = document.getElementById('prevStep2');
  const nextStep2 = document.getElementById('nextStep2');
  if (prevStep2) prevStep2.addEventListener('click', () => goToStep(1));
  if (nextStep2) nextStep2.addEventListener('click', () => goToStep(3));

  const prevStep3 = document.getElementById('prevStep3');
  if (prevStep3) prevStep3.addEventListener('click', () => goToStep(2));

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

      window.open(`https://wa.me/22890436929?text=${encodeURIComponent(waMsg)}`, '_blank');
      submitDevis.textContent = '✓ Demande envoyée !';
      submitDevis.style.background = '#25d366';
      submitDevis.disabled = true;
    });
  }
}

// -------- URL PARAM: pre-select service on devis.html --------
if (stepperWrap) {
  const urlParams    = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const card = stepperWrap.querySelector(`.service-choice-card[data-service="${serviceParam}"]`);
    if (card) card.click();
  }
}

/* =========================================
   I18N — TRANSLATIONS
   ========================================= */
const translations = {
  fr: {
    // ── Navbar ──
    'nav.home':     'Accueil',
    'nav.services': 'Services',
    'nav.portfolio':'Portfolio',
    'nav.about':    'À propos',
    'nav.contact':  'Contact',
    'nav.devis':    'Devis gratuit',
    // ── Hero (index) ──
    'hero.badge':        'Lomé, Togo · Impression Pro',
    'hero.title.prefix': 'Nous imprimons sur',
    'hero.sub':          'Sérigraphie · Impression numérique · Design graphique · Objets personnalisés',
    'hero.sub.strong':   'La qualité, la rapidité, le professionnalisme.',
    'hero.cta.wa':       'Contactez-nous sur WhatsApp',
    'hero.cta.devis':    'Demander un devis',
    'hero.stat1':        'Clients satisfaits',
    'hero.stat2':        "Domaines d'expertise",
    'hero.stat3':        'Livraison express',
    'hero.card1':        'Sérigraphie Textile',
    'hero.card2':        'Design Graphique',
    'hero.card3':        'Objets Personnalisés',
    // ── Services section (index) ──
    'svc.tag':       'Nos Services',
    'svc.title':     'Tout ce dont vous avez besoin',
    'svc.title.em':  'pour votre image',
    'svc.desc':      "De la conception à la livraison, FINEX PRO vous accompagne dans tous vos projets d'impression et de communication visuelle.",
    'svc.all':       'Voir tous nos services →',
    'svc.s1.title':  'Sérigraphie Textile',
    'svc.s1.desc':   'Impression sur T-shirts, polos, uniformes, casquettes et tout type de vêtement. Rendu professionnel et durable.',
    'svc.s1.f1':     'T-shirts & polos',
    'svc.s1.f2':     "Uniformes d'entreprise",
    'svc.s1.f3':     'Petites & grandes séries',
    'svc.s1.btn':    'En savoir plus →',
    'svc.s2.title':  'Impression Numérique',
    'svc.s2.badge':  'Populaire',
    'svc.s2.desc':   'Flyers, affiches, bâches, signalétique grand format. Des impressions haute définition pour tous vos supports.',
    'svc.s2.f1':     'Flyers & affiches',
    'svc.s2.f2':     'Bâches grand format',
    'svc.s2.f3':     'Signalétique & roll-ups',
    'svc.s2.btn':    'En savoir plus →',
    'svc.s3.title':  'Design Graphique',
    'svc.s3.desc':   "Création de logos, chartes graphiques, visuels marketing. Donnez une identité forte à votre marque.",
    'svc.s3.f1':     'Logo & identité visuelle',
    'svc.s3.f2':     'Supports marketing',
    'svc.s3.f3':     'Retouche & montage',
    'svc.s3.btn':    'En savoir plus →',
    'svc.s4.title':  'Objets Personnalisés',
    'svc.s4.desc':   "Mugs, porte-clés, éventails, invitations. Idéal pour cadeaux d'entreprise, événements et promotions.",
    'svc.s4.f1':     'Mugs & goodies',
    'svc.s4.f2':     'Invitations & cartes',
    'svc.s4.f3':     "Cadeaux d'entreprise",
    'svc.s4.btn':    'En savoir plus →',
    // ── Portfolio section (index) ──
    'pf.tag':      'Nos Réalisations',
    'pf.title':    'Nos réalisations',
    'pf.title.em': "parlent d'elles-mêmes",
    'pf.all':      'Voir toutes nos réalisations →',
    // ── Testimonials ──
    'testi.tag':      'Témoignages',
    'testi.title':    'Ce que disent',
    'testi.title.em': 'nos clients',
    // ── Partners ──
    'partners.label': 'Ils nous font confiance',
    // ── CTA (index) ──
    'cta.title': 'Prêt à donner vie à votre projet ?',
    'cta.desc':  'Contactez-nous dès maintenant et obtenez un devis gratuit en moins de 2 heures.',
    'cta.btn':   'Demander un devis gratuit',
    // ── Footer ──
    'footer.brand.desc': 'Votre partenaire en impression, sérigraphie et communication visuelle à Lomé, Togo.',
    'footer.nav.h':     'Navigation',
    'footer.svc.h':     'Services',
    'footer.contact.h': 'Contact',
    'footer.hours':     'Lun–Sam : 8h – 19h',
    'footer.copy':      '© 2025 FINEX PRO. Tous droits réservés.',
    'footer.tagline':   'Lomé, Togo · Impression & Communication Visuelle',
    'footer.svc.s1':    'Sérigraphie Textile',
    'footer.svc.s2':    'Impression Numérique',
    'footer.svc.s3':    'Design Graphique',
    'footer.svc.s4':    'Objets Personnalisés',
    // ── Breadcrumb ──
    'bc.home': 'Accueil',
    // ── Services page — hero & intro ──
    'svc.page.hero.title':  'Nos Services',
    'svc.page.hero.sub':    "Impression professionnelle, design créatif et objets personnalisés — tout ce qu'il faut pour votre image.",
    'svc.page.intro.tag':   'Notre Expertise',
    'svc.page.intro.title': 'FINEX PRO, votre partenaire',
    'svc.page.intro.em':    'en communication visuelle',
    'svc.intro.p':          "FINEX PRO accompagne entreprises, associations et particuliers à Lomé dans tous leurs projets d'impression et de communication visuelle. Grâce à des équipements modernes et une équipe experte, nous garantissons des résultats de haute qualité, des délais respectés et des prix compétitifs.",
    // ── Services page — detail blocks ──
    'svc.d1.tag':   'Textile & Vêtements',
    'svc.d1.title': 'Sérigraphie',
    'svc.d1.em':    'Textile',
    'svc.d1.p1':    "La sérigraphie textile est notre spécialité historique. Grâce à notre matériel de pointe, nous imprimons sur tous types de vêtements avec des encres durables et des couleurs vives qui résistent au temps et aux lavages.",
    'svc.d1.p2':    "Nos créations habillent des équipes d'entreprise, des sportifs, des associations, des événements culturels et bien plus encore à travers tout Lomé et le Togo.",
    'svc.d1.li1':   'T-shirts (col rond, col V, manches longues)',
    'svc.d1.li2':   'Polos et chemises professionnelles',
    'svc.d1.li3':   "Tenues et uniformes d'entreprise",
    'svc.d1.li4':   'Blouses et tabliers de travail',
    'svc.d1.li5':   'Sacs en tissu personnalisés',
    'svc.d1.li6':   'Casquettes et bonnets',
    'svc.d1.li7':   'Bavoirs et vêtements bébé',
    'svc.d1.li8':   'Tabliers (cuisine, artisans, commerce)',
    'svc.d1.btn':   'Demander un devis Sérigraphie →',
    'svc.d2.tag':   'Grand Format & Marketing',
    'svc.d2.title': 'Impression',
    'svc.d2.em':    'Numérique',
    'svc.d2.p1':    "Notre atelier d'impression numérique dispose d'équipements grand format permettant d'imprimer sur une large gamme de supports avec une résolution maximale.",
    'svc.d2.p2':    "Chaque travail est contrôlé avant livraison pour garantir la fidélité des couleurs et la netteté des textes, même en très grand format.",
    'svc.d2.li1':   'Bâches grand format (événements, commerces)',
    'svc.d2.li2':   'Roll-up et kakémonos',
    'svc.d2.li3':   'Flyers et dépliants (A4, A5, tri-fold)',
    'svc.d2.li4':   'Affiches et posters haute définition',
    'svc.d2.li5':   'Cartes de visite premium',
    'svc.d2.li6':   'Banderoles et oriflammes',
    'svc.d2.li7':   'Autocollants et stickers découpés',
    'svc.d2.li8':   'Signalétique intérieure et extérieure',
    'svc.d2.btn':   'Demander un devis Impression →',
    'svc.d3.tag':   'Identité & Créativité',
    'svc.d3.title': 'Design',
    'svc.d3.em':    'Graphique',
    'svc.d3.p1':    "Une image forte commence par un design professionnel. Notre équipe créative travaille en étroite collaboration avec vous pour concevoir des visuels qui reflètent fidèlement votre identité.",
    'svc.d3.p2':    "Nous livrons tous les fichiers sources dans les formats adaptés à l'impression (CMJN, haute résolution) et au digital (RVB, formats web optimisés).",
    'svc.d3.li1':   'Création de logo et identité visuelle',
    'svc.d3.li2':   'Charte graphique complète',
    'svc.d3.li3':   'Maquettes print et supports digitaux',
    'svc.d3.li4':   'Supports de communication (brochures, flyers)',
    'svc.d3.li5':   'Retouche et montage photo professionnel',
    'svc.d3.li6':   'Visuels pour réseaux sociaux',
    'svc.d3.li7':   'Création de tampons et cachets',
    'svc.d3.li8':   'Habillage véhicule (visuel)',
    'svc.d3.btn':   'Demander un devis Design →',
    'svc.d4.tag':   'Cadeaux & Goodies',
    'svc.d4.title': 'Objets',
    'svc.d4.em':    'Personnalisés',
    'svc.d4.p1':    "Les objets personnalisés sont d'excellents vecteurs de communication et de fidélisation. Offrez à vos clients, employés ou partenaires des cadeaux utiles et marqués à votre effigie.",
    'svc.d4.p2':    "Idéaux pour les lancements de produits, anniversaires d'entreprise, fêtes de fin d'année, mariages, séminaires et tout autre événement.",
    'svc.d4.li1':   'Mugs et tasses personnalisés',
    'svc.d4.li2':   'Stylos et fournitures de bureau',
    'svc.d4.li3':   'Carnets et agendas',
    'svc.d4.li4':   'Stickers et autocollants',
    'svc.d4.li5':   'Badges et épinglettes',
    'svc.d4.li6':   'Porte-clés personnalisés',
    'svc.d4.li7':   'Coussins et textiles maison',
    'svc.d4.li8':   'Calendriers et planners',
    'svc.d4.btn':   'Demander un devis Objets →',
    // ── Services page — FAQ ──
    'svc.faq.tag':      'Questions fréquentes',
    'svc.faq.title':    'Vous avez des questions ?',
    'svc.faq.title.em': 'Nous avons les réponses.',
    'svc.faq.q1':       'Quels sont vos délais de production ?',
    'svc.faq.q2':       "Quels fichiers dois-je fournir pour l'impression ?",
    'svc.faq.q3':       'Y a-t-il des quantités minimales à commander ?',
    'svc.faq.q4':       'Livrez-vous à domicile ou en dehors de Lomé ?',
    'svc.faq.q5':       'Comment se déroule la validation avant impression ?',
    'svc.faq.q6':       'Quel est votre mode de paiement ?',
    // ── Services page — CTA ──
    'svc.cta.title': 'Prêt à lancer votre projet ?',
    'svc.cta.desc':  'Obtenez un devis gratuit et personnalisé en moins de 2 heures.',
    'svc.cta.btn':   'Demander un devis gratuit',
    // ── Portfolio page ──
    'pf.page.hero.title': 'Nos Réalisations',
    'pf.page.hero.sub':   'Des projets concrets qui témoignent de notre savoir-faire et de notre engagement pour la qualité.',
    'pf.filter.all':      'Tout',
    'pf.filter.seri':     'Sérigraphie',
    'pf.filter.imp':      'Impression',
    'pf.filter.design':   'Design',
    'pf.filter.objets':   'Objets',
    'pf.cta.text':        'Vous avez un projet similaire ? Parlons-en !',
    'pf.cta.title':       'Votre projet mérite le meilleur.',
    'pf.cta.p':           'Devis gratuit, réponse en moins de 2 heures, livraison rapide à Lomé.',
    'pf.cta.btn':         'Demander un devis gratuit',
    // ── About page — hero ──
    'about.hero.title':  'À Propos de FINEX PRO',
    'about.hero.sub':    'Imprimerie, sérigraphie, design graphique et fournitures de bureau — votre partenaire visuel à Lomé, Togo.',
    // ── About page — history ──
    'about.hist.tag':    'Notre Histoire',
    'about.hist.title':  'Une passion née',
    'about.hist.em':     'à Lomé',
    'about.hist.p1':     "FINEX PRO est née à Adidogomé, au cœur de Lomé, portée par une vision simple mais ambitieuse : offrir aux entreprises, associations et particuliers du Togo des solutions d'impression professionnelles, accessibles et rapides.",
    'about.hist.p2':     "L'entreprise s'est spécialisée dans la sérigraphie textile avant d'élargir son offre à l'impression numérique grand format, au design graphique et aux objets personnalisés.",
    'about.hist.p3':     "Aujourd'hui, notre atelier équipé de machines modernes et notre équipe dynamique traitent chaque jour des commandes pour des clients de toute la région : boutiques, ONG, écoles, administrations et grandes entreprises.",
    'about.tagline':     'Votre partenaire impression',
    'about.mission.title': '🎯 Mission',
    'about.mission.text':  "Offrir des solutions d'impression professionnelles, abordables et rapides à chaque client, sans compromis sur la qualité.",
    'about.vision.title':  '👁 Vision',
    'about.vision.text':   "Devenir la référence incontournable de la communication visuelle en Afrique de l'Ouest.",
    // ── About page — values ──
    'about.val.tag':      'Ce qui nous définit',
    'about.val.title':    'Nos',
    'about.val.title.em': 'Valeurs',
    'about.val.desc':     'Ces principes guident chacune de nos décisions, de la prise de commande à la livraison finale.',
    'about.val1.title':   'Qualité',
    'about.val1.p':       "Nous utilisons des encres et matériaux premium pour des résultats durables et des couleurs fidèles à votre brief. Chaque commande passe par un contrôle qualité avant livraison.",
    'about.val2.title':   'Réactivité',
    'about.val2.p':       "Votre temps est précieux. Nous garantissons un premier retour sous 2 heures, des devis clairs en quelques minutes et des délais de production parmi les plus rapides du marché.",
    'about.val3.title':   'Proximité',
    'about.val3.p':       "Basés à Lomé, nous connaissons le tissu économique local. Nous accompagnons nos clients de manière personnalisée, en comprenant leurs contraintes et leurs ambitions.",
    'about.val4.title':   'Innovation',
    'about.val4.p':       "Nous investissons régulièrement dans de nouveaux équipements pour proposer des techniques d'impression à la pointe. Notre équipe se forme continuellement aux nouvelles tendances du secteur.",
    // ── About page — counters ──
    'about.cnt1': 'Clients satisfaits',
    'about.cnt2': "Années d'expérience",
    'about.cnt3': 'Projets réalisés',
    'about.cnt4': 'Partenaires référencés',
    // ── About page — team ──
    'about.team.tag':      'Les visages derrière FINEX PRO',
    'about.team.title':    'Notre',
    'about.team.title.em': 'Équipe',
    'about.team.desc':     "Des professionnels passionnés au service de vos projets d'impression.",
    'about.t1.name': 'FIANKE KOMLAN',
    'about.t1.role': 'Directeur Général',
    'about.t1.bio':  "À la tête de FINEX PRO, il pilote la vision de l'entreprise avec un engagement fort pour la qualité, la proximité et l'innovation au service des clients.",
    'about.t2.name': 'Équipe Atelier',
    'about.t2.role': 'Production & Impression',
    'about.t2.bio':  "Notre équipe d'atelier assure la fabrication et l'impression de chaque commande avec précision, en respectant les délais et les exigences de qualité.",
    'about.t3.name': 'Équipe Livraison',
    'about.t3.role': 'Logistique & Distribution',
    'about.t3.bio':  "Notre équipe mobile prend en charge la livraison rapide dans tout Lomé et les environs, pour que vos commandes arrivent à temps, en parfait état.",
    // ── About page — "Why us" ──
    'about.diff.tag':   'La différence FINEX PRO',
    'about.diff.title': 'Pourquoi nous',
    'about.diff.em':    'choisir ?',
    'about.w1.h': 'Équipements Modernes',
    'about.w1.p': "Nous disposons d'équipements modernes adaptés à chaque type d'impression, pour des résultats précis et durables sur tous vos supports.",
    'about.w2.h': 'Devis Gratuit en 2h',
    'about.w2.p': "Envoyez votre projet via WhatsApp et recevez un devis détaillé sans engagement en moins de 2 heures ouvrables.",
    'about.w3.h': 'Livraison à Lomé',
    'about.w3.p': "Livraison rapide dans tout Lomé et les environs. Service express 48h disponible pour les commandes urgentes sans surcoût excessif.",
    'about.w4.h': 'Validation Avant Impression',
    'about.w4.p': "Aucune impression sans votre accord. Nous vous envoyons systématiquement un bon à tirer pour validation avant de lancer la production.",
    'about.w5.h': 'Prix Transparents',
    'about.w5.p': "Tarification claire et sans surprises. Devis détaillé par poste, remises dégressives sur les grandes quantités, paiement mobile money accepté.",
    'about.w6.h': 'Service Client Dédié',
    'about.w6.p': "Une équipe disponible 6 jours sur 7 via WhatsApp pour répondre à toutes vos questions, de la commande à la livraison.",
    // ── About page — location ──
    'about.loc.tag':   'Nous trouver',
    'about.loc.title': 'Notre',
    'about.loc.em':    'Localisation',
    'about.loc.p':     'Venez nous rendre visite à notre atelier ou contactez-nous avant de vous déplacer.',
    'about.loc.btn':   'Nous trouver sur Maps →',
    // ── About page — CTA ──
    'about.cta.title': 'Parlons de votre projet.',
    'about.cta.desc':  'Notre équipe est disponible du lundi au samedi pour vous accompagner de l\'idée à la livraison.',
    'about.cta.btn':   'Nous contacter →',
    // ── About page — présentation ──
    'about.who.tag':      'Qui sommes-nous',
    'about.who.title':    'FINEX PRO,',
    'about.who.title.em': "l'impression au service de votre image",
    'about.who.p1':       "FINEX PRO est une agence de prestation de services d'imprimerie spécialisée dans la conception de graphique visuel et le choix sur les couleurs — design graphique, conception de logo, flyers, dépliants, affiche publicitaire, impression sur tous supports (papier, habit, vinyle, bâche...).",
    'about.who.p2':       "Implantée à Lomé – Adidogomé, nous sommes spécialisés dans les services d'imprimerie, de sérigraphie et la vente de fournitures de bureau. Nous accompagnons entreprises, associations et particuliers du Togo dans tous leurs projets de communication visuelle.",
    'about.who.p3':       "Notre agence dispose d'une équipe dynamique pour recevoir et analyser vos demandes, et d'une équipe mobile pour vous servir et vous livrer en un temps record. Nos services ont acquis de l'expérience et de la compétence pour étudier, planifier, estimer le budget nécessaire et réaliser un projet de la phase d'étude jusqu'à son terme.",
    'about.mission.pill': 'Mission',
    'about.mission.val':  "Mettre à votre disposition notre expertise technique et artistique pour la réalisation de tous vos projets d'imprimerie et de sérigraphie, avec des solutions innovantes et créatives.",
    'about.vision.pill':  'Vision',
    'about.vision.val':   "Devenir la référence incontournable de la communication visuelle au Togo, en plaçant la satisfaction client au cœur de chaque réalisation.",
    // ── About page — prestations ──
    'about.svc.tag':      'Ce que nous faisons',
    'about.svc.title':    'Nos',
    'about.svc.title.em': 'Prestations',
    'about.svc.desc':     "Quatre domaines d'expertise pour répondre à tous vos besoins en communication visuelle et fournitures.",
    'about.svc1.title':   'Conception Graphique',
    'about.svc1.p':       "Logo, carte de visite, cartes d'invitation, dépliants, badges et toute création visuelle pour votre identité de marque.",
    'about.svc2.title':   "Travaux d'Imprimerie",
    'about.svc2.p':       "Bâche, autocollant, calendrier, macarons, carnet de tontine, facturier et tous travaux d'impression sur papier et supports rigides.",
    'about.svc3.title':   'Impression sur Supports',
    'about.svc3.p':       "Impression personnalisée sur T-shirts, casquettes, tasses, stylos et tout objet promotionnel pour vos événements et campagnes.",
    'about.svc4.title':   'Fournitures de Bureau',
    'about.svc4.p':       "Vente et livraison d'articles bureautiques et informatiques : papeterie, mobilier de bureau et fournitures pour entreprises et administrations.",
    // ── About page — produits ──
    'about.prod.tag':      'Notre catalogue',
    'about.prod.title':    'Nos',
    'about.prod.title.em': 'Produits phares',
    'about.prod.desc':     'Une large gamme de supports pour porter votre communication visuelle au quotidien.',
    'about.p1.title': 'Calendrier de poche',  'about.p1.p': '8,5 × 5 cm · Quadri recto/verso — Idéal pour la distribution de masse.',
    'about.p2.title': 'Calendrier de table',  'about.p2.p': '21 × 10 cm · Pelliculé — Design élégant, peu encombrant.',
    'about.p3.title': 'Calendrier mural',     'about.p3.p': 'Grand format · Papier carton ou bâche — Visibilité maximale.',
    'about.p4.title': 'Kakemono',             'about.p4.p': "Bâche & papier viril — Idéal pour les événements.",
    'about.p5.title': 'Badges',               'about.p5.p': "Identification du personnel — Pour événements & entreprises.",
    'about.p6.title': 'Dépliants',            'about.p6.p': "Informer sur vos activités — Format et finitions au choix.",
    'about.p7.title': 'Sacs',                 'about.p7.p': "Accompagnez votre client pendant et après l'achat.",
    'about.p8.title': 'T-shirts & Casquettes','about.p8.p': "Habiller votre équipe pour promos & événements.",
    'about.p9.title': 'Cachets & Tampons',    'about.p9.p': "Timbre en caoutchouc pour marquage de supports.",
    // ── About page — counters (actual labels) ──
    'about.c1.label': 'Clients satisfaits',
    'about.c2.label': "Domaines d'expertise",
    'about.c3.label': 'Produits au catalogue',
    'about.c4.label': 'Partenaires référencés',
    // ── About page — team (actual roles) ──
    'about.t2.name.a': 'Équipe Atelier',     'about.t2.role.a': 'Conception & Production',
    'about.t3.name.a': 'Équipe Livraison',   'about.t3.role.a': 'Service & Livraison',
    // ── About page — why us (actual content) ──
    'about.why1.h': 'Expertise Technique & Artistique',
    'about.why1.p': "Notre équipe maîtrise la conception graphique, la sérigraphie et l'imprimerie sur tous supports. Chaque projet est étudié, planifié et exécuté avec soin.",
    'about.why2.h': 'Devis Gratuit en 2h',
    'about.why2.p': "Envoyez votre projet via WhatsApp au +228 90 43 69 29 et recevez un devis détaillé et clair sans engagement en moins de 2 heures ouvrables.",
    'about.why3.h': 'Livraison Rapide à Lomé',
    'about.why3.p': "Notre équipe mobile assure la livraison de vos commandes partout à Lomé et ses environs, en un temps record selon vos délais.",
    'about.why4.h': 'Validation Avant Impression',
    'about.why4.p': "Aucune impression sans votre accord. Nous vous soumettons systématiquement un bon à tirer pour validation avant de lancer la production.",
    'about.why5.h': 'Gamme Complète',
    'about.why5.p': "Du design graphique aux fournitures de bureau, en passant par la sérigraphie et les gadgets publicitaires, tout est disponible chez FINEX PRO.",
    'about.why6.h': 'Service Client Disponible',
    'about.why6.p': "Disponibles du lundi au samedi via WhatsApp pour répondre à vos questions, vous accompagner et suivre l'avancement de votre commande.",
    // ── About page — location labels ──
    'about.loc.addr.label':  'Adresse',
    'about.loc.phone.label': 'Nos numéros',
    'about.loc.email.label': 'Email',
    'about.loc.hours.label': "Horaires d'ouverture",
    'about.loc.hours.val':   'Lundi – Samedi : 8h00 – 19h00',
    // ── Contact page ──
    'contact.hero.title':    'Contactez-nous',
    'contact.hero.sub':      'Nous sommes disponibles du lundi au samedi, 8h–19h. Réponse garantie sous 2 heures.',
    'contact.card.title':    'Nos coordonnées',
    'contact.info.wa':       'WhatsApp (Priorité)',
    'contact.info.addr':     'Adresse',
    'contact.info.hours':    'Horaires',
    'contact.info.email':    'Email',
    'contact.wa.btn.title':  'Écrire sur WhatsApp',
    'contact.form.title':    'Envoyez-nous un message',
    'contact.label.name':    'Nom complet *',
    'contact.label.email':   'Email',
    'contact.label.phone':   'Téléphone *',
    'contact.label.subject': 'Sujet',
    'contact.label.message': 'Votre message *',
    'contact.form.btn':      'Envoyer via WhatsApp',
    'contact.form.note':     'Réponse garantie sous 2 heures ouvrables — du lundi au samedi.',
    'contact.faq.tag':       'Questions fréquentes',
    'contact.faq.title':     'Vos questions,',
    'contact.faq.title.em':  'nos réponses',
    'contact.faq.q1':        'Quel est le délai de réponse à une demande de devis ?',
    'contact.faq.q2':        'Comment puis-je passer une commande ?',
    'contact.faq.q3':        'Puis-je venir visiter votre atelier ?',
    'contact.faq.q4':        'Comment se déroule le suivi de ma commande ?',
    // ── Devis page ──
    'devis.hero.title':    'Obtenez votre devis gratuit',
    'devis.hero.em':       'en 2 minutes',
    'devis.hero.sub':      'Remplissez le formulaire ci-dessous et recevez une réponse personnalisée sous 24 heures.',
    'devis.how.tag':       'Simple & Rapide',
    'devis.how.title':     'Comment ça',
    'devis.how.title.em':  'marche ?',
    'devis.how.s1.title':  'Remplissez le formulaire',
    'devis.how.s1.p':      "Décrivez votre projet en 3 étapes simples : type de service, détails du projet, et vos coordonnées.",
    'devis.how.s2.title':  'Recevez votre devis sous 24h',
    'devis.how.s2.p':      "Notre équipe analyse votre demande et vous envoie un devis détaillé et personnalisé via WhatsApp.",
    'devis.how.s3.title':  'Validez et lancez la production',
    'devis.how.s3.p':      "Après votre accord, nous lançons la production et vous livrons dans les délais convenus.",
    'devis.step1.label':   'Service',
    'devis.step2.label':   'Détails',
    'devis.step3.label':   'Coordonnées',
    'devis.s1.title':      'Quel service vous intéresse ?',
    'devis.s1.sub':        'Sélectionnez le type de prestation pour lequel vous souhaitez un devis.',
    'devis.sc1.title':     'Sérigraphie Textile',
    'devis.sc1.p':         'T-shirts, polos, uniformes, casquettes, sacs…',
    'devis.sc2.title':     'Impression Numérique',
    'devis.sc2.p':         'Bâches, flyers, affiches, roll-ups, autocollants…',
    'devis.sc3.title':     'Design Graphique',
    'devis.sc3.p':         'Logo, charte graphique, maquettes, retouche…',
    'devis.sc4.title':     'Objets Personnalisés',
    'devis.sc4.p':         'Mugs, stylos, carnets, porte-clés, badges…',
    'devis.s2.title':      'Détails de votre projet',
    'devis.s2.sub':        'Précisez vos besoins pour recevoir un devis au plus proche de la réalité.',
    'devis.s3.title':      'Vos coordonnées',
    'devis.s3.sub':        'Pour vous envoyer votre devis personnalisé via WhatsApp.',
    'devis.btn.next':      'Étape suivante →',
    'devis.btn.prev':      '← Retour',
    'devis.btn.submit':    'Envoyer ma demande de devis',
    'devis.g1.title':      'Devis 100% Gratuit',
    'devis.g1.p':          "Notre devis est entièrement gratuit et sans aucune obligation d'achat de votre part.",
    'devis.g2.title':      'Réponse sous 24h',
    'devis.g2.p':          "Nous nous engageons à vous envoyer votre devis personnalisé dans les 24 heures ouvrables.",
    'devis.g3.title':      'Sans Engagement',
    'devis.g3.p':          "Recevoir un devis ne vous engage à rien. Vous décidez librement de donner suite ou non.",
    'devis.g4.title':      'Conseils Personnalisés',
    'devis.g4.p':          "Notre équipe vous conseille sur les meilleures options selon votre budget et vos besoins.",
    // ── Privacy page ──
    'prv.hero.title':  'Politique de Confidentialité',
    'prv.hero.sub':    'Comment FINEX PRO collecte, utilise et protège vos données personnelles.',
    'prv.breadcrumb':  'Confidentialité',
    'prv.hl1.title':   'Données sécurisées',       'prv.hl1.sub': 'Accès strictement limité en interne',
    'prv.hl2.title':   'Aucune revente',            'prv.hl2.sub': 'Vos données ne sont jamais vendues',
    'prv.hl3.title':   'Réponse sous 30 jours',    'prv.hl3.sub': "Pour toute demande d'exercice de droits",
    'prv.hl4.title':   'Vos droits respectés',     'prv.hl4.sub': 'Accès, rectification, suppression',
    'prv.toc.label':   'Sur cette page',
    'prv.toc.date':    'Mise à jour : Mai 2025',
    'prv.toc.1':  '01 · Qui sommes-nous ?',    'prv.toc.2':  '02 · Données collectées',
    'prv.toc.3':  '03 · Finalité du traitement','prv.toc.4':  '04 · Base légale',
    'prv.toc.5':  '05 · Conservation',         'prv.toc.6':  '06 · Partage des données',
    'prv.toc.7':  '07 · Sécurité',             'prv.toc.8':  '08 · Cookies',
    'prv.toc.9':  '09 · Vos droits',           'prv.toc.10': '10 · Modifications',
    'prv.s1.title': 'Qui sommes-nous ?',
    'prv.s1.p':     "La présente politique s'applique au site web de FINEX PRO, entreprise spécialisée en sérigraphie, impression numérique, design graphique et objets personnalisés, dont le siège est situé à Adidogomé Wessomé, Lomé, Togo.",
    'prv.s1.resp':  'Responsable du traitement :',
    'prv.s2.title': 'Données collectées',
    'prv.s2.p1':    'Dans le cadre de l\'utilisation de notre site et de nos services, nous pouvons collecter :',
    'prv.s2.p2':    'Ces données sont collectées uniquement via le formulaire de contact, le formulaire de devis ou vos messages WhatsApp.',
    'prv.s2.t1':'Nom & prénom', 'prv.s2.t2':'Téléphone', 'prv.s2.t3':'Adresse e-mail',
    'prv.s2.t4':'Données de projet', 'prv.s2.t5':'Données de navigation',
    'prv.s3.title': 'Finalité du traitement',
    'prv.s3.p':     'Vos données sont utilisées exclusivement pour :',
    'prv.s3.l1':    'Répondre à vos demandes de devis et de renseignements',
    'prv.s3.l2':    'Traiter et suivre vos commandes d\'impression et de design',
    'prv.s3.l3':    'Vous envoyer les confirmations et mises à jour relatives à votre commande',
    'prv.s3.l4':    'Améliorer la qualité de nos services et de notre site web',
    'prv.s3.l5':    'Respecter nos obligations légales et comptables',
    'prv.s3.note':  'Nous n\'utilisons pas vos données à des fins de prospection commerciale sans votre consentement préalable.',
    'prv.s4.title': 'Base légale du traitement',
    'prv.s4.c1.title': 'Contrat',         'prv.s4.c1.p': 'Lorsque vous passez commande ou demandez un devis',
    'prv.s4.c2.title': 'Consentement',    'prv.s4.c2.p': 'Lorsque vous remplissez volontairement nos formulaires',
    'prv.s4.c3.title': 'Intérêt légitime','prv.s4.c3.p': 'Pour améliorer nos services et répondre à vos demandes',
    'prv.s5.title': 'Conservation des données',
    'prv.s5.d1':    '1 an',   'prv.s5.d1.label': 'Données de prospection, à compter du dernier contact',
    'prv.s5.d2':    '10 ans', 'prv.s5.d2.label': 'Données de transactions commerciales (obligations comptables)',
    'prv.s5.p':     'Au-delà de ces délais, vos données sont définitivement supprimées ou anonymisées.',
    'prv.s6.title': 'Partage des données',
    'prv.s6.note':  'FINEX PRO ne vend, ne loue et ne partage jamais vos données à des tiers à des fins commerciales.',
    'prv.s6.p':     'Un partage est possible uniquement dans ces cas strictement limités :',
    'prv.s6.l1':    'Prestataires techniques indispensables au fonctionnement du site (hébergement)',
    'prv.s6.l2':    'Obligation légale ou réquisition judiciaire',
    'prv.s6.wa':    'Les messages envoyés via WhatsApp sont traités selon la politique de confidentialité de WhatsApp (Meta).',
    'prv.s7.title': 'Sécurité des données',
    'prv.s7.p1':    'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou divulgation.',
    'prv.s7.p2':    'L\'accès aux données est strictement limité aux personnes habilitées au sein de FINEX PRO.',
    'prv.s8.title': 'Cookies',
    'prv.s8.p1':    'Notre site utilise un nombre minimal de cookies techniques nécessaires à son bon fonctionnement (préférences de langue, session). Nous n\'utilisons pas de cookies publicitaires ni de traceurs tiers à des fins de profilage.',
    'prv.s8.p2':    'Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur. Cela peut affecter certaines fonctionnalités du site.',
    'prv.s9.title': 'Vos droits',
    'prv.s9.r1.title':'Accès',         'prv.s9.r1.p': 'Obtenir une copie de vos données',
    'prv.s9.r2.title':'Rectification', 'prv.s9.r2.p': 'Corriger des données inexactes',
    'prv.s9.r3.title':'Effacement',    'prv.s9.r3.p': 'Demander la suppression',
    'prv.s9.r4.title':'Opposition',    'prv.s9.r4.p': 'Vous opposer au traitement',
    'prv.s9.r5.title':'Portabilité',   'prv.s9.r5.p': 'Recevoir vos données structurées',
    'prv.s9.contact': 'Pour exercer vos droits, écrivez à finexpromail@gmail.com ou via WhatsApp. Réponse garantie sous 30 jours.',
    'prv.s10.title': 'Modifications de cette politique',
    'prv.s10.p1':   'FINEX PRO se réserve le droit de modifier la présente politique à tout moment, notamment en cas d\'évolution légale ou de changement de pratiques. La date figurant en haut de cette page sera actualisée.',
    'prv.s10.p2':   'Nous vous encourageons à consulter régulièrement cette page pour rester informé.',
    'prv.cta.title': 'Une question sur vos données ?',
    'prv.cta.p':     'Notre équipe vous répond dans les meilleurs délais.',
  },
  en: {
    // ── Navbar ──
    'nav.home':     'Home',
    'nav.services': 'Services',
    'nav.portfolio':'Portfolio',
    'nav.about':    'About',
    'nav.contact':  'Contact',
    'nav.devis':    'Free Quote',
    // ── Hero (index) ──
    'hero.badge':        'Lomé, Togo · Pro Printing',
    'hero.title.prefix': 'We print on',
    'hero.sub':          'Screen Printing · Digital Printing · Graphic Design · Custom Products',
    'hero.sub.strong':   'Quality, speed, professionalism.',
    'hero.cta.wa':       'Contact us on WhatsApp',
    'hero.cta.devis':    'Get a quote',
    'hero.stat1':        'Satisfied clients',
    'hero.stat2':        'Fields of expertise',
    'hero.stat3':        'Express delivery',
    'hero.card1':        'Screen Printing',
    'hero.card2':        'Graphic Design',
    'hero.card3':        'Custom Products',
    // ── Services section (index) ──
    'svc.tag':       'Our Services',
    'svc.title':     'Everything you need',
    'svc.title.em':  'for your image',
    'svc.desc':      'From design to delivery, FINEX PRO guides you through all your printing and visual communication projects.',
    'svc.all':       'See all our services →',
    'svc.s1.title':  'Screen Printing',
    'svc.s1.desc':   'Print on T-shirts, polos, uniforms, caps and all types of clothing. Professional and long-lasting results.',
    'svc.s1.f1':     'T-shirts & polos',
    'svc.s1.f2':     'Corporate uniforms',
    'svc.s1.f3':     'Small & large runs',
    'svc.s1.btn':    'Learn more →',
    'svc.s2.title':  'Digital Printing',
    'svc.s2.badge':  'Popular',
    'svc.s2.desc':   'Flyers, posters, banners, large format signage. High-definition prints for all your media.',
    'svc.s2.f1':     'Flyers & posters',
    'svc.s2.f2':     'Large format banners',
    'svc.s2.f3':     'Signage & roll-ups',
    'svc.s2.btn':    'Learn more →',
    'svc.s3.title':  'Graphic Design',
    'svc.s3.desc':   'Logo creation, brand guidelines, marketing visuals. Give your brand a strong identity.',
    'svc.s3.f1':     'Logo & visual identity',
    'svc.s3.f2':     'Marketing materials',
    'svc.s3.f3':     'Editing & compositing',
    'svc.s3.btn':    'Learn more →',
    'svc.s4.title':  'Custom Products',
    'svc.s4.desc':   'Mugs, keychains, fans, invitations. Perfect for corporate gifts, events and promotions.',
    'svc.s4.f1':     'Mugs & goodies',
    'svc.s4.f2':     'Invitations & cards',
    'svc.s4.f3':     'Corporate gifts',
    'svc.s4.btn':    'Learn more →',
    // ── Portfolio section (index) ──
    'pf.tag':      'Our Work',
    'pf.title':    'Our work',
    'pf.title.em': 'speaks for itself',
    'pf.all':      'See all our work →',
    // ── Testimonials ──
    'testi.tag':      'Testimonials',
    'testi.title':    'What our',
    'testi.title.em': 'clients say',
    // ── Partners ──
    'partners.label': 'They trust us',
    // ── CTA (index) ──
    'cta.title': 'Ready to bring your project to life?',
    'cta.desc':  'Contact us now and get a free quote in less than 2 hours.',
    'cta.btn':   'Request a free quote',
    // ── Footer ──
    'footer.brand.desc': 'Your partner in printing, screen printing and visual communication in Lomé, Togo.',
    'footer.nav.h':     'Navigation',
    'footer.svc.h':     'Services',
    'footer.contact.h': 'Contact',
    'footer.hours':     'Mon–Sat: 8am – 7pm',
    'footer.copy':      '© 2025 FINEX PRO. All rights reserved.',
    'footer.tagline':   'Lomé, Togo · Printing & Visual Communication',
    'footer.svc.s1':    'Screen Printing',
    'footer.svc.s2':    'Digital Printing',
    'footer.svc.s3':    'Graphic Design',
    'footer.svc.s4':    'Custom Products',
    // ── Breadcrumb ──
    'bc.home': 'Home',
    // ── Services page — hero & intro ──
    'svc.page.hero.title':  'Our Services',
    'svc.page.hero.sub':    'Professional printing, creative design and custom products — everything for your image.',
    'svc.page.intro.tag':   'Our Expertise',
    'svc.page.intro.title': 'FINEX PRO, your partner',
    'svc.page.intro.em':    'in visual communication',
    'svc.intro.p':          'FINEX PRO supports businesses, associations and individuals in Lomé with all their printing and visual communication projects. With modern equipment and an expert team, we guarantee high-quality results, on-time delivery and competitive prices.',
    // ── Services page — detail blocks ──
    'svc.d1.tag':   'Textile & Clothing',
    'svc.d1.title': 'Screen',
    'svc.d1.em':    'Printing',
    'svc.d1.p1':    'Screen printing is our core specialty. With state-of-the-art equipment, we print on all types of garments with durable inks and vibrant colors that withstand time and washing.',
    'svc.d1.p2':    'Our creations dress corporate teams, athletes, associations, cultural events and much more across Lomé and Togo.',
    'svc.d1.li1':   'T-shirts (round neck, V-neck, long sleeve)',
    'svc.d1.li2':   'Polos and professional shirts',
    'svc.d1.li3':   'Corporate wear and uniforms',
    'svc.d1.li4':   'Lab coats and work aprons',
    'svc.d1.li5':   'Custom fabric bags',
    'svc.d1.li6':   'Caps and beanies',
    'svc.d1.li7':   'Bibs and baby clothing',
    'svc.d1.li8':   'Aprons (kitchen, craftsmen, retail)',
    'svc.d1.btn':   'Request a Screen Printing Quote →',
    'svc.d2.tag':   'Large Format & Marketing',
    'svc.d2.title': 'Digital',
    'svc.d2.em':    'Printing',
    'svc.d2.p1':    'Our digital printing workshop has large-format equipment that allows printing on a wide range of media at maximum resolution. From A5 flyers to 10-meter banners, we handle every format.',
    'svc.d2.p2':    'Every job is checked before delivery to ensure color accuracy and text sharpness, even at very large formats.',
    'svc.d2.li1':   'Large format banners (events, retail)',
    'svc.d2.li2':   'Roll-ups and kakemonos',
    'svc.d2.li3':   'Flyers and leaflets (A4, A5, tri-fold)',
    'svc.d2.li4':   'High-definition posters',
    'svc.d2.li5':   'Premium business cards',
    'svc.d2.li6':   'Banners and pennants',
    'svc.d2.li7':   'Cut stickers and decals',
    'svc.d2.li8':   'Interior and exterior signage',
    'svc.d2.btn':   'Request a Printing Quote →',
    'svc.d3.tag':   'Identity & Creativity',
    'svc.d3.title': 'Graphic',
    'svc.d3.em':    'Design',
    'svc.d3.p1':    'A strong image starts with professional design. Our creative team works closely with you to create visuals that faithfully reflect your identity and captivate your audience.',
    'svc.d3.p2':    'We deliver all source files in formats suited for print (CMYK, high resolution) and digital (RGB, optimized web formats).',
    'svc.d3.li1':   'Logo creation and visual identity',
    'svc.d3.li2':   'Complete brand guidelines',
    'svc.d3.li3':   'Print mockups and digital materials',
    'svc.d3.li4':   'Communication materials (brochures, flyers)',
    'svc.d3.li5':   'Professional photo editing and compositing',
    'svc.d3.li6':   'Social media visuals',
    'svc.d3.li7':   'Stamp and seal creation',
    'svc.d3.li8':   'Vehicle wrap design',
    'svc.d3.btn':   'Request a Design Quote →',
    'svc.d4.tag':   'Gifts & Goodies',
    'svc.d4.title': 'Custom',
    'svc.d4.em':    'Products',
    'svc.d4.p1':    'Custom products are excellent communication and loyalty tools. Give your clients, employees or partners useful gifts branded with your image. FINEX PRO offers a wide range of customizable products.',
    'svc.d4.p2':    'Perfect for product launches, company anniversaries, year-end events, weddings, seminars and any other occasion.',
    'svc.d4.li1':   'Custom mugs and cups',
    'svc.d4.li2':   'Pens and office supplies',
    'svc.d4.li3':   'Notebooks and planners',
    'svc.d4.li4':   'Stickers and decals',
    'svc.d4.li5':   'Badges and pins',
    'svc.d4.li6':   'Custom keychains',
    'svc.d4.li7':   'Cushions and home textiles',
    'svc.d4.li8':   'Calendars and planners',
    'svc.d4.btn':   'Request a Custom Products Quote →',
    // ── Services page — FAQ ──
    'svc.faq.tag':      'Frequently Asked Questions',
    'svc.faq.title':    'Have a question?',
    'svc.faq.title.em': 'We have the answers.',
    'svc.faq.q1':       'What are your production times?',
    'svc.faq.q2':       'What files should I provide for printing?',
    'svc.faq.q3':       'Are there minimum order quantities?',
    'svc.faq.q4':       'Do you deliver outside Lomé?',
    'svc.faq.q5':       'How does pre-print approval work?',
    'svc.faq.q6':       'What payment methods do you accept?',
    // ── Services page — CTA ──
    'svc.cta.title': 'Ready to launch your project?',
    'svc.cta.desc':  'Get a free personalized quote in less than 2 hours.',
    'svc.cta.btn':   'Get a free quote',
    // ── Portfolio page ──
    'pf.page.hero.title': 'Our Work',
    'pf.page.hero.sub':   'Concrete projects that reflect our expertise and commitment to quality.',
    'pf.filter.all':      'All',
    'pf.filter.seri':     'Screen Printing',
    'pf.filter.imp':      'Printing',
    'pf.filter.design':   'Design',
    'pf.filter.objets':   'Objects',
    'pf.cta.text':        "Have a similar project? Let's talk!",
    'pf.cta.title':       'Your project deserves the best.',
    'pf.cta.p':           'Free quote, response in under 2 hours, fast delivery in Lomé.',
    'pf.cta.btn':         'Get a free quote',
    // ── About page — hero ──
    'about.hero.title':  'About FINEX PRO',
    'about.hero.sub':    'Printing, screen printing, graphic design and office supplies — your visual partner in Lomé, Togo.',
    // ── About page — history ──
    'about.hist.tag':    'Our Story',
    'about.hist.title':  'A passion born',
    'about.hist.em':     'in Lomé',
    'about.hist.p1':     "FINEX PRO was born in Adidogomé, at the heart of Lomé, driven by a simple yet ambitious vision: to offer businesses, associations and individuals in Togo professional, accessible and fast printing solutions.",
    'about.hist.p2':     "The company specialized in screen printing before expanding into large-format digital printing, graphic design and custom products.",
    'about.hist.p3':     "Today, our workshop equipped with modern machinery and our dynamic team handle daily orders for clients across the region: shops, NGOs, schools, municipalities and major companies.",
    'about.tagline':     'Your printing partner',
    'about.mission.title': '🎯 Mission',
    'about.mission.text':  "Provide professional, affordable and fast printing solutions to every client, without compromising on quality.",
    'about.vision.title':  '👁 Vision',
    'about.vision.text':   "Become the leading reference in visual communication in West Africa.",
    // ── About page — values ──
    'about.val.tag':      'What defines us',
    'about.val.title':    'Our',
    'about.val.title.em': 'Values',
    'about.val.desc':     'These principles guide every decision we make, from order to final delivery.',
    'about.val1.title':   'Quality',
    'about.val1.p':       "We use premium inks and materials for durable results and colors faithful to your brief. Every order goes through a quality check before delivery.",
    'about.val2.title':   'Responsiveness',
    'about.val2.p':       "Your time is precious. We guarantee a first response within 2 hours, clear quotes in minutes and some of the fastest production times on the market.",
    'about.val3.title':   'Proximity',
    'about.val3.p':       "Based in Lomé, we know the local business landscape. We support our clients in a personalized way, understanding their constraints and ambitions.",
    'about.val4.title':   'Innovation',
    'about.val4.p':       "We regularly invest in new equipment to offer cutting-edge printing techniques. Our team continually trains on the latest industry trends.",
    // ── About page — counters ──
    'about.cnt1': 'Satisfied clients',
    'about.cnt2': 'Years of experience',
    'about.cnt3': 'Projects completed',
    'about.cnt4': 'Referenced partners',
    // ── About page — team ──
    'about.team.tag':      'The people behind FINEX PRO',
    'about.team.title':    'Our',
    'about.team.title.em': 'Team',
    'about.team.desc':     'Passionate professionals dedicated to your printing projects.',
    'about.t1.name': 'FIANKE KOMLAN',
    'about.t1.role': 'General Manager',
    'about.t1.bio':  "At the helm of FINEX PRO, he drives the company vision with a strong commitment to quality, proximity and innovation in service of every client.",
    'about.t2.name': 'Workshop Team',
    'about.t2.role': 'Production & Printing',
    'about.t2.bio':  "Our workshop team handles the production and printing of every order with precision, respecting deadlines and quality standards.",
    'about.t3.name': 'Delivery Team',
    'about.t3.role': 'Logistics & Distribution',
    'about.t3.bio':  "Our mobile team handles fast delivery across Lomé and surrounding areas, ensuring your orders arrive on time and in perfect condition.",
    // ── About page — "Why us" ──
    'about.diff.tag':   'The FINEX PRO difference',
    'about.diff.title': 'Why choose',
    'about.diff.em':    'us?',
    'about.w1.h': 'Modern Equipment',
    'about.w1.p': "We use modern equipment suited to every type of printing, for precise and durable results across all your media.",
    'about.w2.h': 'Free Quote in 2h',
    'about.w2.p': "Send your project via WhatsApp and receive a detailed, no-commitment quote in under 2 business hours.",
    'about.w3.h': 'Lomé Delivery',
    'about.w3.p': "Fast delivery throughout Lomé and surrounding areas. 48h express service available for urgent orders at no excessive surcharge.",
    'about.w4.h': 'Pre-Print Approval',
    'about.w4.p': "No printing without your approval. We always send you a digital proof to validate before starting production.",
    'about.w5.h': 'Transparent Pricing',
    'about.w5.p': "Clear, no-surprise pricing. Detailed line-item quotes, volume discounts, mobile money payment accepted.",
    'about.w6.h': 'Dedicated Customer Service',
    'about.w6.p': "A team available 6 days a week via WhatsApp to answer all your questions from order to delivery.",
    // ── About page — location ──
    'about.loc.tag':   'Find us',
    'about.loc.title': 'Our',
    'about.loc.em':    'Location',
    'about.loc.p':     'Come visit our workshop or contact us before stopping by.',
    'about.loc.btn':   'Find us on Maps →',
    // ── About page — CTA ──
    'about.cta.title': "Let's talk about your project.",
    'about.cta.desc':  'Our team is available Monday to Saturday to support you from idea to delivery.',
    'about.cta.btn':   'Contact us →',
    // ── About page — presentation ──
    'about.who.tag':      'Who we are',
    'about.who.title':    'FINEX PRO,',
    'about.who.title.em': 'printing at the service of your image',
    'about.who.p1':       "FINEX PRO is a printing services agency specializing in visual graphic design — logo design, flyers, leaflets, advertising posters, printing on all media (paper, fabric, vinyl, canvas...).",
    'about.who.p2':       "Based in Lomé – Adidogomé, we specialize in printing, screen printing and office supply sales. We support businesses, associations and individuals across Togo in all their visual communication projects.",
    'about.who.p3':       "Our agency has a dynamic team to receive and analyze your requests, and a mobile team to serve and deliver to you in record time. Our services have built up the experience and expertise to study, plan, estimate budgets and complete projects from start to finish.",
    'about.mission.pill': 'Mission',
    'about.mission.val':  "Put our technical and artistic expertise at your disposal for all your printing and screen printing projects, with innovative and creative solutions.",
    'about.vision.pill':  'Vision',
    'about.vision.val':   "Become the leading reference in visual communication in Togo, placing customer satisfaction at the heart of every project.",
    // ── About page — services ──
    'about.svc.tag':      'What we do',
    'about.svc.title':    'Our',
    'about.svc.title.em': 'Services',
    'about.svc.desc':     "Four areas of expertise to meet all your visual communication and supply needs.",
    'about.svc1.title':   'Graphic Design',
    'about.svc1.p':       "Logo, business cards, invitation cards, leaflets, badges and all visual creations for your brand identity.",
    'about.svc2.title':   'Printing Works',
    'about.svc2.p':       "Banners, stickers, calendars, badges, notebooks, invoice books and all printing on paper and rigid media.",
    'about.svc3.title':   'Printing on Materials',
    'about.svc3.p':       "Custom printing on T-shirts, caps, mugs, pens and any promotional item for your events and campaigns.",
    'about.svc4.title':   'Office Supplies',
    'about.svc4.p':       "Sale and delivery of office and IT supplies: stationery, office furniture and supplies for businesses and administrations.",
    // ── About page — products ──
    'about.prod.tag':      'Our catalog',
    'about.prod.title':    'Our',
    'about.prod.title.em': 'Flagship Products',
    'about.prod.desc':     'A wide range of media to carry your visual communication every day.',
    'about.p1.title': 'Pocket Calendar',    'about.p1.p': '8.5 × 5 cm · Full-color front/back — Ideal for mass distribution.',
    'about.p2.title': 'Desk Calendar',      'about.p2.p': '21 × 10 cm · Laminated — Elegant design, compact format.',
    'about.p3.title': 'Wall Calendar',      'about.p3.p': 'Large format · Cardboard or banner — Maximum visibility.',
    'about.p4.title': 'Roll-up Banner',     'about.p4.p': "Banner & fabric — Ideal for events.",
    'about.p5.title': 'Badges',             'about.p5.p': "Staff identification — For events & businesses.",
    'about.p6.title': 'Leaflets',           'about.p6.p': "Inform about your activities — Format and finish of your choice.",
    'about.p7.title': 'Bags',               'about.p7.p': "Accompany your customer during and after purchase.",
    'about.p8.title': 'T-shirts & Caps',    'about.p8.p': "Dress your team for promos & events.",
    'about.p9.title': 'Stamps & Seals',     'about.p9.p': "Rubber stamp for marking all media.",
    // ── About page — counters ──
    'about.c1.label': 'Satisfied clients',
    'about.c2.label': 'Areas of expertise',
    'about.c3.label': 'Products in catalog',
    'about.c4.label': 'Referenced partners',
    // ── About page — team ──
    'about.t2.name.a': 'Workshop Team',  'about.t2.role.a': 'Design & Production',
    'about.t3.name.a': 'Delivery Team',  'about.t3.role.a': 'Service & Delivery',
    // ── About page — why us ──
    'about.why1.h': 'Technical & Artistic Expertise',
    'about.why1.p': "Our team masters graphic design, screen printing and printing on all media. Every project is studied, planned and executed with care.",
    'about.why2.h': 'Free Quote in 2h',
    'about.why2.p': "Send your project via WhatsApp to +228 90 43 69 29 and receive a detailed, no-commitment quote in under 2 business hours.",
    'about.why3.h': 'Fast Delivery in Lomé',
    'about.why3.p': "Our mobile team delivers your orders across Lomé and surrounding areas, in record time according to your deadlines.",
    'about.why4.h': 'Pre-Print Approval',
    'about.why4.p': "No printing without your approval. We always submit a print proof for your validation before starting production.",
    'about.why5.h': 'Complete Range',
    'about.why5.p': "From graphic design to office supplies, screen printing to promotional items — everything is available at FINEX PRO.",
    'about.why6.h': 'Available Customer Service',
    'about.why6.p': "Available Monday to Saturday via WhatsApp to answer your questions, support you and track your order progress.",
    // ── About page — location labels ──
    'about.loc.addr.label':  'Address',
    'about.loc.phone.label': 'Our numbers',
    'about.loc.email.label': 'Email',
    'about.loc.hours.label': 'Opening hours',
    'about.loc.hours.val':   'Monday – Saturday: 8am – 7pm',
    // ── Contact page ──
    'contact.hero.title':    'Contact Us',
    'contact.hero.sub':      'Available Monday to Saturday, 8am–7pm. Reply guaranteed within 2 hours.',
    'contact.card.title':    'Our contact details',
    'contact.info.wa':       'WhatsApp (Priority)',
    'contact.info.addr':     'Address',
    'contact.info.hours':    'Hours',
    'contact.info.email':    'Email',
    'contact.wa.btn.title':  'Write on WhatsApp',
    'contact.form.title':    'Send us a message',
    'contact.label.name':    'Full name *',
    'contact.label.email':   'Email',
    'contact.label.phone':   'Phone *',
    'contact.label.subject': 'Subject',
    'contact.label.message': 'Your message *',
    'contact.form.btn':      'Send via WhatsApp',
    'contact.form.note':     'Reply guaranteed within 2 business hours — Monday to Saturday.',
    'contact.faq.tag':       'Frequently Asked Questions',
    'contact.faq.title':     'Your questions,',
    'contact.faq.title.em':  'our answers',
    'contact.faq.q1':        'How quickly do you respond to quote requests?',
    'contact.faq.q2':        'How can I place an order?',
    'contact.faq.q3':        'Can I visit your workshop?',
    'contact.faq.q4':        'How does order tracking work?',
    // ── Devis page ──
    'devis.hero.title':    'Get your free quote',
    'devis.hero.em':       'in 2 minutes',
    'devis.hero.sub':      'Fill in the form below and receive a personalized reply within 24 hours.',
    'devis.how.tag':       'Simple & Fast',
    'devis.how.title':     'How does it',
    'devis.how.title.em':  'work?',
    'devis.how.s1.title':  'Fill in the form',
    'devis.how.s1.p':      "Describe your project in 3 simple steps: type of service, project details, and your contact information.",
    'devis.how.s2.title':  'Receive your quote within 24h',
    'devis.how.s2.p':      "Our team reviews your request and sends you a detailed, personalized quote via WhatsApp.",
    'devis.how.s3.title':  'Approve and start production',
    'devis.how.s3.p':      "Once you approve, we launch production and deliver within the agreed timeframe.",
    'devis.step1.label':   'Service',
    'devis.step2.label':   'Details',
    'devis.step3.label':   'Contact',
    'devis.s1.title':      'Which service interests you?',
    'devis.s1.sub':        'Select the type of service for which you want a quote.',
    'devis.sc1.title':     'Screen Printing',
    'devis.sc1.p':         'T-shirts, polos, uniforms, caps, bags…',
    'devis.sc2.title':     'Digital Printing',
    'devis.sc2.p':         'Banners, flyers, posters, roll-ups, stickers…',
    'devis.sc3.title':     'Graphic Design',
    'devis.sc3.p':         'Logo, brand guidelines, mockups, photo editing…',
    'devis.sc4.title':     'Custom Products',
    'devis.sc4.p':         'Mugs, pens, notebooks, keychains, badges…',
    'devis.s2.title':      'Project details',
    'devis.s2.sub':        'Describe your needs to get a quote as close to reality as possible.',
    'devis.s3.title':      'Your contact details',
    'devis.s3.sub':        'So we can send your personalized quote via WhatsApp.',
    'devis.btn.next':      'Next step →',
    'devis.btn.prev':      '← Back',
    'devis.btn.submit':    'Send my quote request',
    'devis.g1.title':      '100% Free Quote',
    'devis.g1.p':          "Our quote is completely free with absolutely no purchase obligation.",
    'devis.g2.title':      'Reply within 24h',
    'devis.g2.p':          "We commit to sending you your personalized quote within 24 business hours.",
    'devis.g3.title':      'No Commitment',
    'devis.g3.p':          "Receiving a quote commits you to nothing. You freely decide whether to proceed.",
    'devis.g4.title':      'Personalized Advice',
    'devis.g4.p':          "Our team advises you on the best options based on your budget and needs.",
    // ── Privacy page ──
    'prv.hero.title':  'Privacy Policy',
    'prv.hero.sub':    'How FINEX PRO collects, uses and protects your personal data.',
    'prv.breadcrumb':  'Privacy',
    'prv.hl1.title':   'Secured data',          'prv.hl1.sub': 'Access strictly limited internally',
    'prv.hl2.title':   'No resale',             'prv.hl2.sub': 'Your data is never sold',
    'prv.hl3.title':   'Response within 30 days','prv.hl3.sub': 'For any rights exercise request',
    'prv.hl4.title':   'Your rights respected', 'prv.hl4.sub': 'Access, rectification, deletion',
    'prv.toc.label':   'On this page',
    'prv.toc.date':    'Updated: May 2025',
    'prv.toc.1':  '01 · Who are we?',          'prv.toc.2':  '02 · Data collected',
    'prv.toc.3':  '03 · Purpose of processing', 'prv.toc.4':  '04 · Legal basis',
    'prv.toc.5':  '05 · Retention',            'prv.toc.6':  '06 · Data sharing',
    'prv.toc.7':  '07 · Security',             'prv.toc.8':  '08 · Cookies',
    'prv.toc.9':  '09 · Your rights',          'prv.toc.10': '10 · Changes',
    'prv.s1.title': 'Who are we?',
    'prv.s1.p':     "This policy applies to the FINEX PRO website, a company specializing in screen printing, digital printing, graphic design and custom products, headquartered at Adidogomé Wessomé, Lomé, Togo.",
    'prv.s1.resp':  'Data controller:',
    'prv.s2.title': 'Data collected',
    'prv.s2.p1':    'In the context of using our site and services, we may collect:',
    'prv.s2.p2':    'This data is collected only through the contact form, quote form or your WhatsApp messages.',
    'prv.s2.t1':'First & last name', 'prv.s2.t2':'Phone', 'prv.s2.t3':'Email address',
    'prv.s2.t4':'Project data', 'prv.s2.t5':'Browsing data',
    'prv.s3.title': 'Purpose of processing',
    'prv.s3.p':     'Your data is used exclusively to:',
    'prv.s3.l1':    'Respond to your quote requests and inquiries',
    'prv.s3.l2':    'Process and track your printing and design orders',
    'prv.s3.l3':    'Send you confirmations and updates related to your order',
    'prv.s3.l4':    'Improve the quality of our services and website',
    'prv.s3.l5':    'Comply with our legal and accounting obligations',
    'prv.s3.note':  'We do not use your data for commercial prospecting without your prior consent.',
    'prv.s4.title': 'Legal basis for processing',
    'prv.s4.c1.title': 'Contract',          'prv.s4.c1.p': 'When you place an order or request a quote',
    'prv.s4.c2.title': 'Consent',           'prv.s4.c2.p': 'When you voluntarily fill in our forms',
    'prv.s4.c3.title': 'Legitimate interest','prv.s4.c3.p': 'To improve our services and respond to your requests',
    'prv.s5.title': 'Data retention',
    'prv.s5.d1':    '1 year', 'prv.s5.d1.label': 'Prospecting data, from the last contact',
    'prv.s5.d2':    '10 years','prv.s5.d2.label': 'Commercial transaction data (accounting obligations)',
    'prv.s5.p':     'Beyond these periods, your data is permanently deleted or anonymized.',
    'prv.s6.title': 'Data sharing',
    'prv.s6.note':  'FINEX PRO never sells, rents or shares your data with third parties for commercial purposes.',
    'prv.s6.p':     'Sharing is only possible in these strictly limited cases:',
    'prv.s6.l1':    'Technical providers essential to the operation of the site (hosting)',
    'prv.s6.l2':    'Legal obligation or judicial requisition',
    'prv.s6.wa':    'Messages sent via WhatsApp are processed according to the WhatsApp (Meta) privacy policy.',
    'prv.s7.title': 'Data security',
    'prv.s7.p1':    'We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, destruction or disclosure.',
    'prv.s7.p2':    'Access to data is strictly limited to authorized personnel within FINEX PRO.',
    'prv.s8.title': 'Cookies',
    'prv.s8.p1':    'Our site uses a minimal number of technical cookies necessary for its proper functioning (language preferences, session). We do not use advertising cookies or third-party trackers for profiling purposes.',
    'prv.s8.p2':    'You can disable cookies at any time in your browser settings. This may affect some features of the site.',
    'prv.s9.title': 'Your rights',
    'prv.s9.r1.title':'Access',       'prv.s9.r1.p': 'Obtain a copy of your data',
    'prv.s9.r2.title':'Rectification','prv.s9.r2.p': 'Correct inaccurate data',
    'prv.s9.r3.title':'Erasure',      'prv.s9.r3.p': 'Request deletion',
    'prv.s9.r4.title':'Objection',    'prv.s9.r4.p': 'Object to processing',
    'prv.s9.r5.title':'Portability',  'prv.s9.r5.p': 'Receive your data in a structured format',
    'prv.s9.contact': 'To exercise your rights, write to finexpromail@gmail.com or via WhatsApp. Response guaranteed within 30 days.',
    'prv.s10.title': 'Changes to this policy',
    'prv.s10.p1':   'FINEX PRO reserves the right to modify this policy at any time, particularly in the event of legal changes or changes in practices. The date at the top of this page will be updated.',
    'prv.s10.p2':   'We encourage you to regularly check this page to stay informed.',
    'prv.cta.title': 'A question about your data?',
    'prv.cta.p':     'Our team will respond as soon as possible.',
  }
};

function applyTranslation(lang) {
  const t = translations[lang] || translations.fr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  if (heroRotate && _heroWordsList[lang]) {
    heroRotate.textContent = _heroWordsList[lang][0];
  }
}

// Language switcher — init on page load
(function () {
  const savedLang = localStorage.getItem('finex-lang') || 'fr';
  applyTranslation(savedLang);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn) {
      const lang = btn.dataset.lang;
      localStorage.setItem('finex-lang', lang);
      applyTranslation(lang);
    }
  });
})();

console.log('✅ FINEX PRO website loaded');
