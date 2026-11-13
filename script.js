// Duke · Portfolio interactions
(function () {
  var root = document.documentElement;

  // ---------- Theme toggle (follows system by default) ----------
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
  }
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Active nav link ----------
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) navIo.observe(target);
    });
  }

  // ---------- Design <-> Code switch ----------
  var sw = document.querySelector('.switch');
  var stage = document.querySelector('.dc-stage');
  if (sw && stage) {
    var panes = { design: stage.querySelector('.dc-design'), code: stage.querySelector('.dc-code') };
    sw.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.dataset.view;
        stage.dataset.view = view;
        sw.classList.toggle('is-code', view === 'code');
        sw.querySelectorAll('button').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        panes.design.setAttribute('aria-hidden', view === 'code' ? 'true' : 'false');
        panes.code.setAttribute('aria-hidden', view === 'design' ? 'true' : 'false');
      });
    });
  }

  // ---------- Draggable skill pills ----------
  document.querySelectorAll('.pill').forEach(function (pill) {
    var startX, startY, baseX = 0, baseY = 0;
    pill.addEventListener('pointerdown', function (e) {
      startX = e.clientX; startY = e.clientY;
      pill.setPointerCapture(e.pointerId);
      pill.classList.add('dragging');
    });
    pill.addEventListener('pointermove', function (e) {
      if (!pill.classList.contains('dragging')) return;
      pill.style.setProperty('--x', baseX + e.clientX - startX + 'px');
      pill.style.setProperty('--y', baseY + e.clientY - startY + 'px');
    });
    function end(e) {
      if (!pill.classList.contains('dragging')) return;
      baseX += e.clientX - startX; baseY += e.clientY - startY;
      pill.classList.remove('dragging');
    }
    pill.addEventListener('pointerup', end);
    pill.addEventListener('pointercancel', end);
  });

  // ---------- Lagos local time ----------
  var timeEl = document.getElementById('lagos-time');
  function tick() {
    if (!timeEl) return;
    try {
      timeEl.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos'
      }).format(new Date());
    } catch (e) { timeEl.textContent = ''; }
  }
  tick();
  setInterval(tick, 30000);

  // ---------- Copy email ----------
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      var done = function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  // ---------- Contact form -> opens email app ----------
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var subject = 'New enquiry: ' + d.get('type') + ' (from ' + d.get('name') + ')';
      var body = d.get('message') + '\n\n—\n' + d.get('name') + '\n' + d.get('email');
      window.location.href = 'mailto:adeyemidennis9@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  // About photos: hover (or tap) the stack to shuffle which photo is on top
  var stack = document.querySelector('.photo-stack');
  var backImg = stack && stack.querySelector('.frame-back img');
  if (backImg) {
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var frontCard = stack.querySelector('.frame-front');
    var backCard = stack.querySelector('.frame-back');
    var busy = false;
    var enableShuffle = function () {
      if (!stack.contains(backCard) || stack.classList.contains('can-shuffle')) return;
      stack.classList.add('can-shuffle');
      stack.setAttribute('role', 'button');
      stack.setAttribute('tabindex', '0');
      stack.setAttribute('aria-label', 'Shuffle photos');
      stack.setAttribute('aria-pressed', 'false');
      var hint = document.createElement('p');
      hint.className = 'photo-hint';
      hint.textContent = (canHover ? 'Hover' : 'Tap') + ' to shuffle ↺';
      stack.appendChild(hint);
    };
    var shuffle = function () {
      if (busy || !stack.classList.contains('can-shuffle')) return;
      busy = true;
      var swapped = stack.classList.toggle('is-swapped');
      var goingBack = swapped ? frontCard : backCard;
      var comingUp = swapped ? backCard : frontCard;
      goingBack.classList.add('to-back');
      comingUp.classList.add('to-front');
      stack.setAttribute('aria-pressed', swapped ? 'true' : 'false');
      setTimeout(function () {
        goingBack.classList.remove('to-back');
        comingUp.classList.remove('to-front');
        busy = false;
      }, 720);
    };
    if (backImg.complete && backImg.naturalWidth) enableShuffle();
    else backImg.addEventListener('load', enableShuffle);
    if (canHover) stack.addEventListener('mouseenter', shuffle);
    else stack.addEventListener('click', shuffle);
    stack.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); shuffle(); }
    });
  }

  // Live project previews: each plays only while it's on screen
  var previews = document.querySelectorAll('[data-preview]');
  if (previews.length) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var naira = function (n) { return '₦' + Math.round(n).toLocaleString('en-NG'); };
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var tween = function (ms, fn) {
      return new Promise(function (resolve) {
        var start = null;
        var step = function (now) {
          if (start === null) start = now;
          var t = Math.min((now - start) / ms, 1);
          fn(t);
          if (t < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    };

    var players = {
      fewsure: function (el) {
        var amount = el.querySelector('[data-amount]');
        var saved = el.querySelector('[data-saved]');
        var total = 18450000;
        return {
          final: function () { amount.textContent = naira(total); saved.textContent = naira(total); el.classList.add('is-built'); },
          cycle: function () {
            el.classList.remove('is-built');
            amount.textContent = naira(0); saved.textContent = naira(0);
            return wait(500)
              .then(function () { return tween(1400, function (t) { amount.textContent = naira(total * ease(t)); }); })
              .then(function () { el.classList.add('is-built'); return tween(2300, function (t) { saved.textContent = naira(total * t); }); })
              .then(function () { return wait(2600); });
          }
        };
      },
      village: function (el) {
        var timer = el.querySelector('[data-timer]');
        var state = el.querySelector('[data-state]');
        var bar = el.querySelector('.pv-vh-bar');
        var C = 326.7, secs = 45;
        var show = function (t) {
          var left = Math.ceil(secs * (1 - t));
          timer.textContent = '00:' + (left < 10 ? '0' : '') + left;
          bar.style.strokeDashoffset = String(C * (1 - t));
        };
        return {
          final: function () { show(1); state.textContent = 'Done'; el.classList.add('is-done'); },
          cycle: function () {
            el.classList.remove('is-done'); state.textContent = 'Washing'; show(0);
            return wait(500)
              .then(function () { return tween(3200, show); })
              .then(function () { state.textContent = 'Done'; el.classList.add('is-done'); return wait(2800); });
          }
        };
      }
    };

    previews.forEach(function (el) {
      var kind = el.getAttribute('data-preview');
      var make = players[kind];
      if (!make) return;
      var p = make(el);
      if (reduced || !('IntersectionObserver' in window)) { p.final(); return; }
      var visible = false, running = false;
      var loop = function () {
        if (!visible) { running = false; return; }
        running = true;
        p.cycle().then(loop);
      };
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !running) loop();
        });
      }, { threshold: 0.35 }).observe(el);
    });
  }
})();
