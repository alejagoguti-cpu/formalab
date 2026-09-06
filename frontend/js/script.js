const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  // --- 1. KINETIC CURSOR WITH SPRING LERP ---
  const cursor = document.querySelector('.cursor-glow');
  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    if (cursor) {
      cursor.style.transform = `translate3d(${currentX - 110}px, ${currentY - 110}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // --- 2. HERO 3D ISOMETRIC PARALLAX ---
  const visual = document.querySelector('.hero-visual');
  const cube = document.querySelector('.cube');
  const orbits = document.querySelectorAll('.orbit');

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
      heroCurrentX += (heroTargetX - heroCurrentX) * 0.08;
      heroCurrentY += (heroTargetY - heroCurrentY) * 0.08;

      cube.style.transform = `translate3d(${heroCurrentX * 20}px, ${heroCurrentY * 20}px, 0) rotate(${30 + heroCurrentX * 10}deg) skewY(-7deg)`;
      visual.style.transform = `rotate(${heroCurrentX * 2}deg)`;

      requestAnimationFrame(updateHero3D);
    }
    requestAnimationFrame(updateHero3D);
  }

  // --- 3. SUBTLE MAGNETIC BUTTONS ---
  document.querySelectorAll('.button, .nav-cta').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      button.style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = 'translate3d(0, 0, 0)';
    });
  });

  // --- 4. SCROLL REVEAL OBSERVER ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-section').forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 60}ms`;
    observer.observe(item);
  });

  // --- 5. PROGRESS BAR & SCROLL ACCELERATION ---
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    
    document.documentElement.style.setProperty('--scroll-progress', `${pageProgress}%`);
    const progress = Math.min(scrollY / 800, 1);
    document.documentElement.style.setProperty('--hero-shift', `${progress * -90}px`);
  }, { passive: true });
}

