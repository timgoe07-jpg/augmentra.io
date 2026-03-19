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

  /* ----------------------------------------------------------
     7. PIPELINE MONITOR — cycling events + throughput counter
     ---------------------------------------------------------- */
  (function() {
    var pmEvents = document.getElementById('pm-events');
    var pmThroughput = document.getElementById('pm-throughput');
    if (!pmEvents || !pmThroughput) return;

    var allPmEvents = [
      { time: '09:42:01', module: 'ml.classifier',    color: '#06b6d4', msg: 'income_doc scored 0.94 \u2192 APPROVE' },
      { time: '09:42:04', module: 'rag.retrieval',    color: '#2dd4bf', msg: 'query matched 3 policy chunks (0.87 sim)' },
      { time: '09:42:07', module: 'pg.write',         color: '#818cf8', msg: 'applicant_id=8821 committed in 11ms' },
      { time: '09:42:10', module: 'compliance.check', color: '#22c55e', msg: 'result=PASS flags=[] threshold=0.90' },
      { time: '09:42:13', module: 'webhook.dispatch', color: '#a78bfa', msg: 'target=pipedrive status=201 deal=9043' },
      { time: '09:42:16', module: 'audit.log',        color: '#f59e0b', msg: 'hash=3f9a2c user=broker_07 action=approve' },
      { time: '09:42:19', module: 'doc.ingest',       color: '#94a3b8', msg: 'file=payslip_scan.pdf parser=azure_di' },
      { time: '09:42:22', module: 'ml.classifier',    color: '#06b6d4', msg: 'expense_ratio=0.31 risk_band=LOW' },
      { time: '09:42:25', module: 'rag.retrieval',    color: '#2dd4bf', msg: 'context_tokens=1840 model=gpt-4o' },
      { time: '09:42:28', module: 'pg.write',         color: '#818cf8', msg: 'transaction_log updated rows=3' }
    ];
    var pmEventIdx = 6;
    var pmCount = 1847;

    function addPmEvent() {
      var evt = allPmEvents[pmEventIdx % allPmEvents.length];
      pmEventIdx++;
      var row = document.createElement('div');
      row.className = 'pm-event';
      row.innerHTML =
        '<span class="pm-time">' + evt.time + '</span>' +
        '<span class="pm-event-name" style="color:' + evt.color + ';">' + evt.module + '</span>' +
        '<span class="pm-event-data">' + evt.msg + '</span>';
      pmEvents.insertBefore(row, pmEvents.firstChild);
      var rows = pmEvents.querySelectorAll('.pm-event');
      if (rows.length > 6) { pmEvents.removeChild(rows[rows.length - 1]); }
    }

    function updateThroughput() {
      pmCount++;
      pmThroughput.textContent = pmCount.toLocaleString();
    }

    setInterval(addPmEvent, 2500);
    setInterval(updateThroughput, 3000);
  }());

  /* ----------------------------------------------------------
     8. TECH STACK TABS
     ---------------------------------------------------------- */
  (function() {
    var btns = document.querySelectorAll('.stack-tab-btn');
    var panels = document.querySelectorAll('.stack-tab-panel');
    if (!btns.length) return;
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = this.getAttribute('data-tab');
        btns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        var panel = document.querySelector('.stack-tab-panel[data-panel="' + tab + '"]');
        if (panel) panel.classList.add('active');
      }.bind(btn));
    });
  }());

  /* ----------------------------------------------------------
     9. SERVICES PAGE — left nav tab switching
     ---------------------------------------------------------- */
  (function() {
    var items = document.querySelectorAll('.svc-nav-item');
    var panels = document.querySelectorAll('.svc-panel');
    if (!items.length) return;
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        var svc = this.getAttribute('data-service');
        items.forEach(function(i) { i.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = document.querySelector('.svc-panel[data-panel="' + svc + '"]');
        if (panel) panel.classList.add('active');
      }.bind(item));
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      }.bind(item));
    });
  }());

  /* ----------------------------------------------------------
     10. USE CASES — filter buttons
     ---------------------------------------------------------- */
  (function() {
    var filterBtns = document.querySelectorAll('.uc-filter-btn');
    var cards = document.querySelectorAll('.uc-filterable');
    if (!filterBtns.length) return;
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        cards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }.bind(btn));
    });
  }());

  /* ----------------------------------------------------------
     11. USE CASES — before/after flip panels
     ---------------------------------------------------------- */
  (function() {
    document.querySelectorAll('.uc-flip-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var panel = document.getElementById(targetId);
        if (!panel) return;
        if (panel.hidden) {
          panel.hidden = false;
          this.textContent = 'Hide \u2190';
        } else {
          panel.hidden = true;
          this.textContent = 'Before / After \u2192';
        }
      });
    });
  }());

  /* ----------------------------------------------------------
     12. CASE STUDIES — architecture modals
     ---------------------------------------------------------- */
  (function() {
    document.querySelectorAll('.cs-arch-expand-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        if (modal) { modal.hidden = false; document.body.style.overflow = 'hidden'; }
      });
    });
    document.querySelectorAll('.cs-modal-close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        if (modal) { modal.hidden = true; document.body.style.overflow = ''; }
      });
    });
    document.querySelectorAll('.cs-modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) { overlay.hidden = true; document.body.style.overflow = ''; }
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cs-modal-overlay:not([hidden])').forEach(function(m) {
          m.hidden = true; document.body.style.overflow = '';
        });
      }
    });
  }());

  /* ----------------------------------------------------------
     PIPELINE MONITOR — cycling events + throughput counter
     ---------------------------------------------------------- */
  (function () {
    var pmEvents = document.getElementById('pm-events');
    var pmThroughput = document.getElementById('pm-throughput');
    if (!pmEvents || !pmThroughput) return;
    var allPmEvents = [
      { time: '09:42:01', module: 'ml.classifier',    color: '#06b6d4', msg: 'income_doc scored 0.94 \u2192 APPROVE' },
      { time: '09:42:04', module: 'rag.retrieval',    color: '#2dd4bf', msg: 'query matched 3 policy chunks (0.87 sim)' },
      { time: '09:42:07', module: 'pg.write',         color: '#818cf8', msg: 'applicant_id=8821 committed in 11ms' },
      { time: '09:42:10', module: 'compliance.check', color: '#22c55e', msg: 'result=PASS flags=[] threshold=0.90' },
      { time: '09:42:13', module: 'webhook.dispatch', color: '#a78bfa', msg: 'target=pipedrive status=201 deal=9043' },
      { time: '09:42:16', module: 'audit.log',        color: '#f59e0b', msg: 'hash=3f9a2c user=broker_07 action=approve' },
      { time: '09:42:19', module: 'doc.ingest',       color: '#94a3b8', msg: 'file=payslip_scan.pdf parser=azure_di' },
      { time: '09:42:22', module: 'ml.classifier',    color: '#06b6d4', msg: 'expense_ratio=0.31 risk_band=LOW' },
      { time: '09:42:25', module: 'rag.retrieval',    color: '#2dd4bf', msg: 'context_tokens=1840 model=gpt-4o' },
      { time: '09:42:28', module: 'pg.write',         color: '#818cf8', msg: 'transaction_log updated rows=3' }
    ];
    var pmIdx = 6, pmCount = 1847;
    function addPmEvent() {
      var evt = allPmEvents[pmIdx % allPmEvents.length]; pmIdx++;
      var row = document.createElement('div'); row.className = 'pm-event';
      row.innerHTML = '<span class="pm-time">' + evt.time + '</span><span class="pm-event-name" style="color:' + evt.color + ';">' + evt.module + '</span><span class="pm-event-data">' + evt.msg + '</span>';
      pmEvents.insertBefore(row, pmEvents.firstChild);
      var rows = pmEvents.querySelectorAll('.pm-event');
      if (rows.length > 6) pmEvents.removeChild(rows[rows.length - 1]);
    }
    setInterval(addPmEvent, 2500);
    setInterval(function () { pmCount++; pmThroughput.textContent = pmCount.toLocaleString(); }, 3000);
  }());

  /* ----------------------------------------------------------
     TECH STACK TABS
     ---------------------------------------------------------- */
  (function () {
    var btns = document.querySelectorAll('.stack-tab-btn');
    var panels = document.querySelectorAll('.stack-tab-panel');
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active'); this.setAttribute('aria-selected','true');
        var p = document.querySelector('.stack-tab-panel[data-panel="' + tab + '"]');
        if (p) p.classList.add('active');
      }.bind(btn));
    });
  }());

  /* ----------------------------------------------------------
     SERVICES PAGE — left nav
     ---------------------------------------------------------- */
  (function () {
    var items = document.querySelectorAll('.svc-nav-item');
    var panels = document.querySelectorAll('.svc-panel');
    if (!items.length) return;
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var svc = this.getAttribute('data-service');
        items.forEach(function (i) { i.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        var p = document.querySelector('.svc-panel[data-panel="' + svc + '"]');
        if (p) p.classList.add('active');
      }.bind(item));
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); } }.bind(item));
    });
  }());

  /* ----------------------------------------------------------
     CUSTOMER STORIES — prototype tabs
     ---------------------------------------------------------- */
  (function () {
    document.querySelectorAll('.cs-prototype').forEach(function (proto) {
      var tabs = proto.querySelectorAll('.cs-proto-tab');
      var panels = proto.querySelectorAll('.cs-proto-panel');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = this.getAttribute('data-proto-tab');
          tabs.forEach(function (t) { t.classList.remove('active'); });
          panels.forEach(function (p) { p.classList.remove('active'); });
          this.classList.add('active');
          var p = proto.querySelector('.cs-proto-panel[data-proto-panel="' + target + '"]');
          if (p) p.classList.add('active');
        }.bind(tab));
      });
    });
  }());

  /* ----------------------------------------------------------
     CASE STUDY / CUSTOMER STORY — architecture modals
     ---------------------------------------------------------- */
  (function () {
    document.querySelectorAll('.cs-arch-expand-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = document.getElementById(this.getAttribute('data-modal'));
        if (m) { m.hidden = false; document.body.style.overflow = 'hidden'; }
      });
    });
    document.querySelectorAll('.cs-modal-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = document.getElementById(this.getAttribute('data-modal'));
        if (m) { m.hidden = true; document.body.style.overflow = ''; }
      });
    });
    document.querySelectorAll('.cs-modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) { overlay.hidden = true; document.body.style.overflow = ''; }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.cs-modal-overlay:not([hidden])').forEach(function (m) {
          m.hidden = true; document.body.style.overflow = '';
        });
      }
    });
  }());

  /* ----------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
     ---------------------------------------------------------- */
  (function () {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-up, .reveal-fade').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(function (el) {
      observer.observe(el);
    });
  }());

  /* ----------------------------------------------------------
     HERO DASHBOARD — activity feed cycling + time counter
     ---------------------------------------------------------- */
  (function () {
    var feed = document.getElementById('hd-feed');
    var timeSaved = document.getElementById('hd-time-saved');
    if (!feed) return;

    var feedItems = [
      { cls: 'hd-feed-green', dot: 'green', text: '<strong>New client onboarded</strong> — documents collected automatically', time: '2m ago' },
      { cls: 'hd-feed-blue',  dot: 'blue',  text: '<strong>Report generated</strong> — sent to 12 clients, zero manual work', time: '6m ago' },
      { cls: 'hd-feed-amber', dot: 'amber', text: '<strong>Action required</strong> — Jordan P. missing 2 documents', time: '11m ago' },
      { cls: 'hd-feed-green', dot: 'green', text: '<strong>Deal approved</strong> — compliance check passed automatically', time: '18m ago' },
      { cls: 'hd-feed-blue',  dot: 'blue',  text: '<strong>CRM synced</strong> — 6 records updated from pipeline data', time: '24m ago' },
      { cls: 'hd-feed-green', dot: 'green', text: '<strong>Document AI</strong> — payslip classified in 0.8s, income extracted', time: '29m ago' },
      { cls: 'hd-feed-blue',  dot: 'blue',  text: '<strong>Compliance check</strong> — PASS &middot; 0 flags &middot; deal progressed', time: '33m ago' },
      { cls: 'hd-feed-amber', dot: 'amber', text: '<strong>Reminder sent</strong> — auto-chase for missing tax return', time: '41m ago' },
      { cls: 'hd-feed-green', dot: 'green', text: '<strong>Pipeline updated</strong> — Sam K. moved to assessment stage', time: '47m ago' }
    ];
    var feedIdx = 5;
    var timeVal = 31.4;

    setInterval(function () {
      var item = feedItems[feedIdx % feedItems.length]; feedIdx++;
      // Age all existing times
      feed.querySelectorAll('.hd-feed-time').forEach(function (el) {
        var t = el.textContent;
        var m = t.match(/(\d+)m/);
        if (m) el.textContent = (parseInt(m[1]) + 4) + 'm ago';
      });
      var row = document.createElement('div');
      row.className = 'hd-feed-item ' + item.cls;
      row.innerHTML = '<span class="hd-feed-dot ' + item.dot + '"></span><div class="hd-feed-text">' + item.text + '</div><span class="hd-feed-time">just now</span>';
      feed.insertBefore(row, feed.firstChild);
      var rows = feed.querySelectorAll('.hd-feed-item');
      if (rows.length > 5) feed.removeChild(rows[rows.length - 1]);
    }, 5000);

    if (timeSaved) {
      setInterval(function () {
        timeVal += 0.1;
        timeSaved.textContent = timeVal.toFixed(1);
      }, 6000);
    }
  }());

  /* ----------------------------------------------------------
     HERO DASHBOARD TABS
     ---------------------------------------------------------- */
  (function () {
    var tabs = document.querySelectorAll('.hd-tab');
    var panels = document.querySelectorAll('.hd-panel');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-hd-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        var p = document.querySelector('.hd-panel[data-hd-panel="' + target + '"]');
        if (p) p.classList.add('active');
      }.bind(tab));
    });
  }());

  /* ----------------------------------------------------------
     AI DECISIONS — cycle new decisions every 4s
     ---------------------------------------------------------- */
  (function () {
    var list = document.getElementById('hd-ai-decisions');
    if (!list) return;
    var fileNum = 8822;
    var decisions = ['approve','approve','approve','approve','review','approve','approve'];
    var idx = 0;
    var risks = { approve: 'LOW', review: 'MED' };
    var confs = [0.94, 0.97, 0.89, 0.91, 0.62, 0.96, 0.88];
    setInterval(function () {
      var type = decisions[idx % decisions.length];
      var conf = confs[idx % confs.length];
      var time = Math.floor(Math.random() * 12) + 5;
      idx++;
      var row = document.createElement('div');
      row.className = 'hd-ai-row ' + type;
      row.innerHTML = '<span class="hd-ai-badge ' + type + '">' + type.toUpperCase() + '</span>' +
        '<div class="hd-ai-detail">File #' + fileNum + ' &middot; risk=' + risks[type] + ' &middot; conf=' + conf + ' &middot; ' + time + 's</div>';
      fileNum++;
      list.insertBefore(row, list.firstChild);
      var rows = list.querySelectorAll('.hd-ai-row');
      if (rows.length > 5) list.removeChild(rows[rows.length - 1]);
    }, 4000);
  }());
