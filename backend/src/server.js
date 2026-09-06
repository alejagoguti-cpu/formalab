const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '../../');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Base de datos de leads en memoria
const leadsDb = {
  courses: [],
  challenges: [],
  connect: []
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- RUTAS DE API ---
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/status' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'online', project: 'Forma Labs API', timestamp: new Date().toISOString() }));
      return;
    }

    if (pathname === '/api/leads' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: leadsDb }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const record = { id: Date.now(), ...payload, createdAt: new Date().toISOString() };

          if (pathname === '/api/leads/course') {
            leadsDb.courses.push(record);
            console.log('[API] Nuevo lead - Curso:', record);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '¡Registro exitoso! Te avisaremos cuando abra el curso.', data: record }));
            return;
          }

          if (pathname === '/api/leads/challenge') {
            leadsDb.challenges.push(record);
            console.log('[API] Nuevo lead - Reto:', record);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '¡Inscripción recibida! El brief llegará a tu correo.', data: record }));
            return;
          }

          if (pathname === '/api/leads/connect') {
            leadsDb.connect.push(record);
            console.log('[API] Nuevo lead - Conecta:', record);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: '¡Perfil recibido! Nos pondremos en contacto.', data: record }));
            return;
          }

          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Endpoint no encontrado' }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'JSON inválido' }));
        }
      });
      return;
    }
  }

  // --- SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND ---
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

  // Prevenir Directory Traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor Forma Labs corriendo en http://localhost:${PORT}`);
});

