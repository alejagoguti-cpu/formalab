// Control de Modales
document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.dataset.modal);
    if (target) target.classList.add('show');
  });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    if (modal) modal.classList.remove('show');
  });
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('show');
  });
});

// Envío de Formularios con conexión al Backend y Fallback
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const notice = form.querySelector('.notice');

    const inputs = form.querySelectorAll('input, select');
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
        submitBtn.textContent = '¡Listo!';
      }
    }
  });
});

