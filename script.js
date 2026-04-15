/* ===================================
   FINEX PRO — script.js
   Animations & Interactions
   =================================== */

// -------- NAVBAR SCROLL --------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// -------- MOBILE NAV TOGGLE --------
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// -------- ACTIVE NAV LINK ON SCROLL --------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

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

// Initial check + scroll listener
checkReveals();
window.addEventListener('scroll', checkReveals, { passive: true });

// -------- HERO TEXT ROTATOR --------
const heroRotate = document.getElementById('heroRotate');
const words = ['T-shirts', 'Mugs', 'Bâches', 'Objets perso', 'Flyers', 'Uniformes'];
let wordIndex = 0;

function rotateHeroWord() {
  // Fade out
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

// -------- PORTFOLIO FILTER --------
const filterBtns  = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

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

// -------- PORTFOLIO LIGHTBOX --------
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('.portfolio-img').cloneNode(true);
    img.style.width  = 'min(600px, 90vw)';
    img.style.height = 'min(400px, 70vh)';
    img.style.borderRadius = '14px';
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(img);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// -------- CONTACT FORM → WHATSAPP --------
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !phone || !message) {
    // Simple validation feedback
    [['name', name], ['phone', phone], ['message', message]].forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (!val) {
        el.style.borderColor = '#ff4d4f';
        el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }

  const waText = encodeURIComponent(
    `Bonjour FINEX PRO,\n\nJe m'appelle ${name}.\nTél: ${phone}\n\n${message}`
  );
  window.open(`https://wa.me/22897511723?text=${waText}`, '_blank');

  // Reset form
  contactForm.reset();

  // Feedback
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '✓ Message envoyé via WhatsApp !';
  btn.style.background = '#25d366';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 3000);
});

// -------- SMOOTH ANCHOR SCROLL --------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Store base rotations
document.querySelector('.hcard-1') && (document.querySelector('.hcard-1')._baseRot = -3);
document.querySelector('.hcard-2') && (document.querySelector('.hcard-2')._baseRot = 2);
document.querySelector('.hcard-3') && (document.querySelector('.hcard-3')._baseRot = -1);

// -------- STATS COUNTER ANIMATION --------
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      const targets  = [500, 5, 48];
      const suffixes = ['+', '+', 'h'];
      statNums.forEach((el, i) => animateCounter(el, targets[i], suffixes[i]));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// -------- SERVICE CARD ENTRANCE STAGGER --------
const serviceCards = document.querySelectorAll('.service-card');
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

console.log('✅ FINEX PRO website loaded');
