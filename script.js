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
})();
