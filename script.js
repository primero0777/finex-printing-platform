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
    'hero.stat2':        "Années d'expérience",
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
    'svc.intro.p':          "Depuis plus de 9 ans, FINEX PRO accompagne entreprises, associations et particuliers à Lomé dans tous leurs projets d'impression et de communication visuelle. Grâce à des équipements modernes et une équipe experte, nous garantissons des résultats de haute qualité, des délais respectés et des prix compétitifs.",
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
    'about.hero.sub':    'Notre histoire, nos valeurs et notre engagement pour votre réussite.',
    // ── About page — history ──
    'about.hist.tag':    'Notre Histoire',
    'about.hist.title':  'Une passion née',
    'about.hist.em':     'à Lomé',
    'about.hist.p1':     "FINEX PRO a vu le jour en 2015 à Adidogomé Wessomé, dans le cœur de Lomé, portée par une vision simple mais ambitieuse : offrir aux entreprises, associations et particuliers du Togo des solutions d'impression professionnelles, accessibles et rapides.",
    'about.hist.p2':     "Dès ses débuts, l'entreprise s'est spécialisée dans la sérigraphie textile avant d'élargir rapidement son offre à l'impression numérique grand format, au design graphique et aux objets personnalisés.",
    'about.hist.p3':     "Aujourd'hui, notre atelier équipé de machines modernes et notre équipe de professionnels passionnés traitent chaque jour des commandes pour des clients de toute la région.",
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
    'about.t1.name': 'Kofi N\'Goran',
    'about.t1.role': 'Fondateur & Directeur',
    'about.t1.bio':  "Entrepreneur passionné d'impression depuis 2015, Kofi dirige FINEX PRO avec une vision claire : rendre la communication visuelle professionnelle accessible à tous au Togo.",
    'about.t2.name': 'Amina Kodjo',
    'about.t2.role': 'Directrice Artistique',
    'about.t2.bio':  "Designer graphique diplômée avec 7 ans d'expérience, Amina supervise tous les projets créatifs et garantit la cohérence visuelle de chaque réalisation.",
    'about.t3.name': 'Edem Mensah',
    'about.t3.role': 'Responsable Production',
    'about.t3.bio':  "Expert en sérigraphie et impression numérique, Edem gère l'atelier de production et s'assure que chaque commande soit livrée dans les délais avec la qualité attendue.",
    // ── About page — "Why us" ──
    'about.diff.tag':   'La différence FINEX PRO',
    'about.diff.title': 'Pourquoi nous',
    'about.diff.em':    'choisir ?',
    'about.w1.h': 'Matériel Professionnel',
    'about.w1.p': "Machines d'impression grand format dernière génération, presses sérigraphiques multicolores et équipements de découpe numérique pour des résultats précis.",
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
    'about.cta.desc':  'Notre équipe est disponible 6 jours sur 7 pour vous accompagner.',
    'about.cta.btn':   'Nous contacter →',
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
    'hero.stat2':        'Years of experience',
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
    'svc.intro.p':          'For over 9 years, FINEX PRO has been supporting businesses, associations and individuals in Lomé with all their printing and visual communication projects. With modern equipment and an expert team, we guarantee high-quality results, on-time delivery and competitive prices.',
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
    'about.hero.sub':    'Our story, values and commitment to your success.',
    // ── About page — history ──
    'about.hist.tag':    'Our Story',
    'about.hist.title':  'A passion born',
    'about.hist.em':     'in Lomé',
    'about.hist.p1':     "FINEX PRO was founded in 2015 in Adidogomé Wessomé, at the heart of Lomé, driven by a simple yet ambitious vision: to offer businesses, associations and individuals in Togo professional, accessible and fast printing solutions.",
    'about.hist.p2':     "From the start, the company specialized in screen printing before quickly expanding into large-format digital printing, graphic design and custom products. In under ten years, FINEX PRO has become a key reference in visual communication in Togo.",
    'about.hist.p3':     "Today, our workshop equipped with modern machinery and our team of passionate professionals handle daily orders for clients across the region: shops, NGOs, schools, municipalities and major companies all trust our expertise.",
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
    'about.t1.name': 'Kofi N\'Goran',
    'about.t1.role': 'Founder & Director',
    'about.t1.bio':  "Passionate printing entrepreneur since 2015, Kofi leads FINEX PRO with a clear vision: making professional visual communication accessible to everyone in Togo.",
    'about.t2.name': 'Amina Kodjo',
    'about.t2.role': 'Art Director',
    'about.t2.bio':  "Trained graphic designer with 7 years of experience, Amina oversees all creative projects and ensures visual consistency across every production.",
    'about.t3.name': 'Edem Mensah',
    'about.t3.role': 'Production Manager',
    'about.t3.bio':  "Expert in screen printing and digital printing, Edem manages the production workshop and ensures every order is delivered on time with the expected quality.",
    // ── About page — "Why us" ──
    'about.diff.tag':   'The FINEX PRO difference',
    'about.diff.title': 'Why choose',
    'about.diff.em':    'us?',
    'about.w1.h': 'Professional Equipment',
    'about.w1.p': "Latest-generation large-format printing machines, multicolor screen printing presses and digital cutting equipment for precise results.",
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
    'about.cta.desc':  'Our team is available 6 days a week to support you.',
    'about.cta.btn':   'Contact us →',
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
