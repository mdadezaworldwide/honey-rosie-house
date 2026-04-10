/* ══════════════════════════════════════
   HONEY ROSIE HOUSE — theme.js
   Ported from index-blue.html (2026-04-10)
   ══════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Header scroll shadow ───
  window.addEventListener('scroll', function () {
    document.querySelectorAll('.site-header').forEach(function (h) {
      h.classList.toggle('scrolled', window.scrollY > 10);
    });
  }, { passive: true });

  // ─── Product card fade-in ───
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var card = entry.target;
        var parent = card.parentElement;
        var siblings = Array.prototype.filter.call(parent.children, function (c) {
          return c.classList.contains('p-card');
        });
        var idx = siblings.indexOf(card);
        setTimeout(function () { card.classList.add('visible'); }, idx * 80);
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  function observeCards(root) {
    (root || document).querySelectorAll('.p-card').forEach(function (c) {
      cardObserver.observe(c);
    });
  }

  function forceCardsVisible(root) {
    (root || document).querySelectorAll('.p-card:not(.visible)').forEach(function (c, i) {
      setTimeout(function () {
        c.classList.add('visible');
        cardObserver.unobserve(c);
      }, i * 60);
    });
  }

  observeCards();
  setTimeout(function () { forceCardsVisible(); }, 800);

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { forceCardsVisible(); }
  });

  // Expose for section scripts that re-render cards
  window.HRH = window.HRH || {};
  window.HRH.observeCards = observeCards;
  window.HRH.forceCardsVisible = forceCardsVisible;

  // ─── Hero featured product (thumbnail swap) ───
  var heroMain = document.getElementById('heroMain');
  if (heroMain) {
    var imgFront = document.getElementById('heroImgFront');
    var imgBehind = document.getElementById('heroImgBehind');
    var heroNameEl = document.getElementById('heroMainName');
    var heroPriceEl = document.getElementById('heroMainPrice');
    var heroHref = null;

    document.querySelectorAll('.hero-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        document.querySelectorAll('.hero-thumb').forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');

        var src = thumb.getAttribute('src');
        var name = thumb.dataset.name;
        var price = thumb.dataset.price;
        heroHref = thumb.dataset.href || null;

        if (imgBehind && imgFront) {
          imgBehind.src = src;
          imgFront.classList.add('fading');
          setTimeout(function () {
            imgFront.src = src;
            imgFront.classList.remove('fading');
          }, 300);
        }
        if (heroNameEl && name) heroNameEl.textContent = name;
        if (heroPriceEl && price) heroPriceEl.textContent = price;
      });
    });

    heroMain.addEventListener('click', function () {
      if (heroHref) window.location.href = heroHref;
    });
  }

  // ─── Drag-to-scroll for horizontally scrolling rows ───
  document.querySelectorAll('.product-scroll').forEach(function (el) {
    var isDown = false;
    var startX, scrollLeft;
    el.addEventListener('mousedown', function (e) {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(function (evt) {
      el.addEventListener(evt, function () {
        isDown = false;
        el.style.cursor = 'grab';
      });
    });
    el.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });

  // ─── Cart panel open/close ───
  var cartPanel = document.getElementById('cartPanel');
  window.openCart = function () {
    if (cartPanel) cartPanel.classList.add('open');
  };
  window.closeCart = function () {
    if (cartPanel) cartPanel.classList.remove('open');
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('open')) {
      window.closeCart();
    }
  });

  // ─── Toast ───
  window.showToast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg || '準備中';
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 1800);
  };

  // ─── SOLD OUT cards: click to show notify toast ───
  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.p-card--soldout');
    if (card && card.querySelector('.p-card__notify')) {
      e.preventDefault();
      e.stopPropagation();
      window.showToast('再入荷通知を受け取るには準備中');
    }
  }, true);
})();
