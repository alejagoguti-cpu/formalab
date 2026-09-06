const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  // --- 1. KINETIC CURSOR WITH SPRING LERP ---
  const cursor = document.querySelector('.cursor-glow');
  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;
  let isHovering = false;

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  // Render loop a 60fps con amortiguación
  function renderCursor() {
    const radius = isHovering ? 160 : 130;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    if (cursor) {
      cursor.style.transform = `translate3d(${currentX - radius}px, ${currentY - radius}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expandir cursor al interactuar
  const interactiveElements = document.querySelectorAll('a, button, .step-card, .challenge-card, .audience');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      cursor?.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      cursor?.classList.remove('is-hovering');
    });
  });

  // --- 2. HERO 3D ISOMETRIC PARALLAX ---
  const visual = document.querySelector('.hero-visual');
  const cube = document.querySelector('.cube');
  const orbits = document.querySelectorAll('.orbit');
  const heroTags = document.querySelectorAll('.visual-tag');

  if (visual && cube) {
    let heroTargetX = 0, heroTargetY = 0;
    let heroCurrentX = 0, heroCurrentY = 0;

    visual.addEventListener('pointermove', (event) => {
      const box = visual.getBoundingClientRect();
      heroTargetX = (event.clientX - box.left) / box.width - 0.5;
      heroTargetY = (event.clientY - box.top) / box.height - 0.5;
    });

    visual.addEventListener('pointerleave', () => {
      heroTargetX = 0;
      heroTargetY = 0;
    });

    function updateHero3D() {
      heroCurrentX += (heroTargetX - heroCurrentX) * 0.1;
      heroCurrentY += (heroTargetY - heroCurrentY) * 0.1;

      cube.style.transform = `translate3d(${heroCurrentX * 28}px, ${heroCurrentY * 28}px, 20px) rotateX(${heroCurrentY * -20}deg) rotateY(${heroCurrentX * 20}deg) rotateZ(${30 + heroCurrentX * 10}deg) skewY(-7deg)`;
      visual.style.transform = `rotate(${heroCurrentX * 3.5}deg) scale(${1 + Math.abs(heroCurrentX) * 0.03})`;

      orbits.forEach((orbit, i) => {
        orbit.style.transform = `translate3d(${heroCurrentX * (10 + i * 8)}px, ${heroCurrentY * (10 + i * 8)}px, 0)`;
      });

      heroTags.forEach((tag, i) => {
        tag.style.transform = `translate3d(${heroCurrentX * -12}px, ${heroCurrentY * -12}px, 0)`;
      });

      requestAnimationFrame(updateHero3D);
    }
    requestAnimationFrame(updateHero3D);
  }

  // --- 3. MAGNETIC BUTTONS & INTERACTION TILT ---
  document.querySelectorAll('.button, .nav-cta, .nav a').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      button.style.transform = `translate3d(${x * 9}px, ${y * 7}px, 0)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  // --- 4. SCROLL REVEAL CON OBSERVER ESCALONADO ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-section, .step-card, .audience, .challenge-card').forEach((item, index) => {
    item.style.transitionDelay = `${(index % 4) * 80}ms`;
    observer.observe(item);
  });

  // --- 5. PROGRESS BAR & HERO SHIFT ON SCROLL ---
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    
    document.documentElement.style.setProperty('--scroll-progress', `${pageProgress}%`);
    const progress = Math.min(scrollY / 800, 1);
    document.documentElement.style.setProperty('--hero-shift', `${progress * -110}px`);

    lastScrollY = scrollY;
  }, { passive: true });
}

