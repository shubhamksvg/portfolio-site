/**
 * Monet Case Study - Main Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // 2. Intersection Observer for Fade-Up Animations
  const fadeUpElements = document.querySelectorAll('.fade-up');
  
  const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve if you want it to only fade in once
        // fadeUpObserver.unobserve(entry.target);
      } else {
        // Remove class when out of view if you want it to trigger again on scroll back up
        // Less common for case studies, but keeps the magic alive
        entry.target.classList.remove('visible');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before it hits the bottom
    threshold: 0.1
  });

  fadeUpElements.forEach(el => fadeUpObserver.observe(el));

  // 3. Smooth scrolling for anchor links (Back to top)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. Spatial Nav — show/hide and active section tracking
  const spatialNav = document.getElementById('spatial-nav');
  const navItems = document.querySelectorAll('.spatial-nav-item[data-section]');

  if (spatialNav && navItems.length) {
    // Show nav after scrolling past hero
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        spatialNav.classList.add('visible');
      } else {
        spatialNav.classList.remove('visible');
      }
    }, { passive: true });

    // Track active section
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(item => item.classList.remove('active'));
          const activeItem = document.querySelector(`.spatial-nav-item[data-section="${entry.target.id}"]`);
          if (activeItem) activeItem.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    navItems.forEach(item => {
      const section = document.getElementById(item.dataset.section);
      if (section) sectionObserver.observe(section);
    });
  }
});
