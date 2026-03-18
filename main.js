/* ─────────────────────────────────────────────────────────
   Augmentra · main.js
───────────────────────────────────────────────────────── */

// ── Sticky nav on scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Animated stat counters ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Trigger counters when hero stats become visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Fade-in sections ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.problem-card, .feature-card, .step, .integration-card, .testimonial'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  fadeObserver.observe(el);
});

// Add visible class handler
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible { opacity: 1 !important; transform: translateY(0) !important; }
  </style>
`);

// ── Dashboard row hover glow ──
document.querySelectorAll('.dash-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.borderColor = 'rgba(99,102,241,0.3)';
    row.style.background = 'rgba(99,102,241,0.05)';
  });
  row.addEventListener('mouseleave', () => {
    row.style.borderColor = '';
    row.style.background = '';
  });
});

// ── Waitlist form ──
const form = document.getElementById('waitlistForm');
const success = document.getElementById('waitlistSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 900);
  });
}

// ── Smooth anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Subtle parallax on hero grid ──
window.addEventListener('scroll', () => {
  const grid = document.querySelector('.hero-grid-bg');
  if (grid) {
    grid.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }
}, { passive: true });
