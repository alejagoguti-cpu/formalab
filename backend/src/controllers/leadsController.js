/**
 * Controlador para gestionar los leads e inscripciones de Forma Labs.
 */

// Simulación de almacenamiento en memoria / logs
const leadsDatabase = {
  courses: [],
  challenges: [],
  connect: []
};

exports.registerCourse = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios.' });
  }

  const lead = { id: Date.now(), name, email, date: new Date().toISOString() };
  leadsDatabase.courses.push(lead);

  console.log('[LEAD] Nuevo registro a Curso:', lead);
  return res.status(201).json({
    success: true,
    message: 'Registro recibido con éxito. Te avisaremos cuando abra el curso.',
    data: lead
  });
};

exports.registerChallenge = (req, res) => {
  const { name, email, challenge } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios.' });
  }

  const lead = { id: Date.now(), name, email, challenge: challenge || 'Reimagina el barrio', date: new Date().toISOString() };
  leadsDatabase.challenges.push(lead);

  console.log('[LEAD] Nueva inscripción a Reto:', lead);
  return res.status(201).json({
    success: true,
    message: 'Inscripción recibida con éxito. El brief llegará a tu correo.',
    data: lead
  });
};

exports.registerConnect = (req, res) => {
  const { name, email, portfolio } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Nombre y correo son obligatorios.' });
  }

  const lead = { id: Date.now(), name, email, portfolio: portfolio || null, date: new Date().toISOString() };
  leadsDatabase.connect.push(lead);

  console.log('[LEAD] Nueva postulación en Conecta:', lead);
  return res.status(201).json({
    success: true,
    message: 'Perfil recibido con éxito. Nos pondremos en contacto contigo.',
    data: lead
  });
};

exports.getAllLeads = (req, res) => {
  return res.json({ success: true, leads: leadsDatabase });
};
