/* ============================================================
   AUGMENTRA — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. STICKY NAV — add "scrolled" class after 20px scroll
     ---------------------------------------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     2. MOBILE HAMBURGER — toggle .nav-mobile.open
     ---------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var navMobile = document.getElementById('nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close on link click
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     3. SMOOTH SCROLL for anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     4. COUNTER ANIMATION — .stat-num elements
        Animates numeric values up from 0 on viewport entry.
        Handles "12+", "3", "Zero" — only animates numeric ones.
     ---------------------------------------------------------- */
  var statNums = document.querySelectorAll('.stat-num');
  if (statNums.length && 'IntersectionObserver' in window) {
    var animateStat = function (el) {
      var raw = el.getAttribute('data-target') || el.textContent.trim();
      // Extract numeric portion and suffix
      var match = raw.match(/^(\d+)(.*)/);
      if (!match) {
        // Non-numeric like "Zero" — no animation
        return;
      }
      var target = parseInt(match[1], 10);
      var suffix = match[2] || '';
      var duration = 1200;
      var startTime = null;

      var easeOut = function (t) {
        return 1 - Math.pow(1 - t, 3);
      };

      var step = function (timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var current = Math.round(easeOut(progress) * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      };

      requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     5. QUOTE FORM VALIDATION
     ---------------------------------------------------------- */
  var quoteForm = document.getElementById('quote-form');
  var formSuccess = document.querySelector('.form-success');

  if (quoteForm) {
    var showError = function (input, message) {
      input.classList.add('error');
      var errEl = input.nextElementSibling;
      if (errEl && errEl.classList.contains('form-error')) {
        errEl.textContent = message;
        errEl.classList.add('visible');
      }
    };

    var clearError = function (input) {
      input.classList.remove('error');
      var errEl = input.nextElementSibling;
      if (errEl && errEl.classList.contains('form-error')) {
        errEl.classList.remove('visible');
      }
    };

    var validateEmail = function (val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    };

    // Clear errors on input
    quoteForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
      el.addEventListener('input', function () { clearError(this); });
      el.addEventListener('change', function () { clearError(this); });
    });

    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      // Full name
      var name = document.getElementById('f-name');
      if (!name.value.trim()) {
        showError(name, 'Please enter your full name.');
        valid = false;
      }

      // Company
      var company = document.getElementById('f-company');
      if (!company.value.trim()) {
        showError(company, 'Please enter your company or organisation.');
        valid = false;
      }

      // Email
      var email = document.getElementById('f-email');
      if (!email.value.trim()) {
        showError(email, 'Please enter your email address.');
        valid = false;
      } else if (!validateEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
      }

      // Industry
      var industry = document.getElementById('f-industry');
      if (!industry.value.trim()) {
        showError(industry, 'Please enter your industry.');
        valid = false;
      }

      // Project type
      var projectType = document.getElementById('f-project-type');
      if (!projectType.value) {
        showError(projectType, 'Please select a project type.');
        valid = false;
      }

      // Description
      var description = document.getElementById('f-description');
      if (!description.value.trim()) {
        showError(description, 'Please describe what you need.');
        valid = false;
      }

      // Timeline
      var timeline = document.getElementById('f-timeline');
      if (!timeline.value) {
        showError(timeline, 'Please select a preferred timeline.');
        valid = false;
      }

      // Budget
      var budget = document.getElementById('f-budget');
      if (!budget.value) {
        showError(budget, 'Please select a budget range.');
        valid = false;
      }

      if (valid) {
        // Hide form, show success
        quoteForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Scroll to first error
        var firstError = quoteForm.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  /* ----------------------------------------------------------
     6. ACTIVE NAV LINK — highlight current page
     ---------------------------------------------------------- */
  var path = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';
  if (filename === '') filename = 'index.html';

  var allNavLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  allNavLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkFile = href.split('/').pop();
    if (linkFile === filename) {
      link.classList.add('active');
    }
    // Also handle index.html / root
    if ((filename === 'index.html' || filename === '') && (href === 'index.html' || href === './' || href === '/')) {
      link.classList.add('active');
    }
  });

}());
