/**
 * 3D TILT INTERACTION WITH DYNAMIC GLARE
 * Computes mouse coordinates relative to card center and applies 3D perspective transforms
 */

(function initTiltEffect() {
  const tiltCards = document.querySelectorAll('.tilt-card, .project-card, .spotlight-card');
  if (!tiltCards.length) return;

  const MAX_TILT = 16; // Maximum tilt rotation degrees
  const PERSPECTIVE = 1000;

  tiltCards.forEach((card) => {
    let bounds = null;
    let isHovered = false;
    let animationFrame = null;

    // Ensure glare layer exists
    let glare = card.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.prepend(glare);
    }

    function updateCardTransform(x, y) {
      if (!bounds) return;

      const mouseX = x - bounds.left;
      const mouseY = y - bounds.top;

      const percentX = (mouseX / bounds.width) * 2 - 1; // -1 to 1
      const percentY = (mouseY / bounds.height) * 2 - 1; // -1 to 1

      // Note: rotateX is based on Y offset (tilting up/down), rotateY is based on X offset
      const rotateX = -percentY * MAX_TILT;
      const rotateY = percentX * MAX_TILT;

      card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

      // Move glare highlight
      if (glare) {
        const glareX = (mouseX / bounds.width) * 100;
        const glareY = (mouseY / bounds.height) * 100;
        glare.style.opacity = '0.55';
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(0, 240, 255, 0.1) 40%, transparent 80%)`;
      }
    }

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      card.style.transition = 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        updateCardTransform(e.clientX, e.clientY);
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      // Smooth reset
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      if (glare) {
        glare.style.opacity = '0';
      }
    });

    // Recalculate bounds on window resize
    window.addEventListener('resize', () => {
      if (isHovered) bounds = card.getBoundingClientRect();
    }, { passive: true });
  });
})();
