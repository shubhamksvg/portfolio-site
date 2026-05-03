/* ============================================================
   LOCI — SPATIAL INTERACTION ENGINE
   
   Systems:
   1. Scroll-driven fade-up / scale-in reveals
   2. Parallax depth (hero environment layer)
   3. Gaze-hover specular sweep on glass panels
   4. Ambient color transitions per widget section
   5. Timeline scrubbing (A Day with Loci)
   6. Scroll-hint auto-hide
   7. Section navigation dots
   ============================================================ */

(function () {
  'use strict';

  // ── Cache DOM references ──
  const body = document.body;
  const heroSection = document.getElementById('hero-section');
  const environmentLayer = document.getElementById('environment-layer');
  const glassLayer = document.getElementById('glass-layer');
  const scrollHint = document.querySelector('.scroll-hint');
  const scrollProgress = document.getElementById('scroll-progress');
  const sectionNav = document.getElementById('spatial-nav');
  const navDots = document.querySelectorAll('.spatial-nav-item');

  // Sections with ambient color assignments
  const ambientSections = document.querySelectorAll('[data-ambient]');
  
  // All fade-up and scale-in elements
  const revealElements = document.querySelectorAll('.fade-up, .scale-in');
  
  // Interactive glass panels (gaze-hover targets)
  const interactivePanels = document.querySelectorAll('.glass-panel-interactive');

  // ── State ──
  let scrollY = 0;
  let ticking = false;
  let hasScrolled = false;
  const viewportH = window.innerHeight;

  // ============================================================
  // 1. INTERSECTION OBSERVER — Scroll Reveals
  // ============================================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // 2. PARALLAX — Hero environment layer depth
  // ============================================================
  function updateParallax() {
    if (!environmentLayer) return;
    const sp = Math.min(scrollY / viewportH, 1);
    const scale = 1 + sp * 0.1;
    const opacity = 1 - sp * 0.3;
    environmentLayer.style.transform = 'scale(' + scale + ')';
    environmentLayer.style.opacity = opacity;
  }

  // ============================================================
  // 3. SCROLL HINT — Hide after first scroll
  // ============================================================
  function updateScrollHint() {
    if (!scrollHint) return;
    if (scrollY > 80 && !hasScrolled) {
      hasScrolled = true;
      scrollHint.style.opacity = '0';
      scrollHint.style.transition = 'opacity 0.6s ease';
      setTimeout(function() { scrollHint.style.display = 'none'; }, 600);
    }
  }

  // ============================================================
  // 4. AMBIENT COLOR TRANSITIONS
  // ============================================================
  var ambientColors = {
    'default':    '#F5F5F7',
    'focus':      '#F0EDE8',
    'kitchen':    '#F2EDE6',
    'weather':    '#E8ECF2',
    'fitness':    '#EDEEF0',
    'medication': '#F0EDEA'
  };

  var currentAmbient = 'default';

  function updateAmbientColor() {
    var activeAmbient = 'default';
    ambientSections.forEach(function(section) {
      var rect = section.getBoundingClientRect();
      var sectionMiddle = rect.top + rect.height / 2;
      if (sectionMiddle > 0 && sectionMiddle < viewportH * 0.75) {
        var ambient = section.getAttribute('data-ambient');
        if (ambient) activeAmbient = ambient;
      }
    });
    if (activeAmbient !== currentAmbient) {
      currentAmbient = activeAmbient;
      var color = ambientColors[currentAmbient] || ambientColors['default'];
      glassLayer.style.backgroundColor = color;
    }
  }

  // ============================================================
  // 5. (Removed — old timeline scrubbing, replaced by cinematic scenes)
  // ============================================================

  // ============================================================
  // 6. GAZE-HOVER — Specular sweep on interactive panels
  // ============================================================
  interactivePanels.forEach(function(panel) {
    panel.addEventListener('mousemove', function(e) {
      var rect = panel.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      panel.style.setProperty('--gaze-x', x + 'px');
      panel.style.setProperty('--gaze-y', y + 'px');
      var afterEl = panel.querySelector('.gaze-light') || createGazeLight(panel);
      afterEl.style.left = x + 'px';
      afterEl.style.top = y + 'px';
    });
    panel.addEventListener('mouseleave', function() {
      var afterEl = panel.querySelector('.gaze-light');
      if (afterEl) afterEl.style.opacity = '0';
    });
    panel.addEventListener('mouseenter', function() {
      var afterEl = panel.querySelector('.gaze-light');
      if (afterEl) afterEl.style.opacity = '1';
    });
  });

  function createGazeLight(panel) {
    var light = document.createElement('div');
    light.className = 'gaze-light';
    light.style.cssText = 'position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.2) 0%,transparent 70%);pointer-events:none;opacity:0;transition:opacity 0.2s ease;transform:translate(-50%,-50%);z-index:10;';
    panel.appendChild(light);
    return light;
  }

  // ============================================================
  // 7. WIDGET IMAGE PARALLAX
  // ============================================================
  var widgetFrames = document.querySelectorAll('.widget-image-frame img');

  function updateWidgetParallax() {
    widgetFrames.forEach(function(img) {
      var rect = img.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) {
        var progress = (viewportH - rect.top) / (viewportH + rect.height);
        var shift = (progress - 0.5) * 20;
        img.style.transform = 'translateY(' + shift + 'px) scale(1.03)';
      }
    });
  }

  // ============================================================
  // 8. SCROLL PROGRESS BAR
  // ============================================================
  function updateScrollProgressBar() {
    if (!scrollProgress) return;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ============================================================
  // 9. SECTION NAVIGATION DOTS
  // ============================================================
  function updateSectionNav() {
    if (!sectionNav || navDots.length === 0) return;

    // Show/hide nav after scrolling past hero
    if (scrollY > viewportH * 0.5) {
      sectionNav.classList.add('visible');
    } else {
      sectionNav.classList.remove('visible');
    }

    // Determine active section
    var activeId = 'hero-section';
    navDots.forEach(function(dot) {
      var sectionId = dot.getAttribute('data-section');
      var section = document.getElementById(sectionId);
      if (!section) return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= viewportH * 0.4) {
        activeId = sectionId;
      }
    });

    navDots.forEach(function(dot) {
      var isActive = dot.getAttribute('data-section') === activeId;
      dot.classList.toggle('active', isActive);
    });
  }

  // ============================================================
  // SCROLL LOOP — requestAnimationFrame
  // ============================================================
  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateParallax();
        updateScrollHint();
        updateAmbientColor();
        updateWidgetParallax();
        updateScrollProgressBar();
        updateSectionNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    onScroll();
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(function() {
      body.style.opacity = '1';
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

  // ============================================================
  // FILM STRIP — Auto-scroll + manual wheel override
  // ============================================================
  const filmStrip = document.querySelector('.film-strip');
  if (filmStrip) {
    let autoScrollSpeed = 0.5; // px per frame (~30px/sec at 60fps)
    let isPaused = false;
    let pauseTimer = null;

    function autoScroll() {
      if (!isPaused) {
        filmStrip.scrollLeft += autoScrollSpeed;
        // Loop back when reaching the end
        if (filmStrip.scrollLeft >= filmStrip.scrollWidth - filmStrip.clientWidth) {
          filmStrip.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    }

    // Manual wheel scrolling pauses auto-scroll briefly
    filmStrip.addEventListener('wheel', function(e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        filmStrip.scrollLeft += e.deltaY;
      }
      isPaused = true;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(function() {
        isPaused = false;
      }, 3000);
    }, { passive: false });

    requestAnimationFrame(autoScroll);
  }

  // ============================================================
  // LAZY AUTOPLAY VIDEOS
  // ============================================================
  const autoplayVideos = document.querySelectorAll('.autoplay-video');
  if (autoplayVideos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.autoplaySrc) {
            iframe.src = iframe.dataset.autoplaySrc;
          }
          observer.unobserve(iframe);
        }
      });
    }, { rootMargin: '0px 0px -100px 0px' });

    autoplayVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }

})();
