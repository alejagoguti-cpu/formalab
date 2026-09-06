const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');

// Ruta de estado de la API
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    project: 'Forma Labs API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas de captura de leads
router.post('/leads/course', leadsController.registerCourse);
router.post('/leads/challenge', leadsController.registerChallenge);
router.post('/leads/connect', leadsController.registerConnect);
router.get('/leads', leadsController.getAllLeads);

module.exports = router;
