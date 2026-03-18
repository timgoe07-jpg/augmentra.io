/* ============================================================
   AUGMENTRA — main.js
   ============================================================ */

(function () {
  'use strict';

  // ── Sticky Nav ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── Mobile Hamburger ─────────────────────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      navMobile.classList.toggle('open');
    });
    // Close on link click
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
      });
    });
  }

  // ── Smooth Scroll ────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Counter Animation (index.html only) ──────────────────────
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    var animated = false;
    function animateCounters() {
      if (animated) return;
      statNums.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 1400;
        var start = null;
        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = prefix + target + suffix;
          }
        }
        requestAnimationFrame(step);
      });
      animated = true;
    }

    var statsSection = document.querySelector('.hero-stats');
    if (statsSection && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(statsSection);
    } else {
      animateCounters();
    }
  }

  // ── Quote Form Validation ─────────────────────────────────────
  var quoteForm = document.getElementById('quoteForm');
  var quoteSuccess = document.getElementById('quoteSuccess');
  if (quoteForm && quoteSuccess) {
    function showError(id, show) {
      var el = document.getElementById(id);
      if (el) {
        el.classList.toggle('visible', show);
      }
    }
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = document.getElementById('qName');
      var company = document.getElementById('qCompany');
      var email = document.getElementById('qEmail');
      var industry = document.getElementById('qIndustry');
      var type = document.getElementById('qType');
      var desc = document.getElementById('qDesc');
      var timeline = document.getElementById('qTimeline');
      var budget = document.getElementById('qBudget');

      showError('errName', !name.value.trim());
      if (!name.value.trim()) valid = false;

      showError('errCompany', !company.value.trim());
      if (!company.value.trim()) valid = false;

      showError('errEmail', !isValidEmail(email.value.trim()));
      if (!isValidEmail(email.value.trim())) valid = false;

      showError('errIndustry', !industry.value.trim());
      if (!industry.value.trim()) valid = false;

      showError('errType', !type.value);
      if (!type.value) valid = false;

      showError('errDesc', !desc.value.trim());
      if (!desc.value.trim()) valid = false;

      showError('errTimeline', !timeline.value);
      if (!timeline.value) valid = false;

      showError('errBudget', !budget.value);
      if (!budget.value) valid = false;

      if (valid) {
        quoteForm.style.display = 'none';
        quoteSuccess.classList.add('visible');
        window.scrollTo({ top: quoteSuccess.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
      }
    });

    // Clear errors on input
    quoteForm.querySelectorAll('.form-control').forEach(function (el) {
      el.addEventListener('input', function () {
        var errId = 'err' + el.id.replace('q', '').replace(/^./, function (c) { return c.toUpperCase(); });
        showError(errId, false);
      });
    });
  }

  // ── Active Nav Link ───────────────────────────────────────────
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });

})();
