# Backend de Forma Labs

API y servidor para la gestión de leads, cursos y retos de Forma Labs.

## Endpoints Disponibles
- GET /api/status: Comprueba el estado del servidor.
- GET /api/leads: Lista todos los registros capturados.
- POST /api/leads/course: Registra interés en un curso (Aprende).
- POST /api/leads/challenge: Registra inscripción a un reto (Resuelve).
- POST /api/leads/connect: Registra perfil o mentoría (Conecta).

## Ejecución
`ash
node backend/src/server.js
`
