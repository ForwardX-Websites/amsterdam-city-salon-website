// Hamburger menu
(function () {
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('siteNav');
  if (!hamburger || !nav) return;
  hamburger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Mark today in opening hours tables
(function () {
  var dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  var vandaag = dagen[new Date().getDay()];
  document.querySelectorAll('.openingstijden tr[data-dag="' + vandaag + '"]').forEach(function (row) {
    row.classList.add('is-vandaag');
  });
})();

// Price list: category tabs + hair length toggle
(function () {
  var prijslijst = document.querySelector('.prijslijst');
  if (!prijslijst) return;

  var lengteToggle = document.getElementById('pfLengteToggle');

  function updateLengteToggleVisibility() {
    // Hide the length toggle when the active category has no length-based prices
    var activePanel = prijslijst.querySelector('.pf-panel.is-active');
    if (!activePanel || !lengteToggle) return;
    var heeftLengtePrijzen = activePanel.querySelector('[data-prijs-kort]');
    lengteToggle.classList.toggle('is-hidden', !heeftLengtePrijzen);
  }

  prijslijst.querySelectorAll('[data-pf-main]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      prijslijst.querySelectorAll('.pf-tab').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      prijslijst.querySelectorAll('.pf-panel').forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('pf-' + btn.dataset.pfMain);
      if (panel) panel.classList.add('is-active');
      updateLengteToggleVisibility();
    });
  });

  prijslijst.querySelectorAll('[data-pf-length]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lengte = btn.dataset.pfLength;
      prijslijst.querySelectorAll('.pf-length-tab').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      prijslijst.querySelectorAll('[data-prijs-' + lengte + ']').forEach(function (el) {
        el.textContent = el.getAttribute('data-prijs-' + lengte);
      });
    });
  });

  updateLengteToggleVisibility();
})();

// Ensure autoplay videos actually start (browsers can block autoplay on
// power saver, data saver or when the video enters the viewport later)
(function () {
  var videos = document.querySelectorAll('video[autoplay]');
  if (!videos.length) return;

  function tryPlay(video) {
    video.muted = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  videos.forEach(function (video) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.target.paused) tryPlay(entry.target);
        });
      }, { threshold: 0.2 }).observe(video);
    } else {
      tryPlay(video);
    }
  });

  // Last resort: first user interaction unlocks playback
  function playAll() {
    videos.forEach(function (video) { if (video.paused) tryPlay(video); });
  }
  document.addEventListener('touchstart', playAll, { once: true, passive: true });
  document.addEventListener('click', playAll, { once: true });
})();

// Scroll reveal
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { observer.observe(el); });
})();
