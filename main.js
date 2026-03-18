/* ─────────────────────────────────────────────────────────
   Augmentra · main.js
───────────────────────────────────────────────────────── */

// ── Sticky nav on scroll ──
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  function updateNav() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

// ── Mobile nav hamburger ──
(function () {
  const btn = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobile');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  // Close on link click
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ── Smooth scroll for anchor links ──
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

// ── Counter animation ──
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function formatNumber(n, suffix) {
    if (n >= 1000) {
      return (n / 1000).toFixed(0) + 'k' + suffix;
    }
    return n + suffix;
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      el.textContent = formatNumber(current, suffix);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target, suffix);
      }
    }

    requestAnimationFrame(tick);
  }

  // Trigger when section enters viewport
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
})();

// ── Waitlist form ──
(function () {
  const form = document.getElementById('waitlistForm');
  const success = document.getElementById('waitlistSuccess');
  if (!form) return;

  function getVal(id) {
    return document.getElementById(id).value.trim();
  }

  function setError(id, msg) {
    const el = document.getElementById(id);
    const input = document.getElementById(id.replace('err', 'wl').toLowerCase());
    if (!el) return false;
    el.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
    return !!msg;
  }

  function clearErrors() {
    ['errName', 'errEmail', 'errIndustry'].forEach(function (id) {
      setError(id, '');
    });
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const name     = getVal('wlName');
    const email    = getVal('wlEmail');
    const industry = getVal('wlIndustry');

    let hasError = false;
    if (!name)                    hasError = setError('errName', 'Please enter your name.');
    if (!email)                   hasError = setError('errEmail', 'Please enter your email.') || hasError;
    else if (!isValidEmail(email)) hasError = setError('errEmail', 'Please enter a valid email address.') || hasError;
    if (!industry)                hasError = setError('errIndustry', 'Please enter your industry or role.') || hasError;

    if (hasError) return;

    // Simulate brief async submission
    const btn = document.getElementById('wlSubmit');
    btn.disabled = true;
    btn.querySelector('.btn-label').textContent = 'Submitting…';

    setTimeout(function () {
      form.hidden = true;
      success.hidden = false;
    }, 800);
  });

  // Live validation — clear error once user types
  ['wlName', 'wlEmail', 'wlIndustry'].forEach(function (id) {
    const input = document.getElementById(id);
    if (!input) return;
    const errId = 'err' + id.replace('wl', '');
    input.addEventListener('input', function () {
      setError(errId, '');
    });
  });
})();
