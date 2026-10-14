/**
 * AMBIENT MOVING GRADIENT MESH CANVAS
 * High-performance 60 FPS ambient background with smooth drifting color nodes
 * and interactive particle response.
 */

(function initAmbientMesh() {
  const canvasContainer = document.getElementById('ambient-canvas-container');
  if (!canvasContainer) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvasContainer.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let isVisible = true;

  // Mouse interaction state
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 180
  };

  // Gradient mesh orbs configuration
  const orbs = [
    {
      x: 0.2,
      y: 0.25,
      radius: 420,
      color: 'rgba(0, 240, 255, 0.12)', // Neon Cyan
      vx: 0.0004,
      vy: 0.0003,
      phase: 0
    },
    {
      x: 0.8,
      y: 0.35,
      radius: 460,
      color: 'rgba(0, 245, 212, 0.09)', // Neon Teal
      vx: -0.0003,
      vy: 0.0004,
      phase: Math.PI / 3
    },
    {
      x: 0.5,
      y: 0.75,
      radius: 520,
      color: 'rgba(139, 92, 246, 0.10)', // Cyber Violet
      vx: 0.0003,
      vy: -0.0003,
      phase: Math.PI
    },
    {
      x: 0.15,
      y: 0.85,
      radius: 380,
      color: 'rgba(59, 130, 246, 0.08)', // Electric Blue
      vx: -0.0002,
      vy: -0.0004,
      phase: (Math.PI * 3) / 2
    }
  ];

  // Subtle floating ambient dust particles
  const particleCount = 45;
  const particles = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius: Math.random() * 1.5 + 0.5,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        color: i % 2 === 0 ? 'rgba(0, 240, 255,' : 'rgba(0, 245, 212,'
      });
    }
  }

  let lastTime = performance.now();

  function animate(currentTime) {
    if (!isVisible) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    const dt = Math.min(currentTime - lastTime, 50);
    lastTime = currentTime;

    // Smooth mouse lerping
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Clear frame
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Mesh Gradient Orbs with composite operation
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      orb.phase += 0.0008 * dt;

      // Drifting physics using harmonic sine/cosine
      const curX = (orb.x + Math.sin(orb.phase) * 0.08) * width;
      const curY = (orb.y + Math.cos(orb.phase * 0.8) * 0.08) * height;

      // Mouse influence
      const dx = curX - mouse.x;
      const dy = curY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let pushX = 0;
      let pushY = 0;
      if (dist < 400 && dist > 0) {
        const force = (1 - dist / 400) * 40;
        pushX = (dx / dist) * force;
        pushY = (dy / dist) * force;
      }

      const drawX = curX + pushX;
      const drawY = curY + pushY;

      const gradient = ctx.createRadialGradient(
        drawX, drawY, 0,
        drawX, drawY, orb.radius
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(0.5, orb.color.replace(/[\d\.]+\)$/, '0.04)'));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(drawX, drawY, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Subtle Ambient Dust Particles
    ctx.globalCompositeOperation = 'source-over';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);

      // Screen wrap
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse proximity interaction
      const pdx = p.x - mouse.x;
      const pdy = p.y - mouse.y;
      const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
      let pAlpha = p.alpha;

      if (pdist < mouse.radius) {
        const repulse = (1 - pdist / mouse.radius) * 1.5;
        p.x += (pdx / pdist) * repulse;
        p.y += (pdy / pdist) * repulse;
        pAlpha = Math.min(p.alpha * 2, 0.9);

        // Constellation line from particle to cursor
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - pdist / mouse.radius) * 0.35})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${pAlpha})`;
      ctx.fill();
    }

    // 3. Connect close particle pairs with subtle glowing cybernetic lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 95) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 245, 212, ${(1 - dist / 95) * 0.14})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  // Pause when tab is not visible to maximize battery and performance
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mediaQuery.matches) {
    resize();
    initParticles();
    animationFrameId = requestAnimationFrame(animate);
  }
})();
