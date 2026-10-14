/**
 * SCROLL REVEALS, DYNAMIC GAUGES & COUNTER ANIMATIONS
 * Powered by IntersectionObserver for maximum 60fps performance
 */

(function initScrollAnimations() {
  // -----------------------------------------------------------------
  // 1. SCROLL REVEAL OBSERVER (Slide-ins, fade-ups, zoom-ins)
  // -----------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-init');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to save CPU
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // -----------------------------------------------------------------
  // 2. SKILL METERS FLUID FILL ANIMATION (CIRCULAR & LINEAR)
  // -----------------------------------------------------------------
  const skillsSection = document.getElementById('skills');

  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    // A. Animate Circular Progress Gauges
    const circleMeters = document.querySelectorAll('.circle-gauge');
    circleMeters.forEach((gauge) => {
      const circle = gauge.querySelector('.circle-progress');
      const percentValue = parseInt(gauge.getAttribute('data-percent') || '0', 10);
      const textEl = gauge.parentElement.querySelector('.circle-percentage');

      const circumference = 251.3; // 2 * PI * 40
      const targetOffset = circumference - (percentValue / 100) * circumference;

      if (circle) {
        circle.style.strokeDashoffset = targetOffset.toFixed(1);
      }

      // Smooth number count-up
      if (textEl) {
        animateCounter(textEl, 0, percentValue, 1500, '%');
      }
    });

    // B. Animate Linear Progress Bars
    const linearBars = document.querySelectorAll('.linear-progress-bar');
    linearBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-percent') || '0';
      bar.style.width = `${targetWidth}%`;
    });
  }

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
        }
      });
    }, {
      root: null,
      threshold: 0.2
    });

    skillsObserver.observe(skillsSection);
  }

  // -----------------------------------------------------------------
  // 3. STAT COUNTERS (About Section Highlights)
  // -----------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach((stat) => {
          const target = parseFloat(stat.getAttribute('data-target') || '0');
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          animateCounter(stat, 0, target, 2000, suffix, isDecimal);
        });
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.3
  });

  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  // -----------------------------------------------------------------
  // COUNTER HELPER FUNCTION
  // -----------------------------------------------------------------
  function animateCounter(element, start, end, duration, suffix = '', isDecimal = false) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      element.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.round(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isDecimal ? end.toFixed(1) + suffix : end + suffix;
      }
    }

    requestAnimationFrame(update);
  }
})();
