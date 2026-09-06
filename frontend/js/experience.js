// ==========================================================================
// FORMA LABS — EXPERIENCIA INTERACTIVA & LOGICA INNER PAGES
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Control de Modales y Prellenado Dinámico
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-modal]').forEach((button) => {
    button.addEventListener('click', (e) => {
      const targetSelector = button.dataset.modal;
      const target = document.querySelector(targetSelector);
      if (!target) return;

      // Prellenar reto en Resuelve
      const challengeName = button.dataset.challenge;
      const challengeSelect = target.querySelector('#challengeSelect');
      if (challengeName && challengeSelect) {
        challengeSelect.value = challengeName;
      }

      // Prellenar convocatoria/rol en Conecta
      const roleName = button.dataset.role;
      const roleSelect = target.querySelector('#roleSelect');
      if (roleName && roleSelect) {
        roleSelect.value = roleName;
      }

      target.classList.add('show');
    });
  });

  // Cerrar modales con botón [data-close]
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) modal.classList.remove('show');
    });
  });

  // Cerrar modales al hacer clic en el fondo
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('show');
    });
  });

  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) openModal.classList.remove('show');
    }
  });

  // --------------------------------------------------------------------------
  // 2. Filtros de Categorías (Resuelve & Conecta)
  // --------------------------------------------------------------------------
  function setupCategoryFilter(containerId, itemSelector) {
    const filterContainer = document.getElementById(containerId);
    if (!filterContainer) return;

    const tabs = filterContainer.querySelectorAll('.filter-tab');
    const items = document.querySelectorAll(itemSelector);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;

        items.forEach((item) => {
          const itemCategory = item.dataset.category;
          if (category === 'all' || itemCategory === category) {
            item.style.display = '';
            item.style.animation = 'fade-slide-up 0.4s ease both';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Inicializar filtros para retos y para oportunidades
  setupCategoryFilter('challengeFilters', '.contest-card');
  setupCategoryFilter('connectFilters', '.opportunity-card');

  // --------------------------------------------------------------------------
  // 3. Simulación Interactiva de Reproductor Demo (Aprende)
  // --------------------------------------------------------------------------
  const playDemoBtn = document.getElementById('playDemoBtn');
  const videoOverlay = document.getElementById('videoOverlay');
  const simPlayToggle = document.getElementById('simPlayToggle');
  const simTimer = document.getElementById('simTimer');
  const simProgressFill = document.getElementById('simProgressFill');

  let isPlaying = false;
  let playInterval = null;
  let currentSeconds = 0;
  const totalSeconds = 12 * 60 + 40; // 12:40

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function startPlayerSimulation() {
    isPlaying = true;
    if (videoOverlay) videoOverlay.classList.add('playing');
    if (simPlayToggle) simPlayToggle.textContent = '❚❚';

    if (playInterval) clearInterval(playInterval);
    playInterval = setInterval(() => {
      if (currentSeconds < totalSeconds) {
        currentSeconds += 2;
        const progressPct = (currentSeconds / totalSeconds) * 100;
        if (simProgressFill) simProgressFill.style.width = `${progressPct}%`;
        if (simTimer) simTimer.textContent = `${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`;
      } else {
        stopPlayerSimulation();
      }
    }, 250);
  }

  function stopPlayerSimulation() {
    isPlaying = false;
    if (simPlayToggle) simPlayToggle.textContent = '▶';
    if (playInterval) clearInterval(playInterval);
  }

  if (playDemoBtn) {
    playDemoBtn.addEventListener('click', () => {
      startPlayerSimulation();
    });
  }

  if (simPlayToggle) {
    simPlayToggle.addEventListener('click', () => {
      if (isPlaying) {
        stopPlayerSimulation();
      } else {
        startPlayerSimulation();
      }
    });
  }

  // Interacción en la lista del syllabus
  const lessons = document.querySelectorAll('.lesson');
  lessons.forEach((lesson) => {
    lesson.addEventListener('click', () => {
      if (lesson.classList.contains('locked')) {
        // Al tocar lección bloqueada, abrir modal para desbloquear programa
        const buyModal = document.querySelector('#buyModal');
        if (buyModal) {
          const lessonTitle = lesson.dataset.lessonTitle || 'Lección Avanzada';
          const modalDesc = buyModal.querySelector('#modalDesc');
          if (modalDesc) {
            modalDesc.textContent = `Estás a un paso de desbloquear "${lessonTitle}" y todo el contenido avanzado de Forma Labs.`;
          }
          buyModal.classList.add('show');
        }
      } else {
        // Lección demo activa
        lessons.forEach((l) => l.classList.remove('lesson-active'));
        lesson.classList.add('lesson-active');
        startPlayerSimulation();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Envío de Formularios con Conexión al Backend y Fallback
  // --------------------------------------------------------------------------
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const notice = form.querySelector('.notice');

      const inputs = form.querySelectorAll('input, select, textarea');
      const formData = {};
      inputs.forEach((input) => {
        const field = input.name || (input.type === 'email' ? 'email' : 'name');
        formData[field] = input.value;
      });

      const modalId = form.closest('.modal') ? form.closest('.modal').id : '';
      let endpoint = '/api/leads/course';
      if (modalId === 'applyModal' || window.location.pathname.includes('resuelve')) {
        endpoint = '/api/leads/challenge';
      } else if (modalId === 'connectModal' || window.location.pathname.includes('conecta')) {
        endpoint = '/api/leads/connect';
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        console.info('Modo estático activo: formulario procesado localmente.');
      } finally {
        if (notice) notice.classList.add('show');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '¡Enviado!';
        }
      }
    });
  });
});


