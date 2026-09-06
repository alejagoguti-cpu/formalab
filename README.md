# Forma Labs

Sitio web y plataforma interactiva para presentar **Forma Labs** y sus tres rutas: **Aprende**, **Resuelve** y **Conecta**.

---

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado siguiendo una estructura limpia, modular y desacoplada (Frontend + Backend):

```text
formalab/
├── backend/                 # Servidor API y lógica de backend
│   ├── src/
│   │   ├── controllers/     # Controladores de leads y peticiones
│   │   │   └── leadsController.js
│   │   ├── routes/          # Rutas de la API REST
│   │   │   └── api.js
│   │   └── server.js        # Servidor HTTP / API y estáticos
│   ├── .env.example         # Variables de entorno de ejemplo
│   └── README.md            # Documentación del backend
├── frontend/                # Aplicación cliente
│   ├── assets/              # Manifiesto y recursos estáticos
│   │   └── site.webmanifest
│   ├── css/                 # Hojas de estilo modulares
│   │   ├── styles.css       # Estilos base y layout principal
│   │   ├── motion.css       # Animaciones e interactividad visual
│   │   ├── experience.css   # Estilos de subpáginas y modales
│   │   └── pro.css          # Componentes y detalles de diseño
│   ├── js/                  # Scripts e interactividad JavaScript
│   │   ├── script.js        # Lógica de la landing (cursor, 3D, scroll)
│   │   └── experience.js    # Control de modales y formularios conectados a la API
│   └── pages/               # Páginas secundarias del portal
│       ├── aprende.html     # Ruta Aprende (demo y cursos)
│       ├── resuelve.html    # Ruta Resuelve (retos y concursos)
│       └── conecta.html     # Ruta Conecta (prácticas y mentorías)
├── index.html               # Punto de entrada principal (Landing page)
├── package.json             # Scripts de ejecución local y despliegue
└── README.md                # Documentación general del proyecto
```

---

## 🚀 Cómo Ejecutar en Local

1. Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
2. Inicia el servidor local de desarrollo:
   `ash
   npm start
   `
3. Abre en tu navegador http://localhost:3000 (o el puerto indicado en la terminal).

---

## 🌐 Publicarlo en GitHub Pages

1. En el repositorio de GitHub, entra a **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Elige la rama main, carpeta /(root) y haz clic en **Save**.
4. GitHub Pages publicará el sitio automáticamente.

---

> **Nota:** Los formularios son demostrativos para el prototipo. Para recibir envíos reales pueden conectarse a servicios como Formspree, Supabase, Firebase o una API REST.
