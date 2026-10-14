/**
 * MAGNETIC HOVER EFFECT
 * Attracts CTA buttons towards the cursor when within proximity
 */

(function initMagneticEffect() {
  // Select all magnetic elements
  const magneticElements = document.querySelectorAll('.magnetic-btn-wrap, .magnetic-target');
  if (!magneticElements.length) return;

  magneticElements.forEach((wrapper) => {
    const target = wrapper.querySelector('.btn, .nav-cta, a, button') || wrapper;
    let bounds = null;
    let isHovering = false;
    let frameId = null;

    const pullStrength = 0.35; // Magnet attraction strength
    const textPullStrength = 0.15; // Parallax text movement
    const innerText = target.querySelector('span') || target;

    function handleMouseMove(e) {
      if (!bounds) bounds = wrapper.getBoundingClientRect();

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 120; // Proximity trigger area

      if (distance < maxDistance) {
        if (!isHovering) {
          isHovering = true;
          target.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, filter 0.3s ease';
        }

        const moveX = deltaX * pullStrength;
        const moveY = deltaY * pullStrength;

        target.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(1.05)`;
        
        if (innerText && innerText !== target) {
          innerText.style.transform = `translate3d(${(deltaX * textPullStrength).toFixed(2)}px, ${(deltaY * textPullStrength).toFixed(2)}px, 0)`;
        }
      } else if (isHovering) {
        resetPosition();
      }
    }

    function resetPosition() {
      isHovering = false;
      target.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
      target.style.transform = 'translate3d(0, 0, 0) scale(1)';
      if (innerText && innerText !== target) {
        innerText.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        innerText.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    wrapper.addEventListener('mouseenter', () => {
      bounds = wrapper.getBoundingClientRect();
      isHovering = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (bounds) {
        handleMouseMove(e);
      }
    }, { passive: true });

    wrapper.addEventListener('mouseleave', () => {
      resetPosition();
    });

    window.addEventListener('resize', () => {
      bounds = wrapper.getBoundingClientRect();
    }, { passive: true });
  });
})();
