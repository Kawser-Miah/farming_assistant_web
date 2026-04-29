// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
  backTop?.classList.toggle('visible', window.scrollY > 400);
});

// ===== MOBILE NAV =====
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.nav-mobile-menu');
const mobileClose = document.querySelector('.nav-mobile-close');

navToggle?.addEventListener('click', () => mobileMenu?.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const sizes = [8, 12, 16, 20, 28, 36];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur = 10 + Math.random() * 12;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:${0.04 + Math.random() * 0.08};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, suffix = '', duration = 2000) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = Math.floor(ease * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      countersObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('span[data-target]').forEach(el => countersObserver.observe(el));

// ===== FADE-UP SCROLL ANIMATIONS =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ===== FEATURE TABS =====
const tabs = document.querySelectorAll('.feat-tab');
const showcases = document.querySelectorAll('.feature-showcase');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    tabs.forEach(t => t.classList.remove('active'));
    showcases.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

// ===== GALLERY SLIDER =====
const track = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.gallery-dot');
let currentSlide = 0;
let autoSlide;

const getSlideWidth = () => {
  if (!slides[0]) return 220;
  const gap = parseFloat(getComputedStyle(track).gap) || 20;
  return slides[0].getBoundingClientRect().width + gap;
};
const visibleCount = () => Math.floor((track?.parentElement?.offsetWidth || 880) / getSlideWidth()) || 4;

function goToSlide(index) {
  if (!track || slides.length === 0) return;
  const max = Math.max(0, slides.length - visibleCount());
  currentSlide = Math.max(0, Math.min(index, max));
  track.style.transform = `translateX(-${currentSlide * getSlideWidth()}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === Math.floor(currentSlide / 2)));
}

document.querySelector('.gallery-prev')?.addEventListener('click', () => {
  goToSlide(currentSlide - 2);
  resetAutoSlide();
});
document.querySelector('.gallery-next')?.addEventListener('click', () => {
  goToSlide(currentSlide + 2);
  resetAutoSlide();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i * 2); resetAutoSlide(); });
});

function startAutoSlide() {
  autoSlide = setInterval(() => {
    const max = Math.max(0, slides.length - visibleCount());
    goToSlide(currentSlide >= max ? 0 : currentSlide + 2);
  }, 3000);
}
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}
startAutoSlide();

// Pause on hover
track?.addEventListener('mouseenter', () => clearInterval(autoSlide));
track?.addEventListener('mouseleave', () => { clearInterval(autoSlide); startAutoSlide(); });

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => {
    const src = el.dataset.lightbox || el.src || el.querySelector('img')?.src;
    if (src && lightboxImg && lightbox) {
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== BACK TO TOP =====
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== TOUCH SWIPE for gallery =====
let touchStartX = 0;
track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? goToSlide(currentSlide + 2) : goToSlide(currentSlide - 2);
    resetAutoSlide();
  }
}, { passive: true });
