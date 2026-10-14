/**
 * MAIN CONTROLLER - Yashvardhan Singh Rathore Portfolio
 * Navigation, Typewriter Effect, Live C-Code Terminal Simulator,
 * Projects Filter & Modal Preview, Skills Filter, IST Live Clock,
 * Custom Cybernetic Animated Cursor, and Contact Form.
 */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // 1. CUSTOM CYBERNETIC ANIMATED CURSOR
  // -----------------------------------------------------------------
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    let cursor = document.querySelector('.custom-cursor');
    let follower = document.querySelector('.cursor-follower');

    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }

    if (!follower) {
      follower = document.createElement('div');
      follower.className = 'cursor-follower';
      document.body.appendChild(follower);
    }

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderFollower);
    }
    requestAnimationFrame(renderFollower);

    // Interactive hover triggers
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .tilt-card, .project-card, .circle-skill-card, .linear-skill-item, .spotlight-card, .terminal-run-btn'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        follower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        follower.classList.remove('cursor-hover');
      });
    });
  }

  // -----------------------------------------------------------------
  // 2. DYNAMIC TYPEWRITER EFFECT (Hero Section)
  // -----------------------------------------------------------------
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const titles = [
      'B.Tech CSE Core Student @ JECRC',
      'C Programming & Algorithmic Explorer',
      'Generative AI Tools & Media Specialist',
      'AI Video & Visual Storyteller',
      'Modern Web Developer & Prompt Engineer'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        typewriterText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 350;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 600);
  }

  // -----------------------------------------------------------------
  // 3. FLOATING PILL NAVBAR & SCROLLSPY
  // -----------------------------------------------------------------
  const navPill = document.querySelector('.nav-pill');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.querySelector('.nav-indicator');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const sections = document.querySelectorAll('section[id]');

  function updateNavIndicator(activeLink) {
    if (!navIndicator || !activeLink || !navPill) return;
    if (!activeLink.closest('.nav-links')) return;

    const pillRect = navPill.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const left = linkRect.left - pillRect.left;
    const width = linkRect.width;

    navIndicator.style.width = `${width}px`;
    navIndicator.style.transform = `translateX(${left}px)`;
    navIndicator.style.opacity = '1';
  }

  function handleScrollSpy() {
    const scrollPosition = window.scrollY + 220;
    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (!currentSectionId && window.scrollY < 200) {
      currentSectionId = 'home';
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
        if (link.closest('.nav-links')) {
          updateNavIndicator(link);
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  window.addEventListener('resize', () => {
    const activeDesktopLink = document.querySelector('.nav-links .nav-link.active');
    if (activeDesktopLink) updateNavIndicator(activeDesktopLink);
  }, { passive: true });

  setTimeout(() => {
    const activeDesktopLink = document.querySelector('.nav-links .nav-link.active') || document.querySelector('.nav-links .nav-link');
    if (activeDesktopLink) {
      activeDesktopLink.classList.add('active');
      updateNavIndicator(activeDesktopLink);
    }
  }, 100);

  // Mobile Menu Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -----------------------------------------------------------------
  // 4. INTERACTIVE HERO C-CODE TERMINAL SIMULATOR
  // -----------------------------------------------------------------
  const runBtn = document.getElementById('terminal-run-code');
  const termOutput = document.getElementById('terminal-live-output');

  if (runBtn && termOutput) {
    let isExecuting = false;

    runBtn.addEventListener('click', () => {
      if (isExecuting) return;
      isExecuting = true;

      runBtn.innerHTML = `
        <svg style="width:13px;height:13px;animation:radarSweep 0.8s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Compiling C...</span>
      `;

      termOutput.innerHTML = `
        <div style="color: #64748b;">$ gcc -Wall -O3 main.c -o portfolio && ./portfolio</div>
        <div style="color: #ffbd2e;">[1/2] Linking core libraries &amp; memory allocations...</div>
      `;

      setTimeout(() => {
        termOutput.innerHTML += `
          <div style="color: #27c93f;">[2/2] Build SUCCESS: 0 warnings, 0 errors (took 0.038s)</div>
          <div style="margin-top: 6px; padding: 6px 8px; background: rgba(0, 240, 255, 0.06); border-left: 2px solid var(--accent-cyan); color: #f8fafc;">
            <div><span class="out-prefix">&gt;&gt;</span> <strong>Engineer:</strong> Yashvardhan Singh Rathore</div>
            <div><span class="out-prefix">&gt;&gt;</span> <strong>University:</strong> JECRC University (B.Tech CSE Core - 1st Year)</div>
            <div><span class="out-prefix">&gt;&gt;</span> <strong>Core Proficiency:</strong> C Language (Pointers, Memory, Data Structures)</div>
            <div><span class="out-prefix">&gt;&gt;</span> <strong>Applied Power:</strong> AI Tools Across Text, Video, Art &amp; Web Dev</div>
            <div><span class="out-prefix">&gt;&gt;</span> <strong>System Status:</strong> Ready for innovation &amp; creative impact!</div>
          </div>
        `;
        runBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Re-run Code</span>
        `;
        isExecuting = false;
      }, 750);
    });
  }

  // -----------------------------------------------------------------
  // 5. LIVE CLOCK (Jaipur, Rajasthan / Indian Standard Time IST)
  // -----------------------------------------------------------------
  const liveClockEl = document.getElementById('live-local-time');
  if (liveClockEl) {
    function updateLiveClock() {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      liveClockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
  }

  // -----------------------------------------------------------------
  // 6. SKILLS CATEGORY FILTER TABS
  // -----------------------------------------------------------------
  const skillFilterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCategoryItems = document.querySelectorAll('.skills-dashboard-grid [data-category]');

  if (skillFilterBtns.length && skillCategoryItems.length) {
    skillFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        skillFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCategoryItems.forEach((item) => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.style.display = '';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // -----------------------------------------------------------------
  // 7. PROJECTS FILTERING LOGIC
  // -----------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterBtns.length && projectCards.length) {
    projectFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        projectFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const targetCat = btn.getAttribute('data-project-filter');

        projectCards.forEach((card, index) => {
          const cardCat = card.getAttribute('data-project-category');
          if (targetCat === 'all' || cardCat === targetCat) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, index * 40);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // -----------------------------------------------------------------
  // 8. INTERACTIVE PROJECT PREVIEW MODAL
  // -----------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const previewButtons = document.querySelectorAll('.btn-project-preview, .project-card');

  const projectDetailsMap = {
    'neurocraft': {
      title: 'NeuroCraft Studio — AI Prompt & Web Suite',
      badge: 'Interactive Web Application',
      desc: 'A full-featured creative developer workbench combining prompt engineering templates with live generative UI preview widgets, dynamic dark-mode styling, and instantaneous response streaming.',
      features: [
        'Responsive layout engineered with semantic HTML5, modern CSS variables, and fluid JavaScript',
        'Pre-engineered prompt pipelines for OpenAI, Gemini, and Claude models',
        'Instant JSON schema validation and copy-to-clipboard functionality',
        'Fluid glassmorphism aesthetic with 60 FPS CSS micro-interactions'
      ],
      mediaHtml: `
        <div style="text-align: center; color: #fff; padding: 20px;">
          <div style="font-family: var(--font-mono); font-size: 2.2rem; color: var(--accent-cyan); font-weight: bold; margin-bottom: 8px;">&lt;NeuroCraft /&gt;</div>
          <div style="color: var(--accent-teal); font-size: 0.95rem; font-family: var(--font-mono);">[LIVE INTERACTIVE WEB APPLICATION]</div>
          <p style="margin-top: 14px; max-width: 480px; margin-left: auto; margin-right: auto; font-size: 0.88rem; color: #94a3b8;">
            Synthesizing generative AI capabilities with low-latency client-side workflows.
          </p>
        </div>
      `
    },
    'chronicles-neo-jaipur': {
      title: 'Chronicles of Neo-Jaipur (Cinematic AI Short)',
      badge: 'AI Video & Worldbuilding',
      desc: 'A futuristic cinematic short film reimagining the historic heritage of Jaipur through a high-tech cyberpunk lens. Produced with Runway Gen-3 Alpha for camera motion, Midjourney v6 for concept keyframes, and ElevenLabs for ambient synthetic narration.',
      features: [
        'Generated over 60+ photorealistic architectural keyframes with Midjourney v6',
        'Camera panning, cinematic zooms, and hyper-detailed parallax motion using Runway Gen-3',
        'Custom script generated with LLM assistance and voiced with ElevenLabs realistic voice models',
        'Audio-reactive sound design with ambient cyberpunk synthesizers'
      ],
      mediaHtml: `
        <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, #000 80%);">
          <div class="scanline-overlay"></div>
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--gradient-accent); display: flex; align-items: center; justify-content: center; color: #000; box-shadow: 0 0 30px rgba(244, 63, 94, 0.6); margin-bottom: 12px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <div style="font-family: var(--font-mono); color: #fff; font-size: 1.1rem; font-weight: bold;">Runway Gen-3 Alpha Renders</div>
          <div style="font-size: 0.8rem; color: var(--accent-magenta); margin-top: 4px; font-family: var(--font-mono);">4K UHD Motion • ElevenLabs Audio Track</div>
        </div>
      `
    },
    'c-matrix': {
      title: 'C-Matrix Pointer & Memory Visualizer',
      badge: 'CSE Educational Web Tool',
      desc: 'Designed specifically for first-year computer science students at JECRC University, this interactive educational tool visually models pointer memory addressing, stack frames, heap allocation (malloc/free), and buffer operations in real time.',
      features: [
        'Live memory address map simulation displaying hexadecimal bytes',
        'Interactive pointer arrows updating dynamically during dereferencing (*p)',
        'Stack frame visualization for recursive function calls',
        'Step-by-step debugger walkthrough for students mastering C pointers'
      ],
      mediaHtml: `
        <div style="width: 90%; background: #060911; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 16px; font-family: var(--font-mono); font-size: 0.85rem;">
          <div style="color: var(--accent-cyan); margin-bottom: 8px;">// Pointer Memory Visualizer [C Core]</div>
          <div style="color: #94a3b8;">Address [0x7ffe04]: <span style="color:#27c93f;">int val = 42;</span></div>
          <div style="color: #94a3b8;">Address [0x7ffe08]: <span style="color:#ffbd2e;">int *ptr = &amp;val;</span> // points to 0x7ffe04</div>
          <div style="color: var(--accent-teal); margin-top: 6px;">Dereference *ptr = 42 (Successfully Resolved)</div>
        </div>
      `
    },
    'ai-explainer-reels': {
      title: 'Viral "AI in 60 Seconds" Explainer Video Series',
      badge: 'Short-Form AI Video Series',
      desc: 'A dynamic multi-episode short-form video series produced for social media, breaking down complex AI architectures, neural networks, and computer engineering paradigms into captivating 60-second reels using Pika Labs, CapCut AI, and AI avatars.',
      features: [
        'High-velocity motion graphics and AI video cuts generated via Pika and Runway',
        'Dynamic auto-captions and audio mastering tuned for social media engagement',
        'Produced 15+ comprehensive reels reaching thousands of tech enthusiasts',
        'Engaging explanations of Transformers, LLM tokens, and C vs Python performance'
      ],
      mediaHtml: `
        <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, #000 80%);">
          <div class="scanline-overlay"></div>
          <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--gradient-violet-cyan); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 25px rgba(139, 92, 246, 0.5); margin-bottom: 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <div style="font-family: var(--font-mono); color: #fff; font-size: 1rem; font-weight: bold;">Episode Showcase: How LLMs Think</div>
          <div style="font-size: 0.78rem; color: var(--accent-violet); margin-top: 4px; font-family: var(--font-mono);">60s Ultra-Engaging AI Reel Format</div>
        </div>
      `
    },
    'ai-infographics': {
      title: 'Viral Tech & AI Infographics Campaign',
      badge: 'AI Posts & Social Media Design',
      desc: 'Curated gallery of high-engagement carousel posts, infographics, and technical cheat sheets breaking down AI tools and C programming logic. Created with Midjourney v6 asset generation and modern graphic design principles.',
      features: [
        'Multi-slide technical breakdown carousels designed for developer communities',
        'AI prompt engineering cheat-sheets and workflow comparison diagrams',
        'Custom 3D isometric iconography and photorealistic AI backgrounds',
        'Proven content formatting for high retention, shares, and bookmarks'
      ],
      mediaHtml: `
        <div style="text-align: center; color: #fff; padding: 20px;">
          <div style="font-family: var(--font-mono); font-size: 1.8rem; color: var(--accent-violet); font-weight: bold; margin-bottom: 6px;">Visual Tech Series</div>
          <div style="color: var(--accent-cyan); font-size: 0.88rem; font-family: var(--font-mono);">Midjourney v6 • Canva AI • Social Carousels</div>
          <div style="margin-top: 12px; display: inline-flex; gap: 8px;">
            <span class="project-tag">Prompt Sheets</span>
            <span class="project-tag">C Roadmaps</span>
            <span class="project-tag">AI Workflows</span>
          </div>
        </div>
      `
    },
    'c-suite': {
      title: 'Algorithmic C Suite & System Micro-Tools',
      badge: 'C Language & Systems Tools',
      desc: 'A robust suite of command-line algorithmic utilities and benchmarking tools written in pure C. Focuses on minimal memory footprints, direct pointer manipulation, and high throughput.',
      features: [
        'Custom dynamic data structure implementations: Dynamic Arrays, Linked Lists, Binary Trees',
        'Algorithm benchmarking suite with microsecond precision timers',
        'Structured modular code with header files, Makefiles, and GCC optimization flags',
        'Zero-memory-leak guarantee verified using memory sanitizers'
      ],
      mediaHtml: `
        <div style="width: 85%; background: #0b1120; border: 1px solid rgba(0, 245, 212, 0.3); border-radius: 8px; padding: 18px; font-family: var(--font-mono); font-size: 0.85rem; text-align: left;">
          <div style="color: #27c93f;">// gcc -O3 -march=native benchmark.c -o bench</div>
          <div style="color: #d1d5db; margin-top: 4px;">Testing 1,000,000 pointer dereferences...</div>
          <div style="color: var(--accent-teal); margin-top: 4px;">[Execution Completed in 1.24 ms]</div>
          <div style="color: #64748b; margin-top: 4px;">Memory overhead: 0.00% leaks detected.</div>
        </div>
      `
    }
  };

  function openProjectModal(projectId) {
    if (!projectModal) return;
    const data = projectDetailsMap[projectId];
    if (!data) return;

    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalScreen = document.getElementById('modal-project-screen');
    const modalFeatures = document.getElementById('modal-project-features');

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalScreen) modalScreen.innerHTML = data.mediaHtml;

    if (modalFeatures) {
      modalFeatures.innerHTML = data.features.map(f => `
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  previewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('a') && !e.target.closest('.btn-project-preview')) return;
      
      const card = btn.closest('.project-card') || btn;
      const projectId = card.getAttribute('data-project-id');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // -----------------------------------------------------------------
  // 9. CONTACT FORM SUBMISSION & TOAST NOTIFICATION
  // -----------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const toast = document.getElementById('contact-toast');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg class="animate-spin" style="width: 18px; height: 18px; animation: radarSweep 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Transmitting Message...</span>
      `;
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = '';
        contactForm.reset();

        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4500);
      }, 850);
    });
  }
});
