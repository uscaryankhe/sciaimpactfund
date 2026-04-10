'use strict';

/* ── CURSOR ── */
const cdot  = document.getElementById('cdot');
const cring = document.getElementById('cring');
if (cdot && cring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cdot.style.left  = mx + 'px';
    cdot.style.top   = my + 'px';
    cring.style.left = rx + 'px';
    cring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a, button, .role-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cring.style.width  = '48px';
      cring.style.height = '48px';
      cring.style.borderColor = 'rgba(255,255,255,0.4)';
    });
    el.addEventListener('mouseleave', () => {
      cring.style.width  = '32px';
      cring.style.height = '32px';
      cring.style.borderColor = 'rgba(255,255,255,0.2)';
    });
  });

  if ('ontouchstart' in window) {
    cdot.style.display  = 'none';
    cring.style.display = 'none';
  }
}

/* ── PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  if (!progressBar) return;
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
function updateNav() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

/* ── PARALLAX (home page only — null-guarded) ── */
const logoWrap  = document.getElementById('logo-wrap');
const heroLabel = document.getElementById('hero-label');
const heroRule  = document.getElementById('hero-rule');
const heroH1    = document.getElementById('hero-h1');
const heroSub   = document.getElementById('hero-sub');
const heroCtas  = document.getElementById('hero-ctas');
const heroBg    = document.getElementById('hero-bg-lines');
const scrollInd = document.getElementById('scroll-indicator');

function updateParallax() {
  if (!logoWrap) return;
  const sy = window.scrollY;
  if (sy < window.innerHeight * 1.5) {
    const p = sy / window.innerHeight;
    logoWrap.style.transform = `translateY(${sy * 0.35}px) scale(${1 - p * 0.08})`;
    logoWrap.style.opacity   = String(1 - p * 1.4);
    if (heroLabel) { heroLabel.style.transform = `translateY(${sy * 0.5}px)`;  heroLabel.style.opacity = String(1 - p * 1.6); }
    if (heroRule)  { heroRule.style.transform  = `translateY(${sy * 0.5}px)`;  heroRule.style.opacity  = String(1 - p * 1.6); }
    if (heroH1)    { heroH1.style.transform    = `translateY(${sy * 0.6}px)`;  heroH1.style.opacity    = String(1 - p * 1.5); }
    if (heroSub)   { heroSub.style.transform   = `translateY(${sy * 0.65}px)`; heroSub.style.opacity   = String(1 - p * 1.5); }
    if (heroCtas)  { heroCtas.style.transform  = `translateY(${sy * 0.7}px)`;  heroCtas.style.opacity  = String(1 - p * 1.6); }
    if (heroBg)    { heroBg.style.transform    = `translateY(${sy * 0.2}px)`;  }
    if (scrollInd) { scrollInd.style.opacity   = String(1 - p * 4); }
  }
}

/* ── SCROLL HANDLER ── */
window.addEventListener('scroll', () => {
  updateNav();
  updateProgress();
  updateParallax();
}, { passive: true });

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const lineEls   = document.querySelectorAll('.line-draw');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -48px 0px' });
revealEls.forEach(el => revealObs.observe(el));
lineEls.forEach(el  => revealObs.observe(el));

/* ── HERO ENTRANCE (home page only) ── */
const heroInits = document.querySelectorAll('.hero-init');
if (heroInits.length) {
  const delays = [0, 200, 350, 520, 700, 920];
  heroInits.forEach((el, i) => {
    const delay = delays[i] !== undefined ? delays[i] : i * 140;
    el.style.transition = `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + delay);
  });
}

/* ── MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const b3 = document.getElementById('b3');
let menuOpen = false;

function openMobile() {
  menuOpen = true;
  if (mobileMenu) mobileMenu.classList.add('open');
  if (b1) { b1.style.transform = 'translateY(6px) rotate(45deg)'; b1.style.opacity = '0.7'; }
  if (b2) b2.style.opacity = '0';
  if (b3) { b3.style.transform = 'translateY(-9px) rotate(-45deg)'; b3.style.width = '20px'; b3.style.opacity = '0.7'; }
}
function closeMobile() {
  menuOpen = false;
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (b1) { b1.style.transform = ''; b1.style.opacity = '0.4'; }
  if (b2) b2.style.opacity = '0.4';
  if (b3) { b3.style.transform = ''; b3.style.width = '12px'; b3.style.opacity = '0.4'; }
}
if (hamburger) hamburger.addEventListener('click', () => menuOpen ? closeMobile() : openMobile());

/* ── SMOOTH SCROLL (same-page anchors only) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── ROLE ACCORDION ── */
function toggleRole(row) {
  const body   = row.querySelector('.role-body');
  const isOpen = row.classList.contains('open');

  document.querySelectorAll('.role-row.open').forEach(r => {
    if (r !== row) {
      r.classList.remove('open');
      r.querySelector('.role-body').classList.remove('open');
    }
  });

  if (isOpen) {
    row.classList.remove('open');
    body.classList.remove('open');
  } else {
    row.classList.add('open');
    body.classList.add('open');
  }
}

/* Initial scroll state */
updateNav();
updateProgress();
