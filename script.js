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

      window.open(`https://wa.me/22897511723?text=${encodeURIComponent(waMsg)}`, '_blank');
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
   THEME TOGGLE
   ========================================= */
(function () {
  const saved = localStorage.getItem('finex-theme') || 'dark';

  function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'light' ? '☀️' : '🌙';
    });
  }

  applyTheme(saved);

  document.addEventListener('click', e => {
    if (e.target.closest('.theme-toggle')) {
      const isLight = document.body.classList.contains('light-mode');
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem('finex-theme', next);
      applyTheme(next);
    }
  });
})();

/* =========================================
   I18N — TRANSLATIONS
   ========================================= */
const translations = {
  fr: {
    // Navbar
    'nav.home':     'Accueil',
    'nav.services': 'Services',
    'nav.portfolio':'Portfolio',
    'nav.about':    'À propos',
    'nav.contact':  'Contact',
    'nav.devis':    'Devis gratuit',
    // Hero (index)
    'hero.badge':        'Lomé, Togo · Impression Pro',
    'hero.title.prefix': 'Nous imprimons sur',
    'hero.sub':          'Sérigraphie · Impression numérique · Design graphique · Objets personnalisés',
    'hero.sub.strong':   'La qualité, la rapidité, le professionnalisme.',
    'hero.cta.wa':       'Contactez-nous sur WhatsApp',
    'hero.cta.devis':    'Demander un devis',
    'hero.stat1':        'Clients satisfaits',
    'hero.stat2':        "Années d'expérience",
    'hero.stat3':        'Livraison express',
    // Services section (index)
    'svc.tag':       'Nos Services',
    'svc.title':     'Tout ce dont vous avez besoin',
    'svc.title.em':  'pour votre image',
    'svc.desc':      "De la conception à la livraison, FINEX PRO vous accompagne dans tous vos projets d'impression et de communication visuelle.",
    'svc.all':       'Voir tous nos services →',
    // Portfolio section (index)
    'pf.tag':      'Nos Réalisations',
    'pf.title':    'Nos réalisations',
    'pf.title.em': "parlent d'elles-mêmes",
    'pf.all':      'Voir toutes nos réalisations →',
    // Testimonials
    'testi.tag':      'Témoignages',
    'testi.title':    'Ce que disent',
    'testi.title.em': 'nos clients',
    // Partners
    'partners.label': 'Ils nous font confiance',
    // CTA
    'cta.title': 'Prêt à donner vie à votre projet ?',
    'cta.desc':  'Contactez-nous dès maintenant et obtenez un devis gratuit en moins de 2 heures.',
    'cta.btn':   'Demander un devis gratuit',
    // Footer
    'footer.brand.desc': 'Votre partenaire en impression, sérigraphie et communication visuelle à Lomé, Togo.',
    'footer.nav.h':     'Navigation',
    'footer.svc.h':     'Services',
    'footer.contact.h': 'Contact',
    'footer.hours':     'Lun–Sam : 8h – 19h',
    'footer.copy':      '© 2025 FINEX PRO. Tous droits réservés.',
    'footer.tagline':   'Lomé, Togo · Impression & Communication Visuelle',
    // Breadcrumb
    'bc.home': 'Accueil',
    // Services page
    'svc.page.hero.title':  'Nos Services',
    'svc.page.hero.sub':    "Impression professionnelle, design créatif et objets personnalisés — tout ce qu'il faut pour votre image.",
    'svc.page.intro.tag':   'Notre Expertise',
    'svc.page.intro.title': 'FINEX PRO, votre partenaire',
    'svc.page.intro.em':    'en communication visuelle',
    'svc.faq.tag':          'Questions fréquentes',
    'svc.faq.title':        'Vous avez des questions ?',
    'svc.faq.title.em':     'Nous avons les réponses.',
    'svc.cta.title':        'Prêt à lancer votre projet ?',
    'svc.cta.desc':         'Obtenez un devis gratuit et personnalisé en moins de 2 heures.',
    // Portfolio page
    'pf.page.hero.title': 'Nos Réalisations',
    'pf.page.hero.sub':   'Des projets concrets qui témoignent de notre savoir-faire et de notre engagement pour la qualité.',
    'pf.filter.all':      'Tout',
    'pf.filter.seri':     'Sérigraphie',
    'pf.filter.imp':      'Impression',
    'pf.filter.design':   'Design',
    'pf.filter.objets':   'Objets',
    'pf.cta.text':        'Vous avez un projet similaire ? Parlons-en !',
    // About page
    'about.hero.title':  'À Propos de FINEX PRO',
    'about.hero.sub':    'Notre histoire, nos valeurs et notre engagement pour votre réussite.',
    'about.val.tag':     'Ce qui nous définit',
    'about.val.title':   'Nos',
    'about.val.title.em':'Valeurs',
    'about.val.desc':    'Ces principes guident chacune de nos décisions, de la prise de commande à la livraison finale.',
    'about.team.tag':    'Les visages derrière FINEX PRO',
    'about.team.title':  'Notre',
    'about.team.title.em':'Équipe',
    'about.team.desc':   "Des professionnels passionnés au service de vos projets d'impression.",
    'about.cta.title':   'Parlons de votre projet.',
    'about.cta.desc':    'Notre équipe est disponible 6 jours sur 7 pour vous accompagner.',
    'about.cta.btn':     'Nous contacter →',
    // Contact page
    'contact.hero.title':  'Contactez-nous',
    'contact.hero.sub':    'Nous sommes disponibles du lundi au samedi, 8h–19h. Réponse garantie sous 2 heures.',
    'contact.card.title':  'Nos coordonnées',
    'contact.form.title':  'Envoyez-nous un message',
    'contact.form.btn':    'Envoyer via WhatsApp',
    'contact.form.note':   'Réponse garantie sous 2 heures ouvrables — du lundi au samedi.',
    'contact.faq.tag':     'Questions fréquentes',
    'contact.faq.title':   'Vos questions,',
    'contact.faq.title.em':'nos réponses',
    // Devis page
    'devis.hero.title':  'Obtenez votre devis gratuit',
    'devis.hero.em':     'en 2 minutes',
    'devis.hero.sub':    'Remplissez le formulaire ci-dessous et recevez une réponse personnalisée sous 24 heures.',
    'devis.how.tag':     'Simple & Rapide',
    'devis.how.title':   'Comment ça',
    'devis.how.title.em':'marche ?',
    'devis.s1.title':    'Quel service vous intéresse ?',
    'devis.s1.sub':      'Sélectionnez le type de prestation pour lequel vous souhaitez un devis.',
    'devis.s2.title':    'Détails de votre projet',
    'devis.s2.sub':      'Précisez vos besoins pour recevoir un devis au plus proche de la réalité.',
    'devis.s3.title':    'Vos coordonnées',
    'devis.s3.sub':      'Pour vous envoyer votre devis personnalisé via WhatsApp.',
    'devis.btn.next':    'Étape suivante →',
    'devis.btn.prev':    '← Retour',
    'devis.btn.submit':  'Envoyer ma demande de devis',
  },
  en: {
    // Navbar
    'nav.home':     'Home',
    'nav.services': 'Services',
    'nav.portfolio':'Portfolio',
    'nav.about':    'About',
    'nav.contact':  'Contact',
    'nav.devis':    'Free Quote',
    // Hero (index)
    'hero.badge':        'Lomé, Togo · Pro Printing',
    'hero.title.prefix': 'We print on',
    'hero.sub':          'Screen Printing · Digital Printing · Graphic Design · Custom Products',
    'hero.sub.strong':   'Quality, speed, professionalism.',
    'hero.cta.wa':       'Contact us on WhatsApp',
    'hero.cta.devis':    'Get a quote',
    'hero.stat1':        'Satisfied clients',
    'hero.stat2':        'Years of experience',
    'hero.stat3':        'Express delivery',
    // Services section (index)
    'svc.tag':       'Our Services',
    'svc.title':     'Everything you need',
    'svc.title.em':  'for your image',
    'svc.desc':      'From design to delivery, FINEX PRO guides you through all your printing and visual communication projects.',
    'svc.all':       'See all our services →',
    // Portfolio section (index)
    'pf.tag':      'Our Work',
    'pf.title':    'Our work',
    'pf.title.em': 'speaks for itself',
    'pf.all':      'See all our work →',
    // Testimonials
    'testi.tag':      'Testimonials',
    'testi.title':    'What our',
    'testi.title.em': 'clients say',
    // Partners
    'partners.label': 'They trust us',
    // CTA
    'cta.title': 'Ready to bring your project to life?',
    'cta.desc':  'Contact us now and get a free quote in less than 2 hours.',
    'cta.btn':   'Request a free quote',
    // Footer
    'footer.brand.desc': 'Your partner in printing, screen printing and visual communication in Lomé, Togo.',
    'footer.nav.h':     'Navigation',
    'footer.svc.h':     'Services',
    'footer.contact.h': 'Contact',
    'footer.hours':     'Mon–Sat: 8am – 7pm',
    'footer.copy':      '© 2025 FINEX PRO. All rights reserved.',
    'footer.tagline':   'Lomé, Togo · Printing & Visual Communication',
    // Breadcrumb
    'bc.home': 'Home',
    // Services page
    'svc.page.hero.title':  'Our Services',
    'svc.page.hero.sub':    'Professional printing, creative design and custom products — everything for your image.',
    'svc.page.intro.tag':   'Our Expertise',
    'svc.page.intro.title': 'FINEX PRO, your partner',
    'svc.page.intro.em':    'in visual communication',
    'svc.faq.tag':          'Frequently Asked Questions',
    'svc.faq.title':        'Have a question?',
    'svc.faq.title.em':     'We have the answers.',
    'svc.cta.title':        'Ready to launch your project?',
    'svc.cta.desc':         'Get a free personalized quote in less than 2 hours.',
    // Portfolio page
    'pf.page.hero.title': 'Our Work',
    'pf.page.hero.sub':   'Concrete projects that reflect our expertise and commitment to quality.',
    'pf.filter.all':      'All',
    'pf.filter.seri':     'Screen Printing',
    'pf.filter.imp':      'Printing',
    'pf.filter.design':   'Design',
    'pf.filter.objets':   'Objects',
    'pf.cta.text':        "Have a similar project? Let's talk!",
    // About page
    'about.hero.title':   'About FINEX PRO',
    'about.hero.sub':     'Our story, values and commitment to your success.',
    'about.val.tag':      'What defines us',
    'about.val.title':    'Our',
    'about.val.title.em': 'Values',
    'about.val.desc':     'These principles guide every decision we make, from order to final delivery.',
    'about.team.tag':     'The people behind FINEX PRO',
    'about.team.title':   'Our',
    'about.team.title.em':'Team',
    'about.team.desc':    'Passionate professionals dedicated to your printing projects.',
    'about.cta.title':    "Let's talk about your project.",
    'about.cta.desc':     'Our team is available 6 days a week to support you.',
    'about.cta.btn':      'Contact us →',
    // Contact page
    'contact.hero.title':  'Contact Us',
    'contact.hero.sub':    'Available Monday to Saturday, 8am–7pm. Reply guaranteed within 2 hours.',
    'contact.card.title':  'Our contact details',
    'contact.form.title':  'Send us a message',
    'contact.form.btn':    'Send via WhatsApp',
    'contact.form.note':   'Reply guaranteed within 2 business hours — Monday to Saturday.',
    'contact.faq.tag':     'Frequently Asked Questions',
    'contact.faq.title':   'Your questions,',
    'contact.faq.title.em':'our answers',
    // Devis page
    'devis.hero.title':  'Get your free quote',
    'devis.hero.em':     'in 2 minutes',
    'devis.hero.sub':    'Fill in the form below and receive a personalized reply within 24 hours.',
    'devis.how.tag':     'Simple & Fast',
    'devis.how.title':   'How does it',
    'devis.how.title.em':'work?',
    'devis.s1.title':    'Which service interests you?',
    'devis.s1.sub':      'Select the type of service for which you want a quote.',
    'devis.s2.title':    'Project details',
    'devis.s2.sub':      'Describe your needs to get a quote as close to reality as possible.',
    'devis.s3.title':    'Your contact details',
    'devis.s3.sub':      'So we can send your personalized quote via WhatsApp.',
    'devis.btn.next':    'Next step →',
    'devis.btn.prev':    '← Back',
    'devis.btn.submit':  'Send my quote request',
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
