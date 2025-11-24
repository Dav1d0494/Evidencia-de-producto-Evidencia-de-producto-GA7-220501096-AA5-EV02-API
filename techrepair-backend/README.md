# TechRepair Backend

## Descripción
Backend para el sistema TechRepair, una plataforma que facilita la conexión remota entre técnicos y usuarios para soporte técnico. Este proyecto forma parte de la evidencia GA7-220501096-AA2-EV01 del SENA.

## Tecnologías Utilizadas
- Node.js
- Express.js
- MongoDB (mediante Mongoose)
- Socket.IO para comunicación en tiempo real
- JSON Web Tokens (JWT) para autenticación
- Winston para logging

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone <url-del-repositorio>
cd techrepair-backend
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno:
   - Crear archivo \`.env\` en la raíz del proyecto
   - Copiar el contenido de \`.env.example\` y configurar las variables:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/techrepair
JWT_SECRET=tu_secreto_jwt
PORT=3000
\`\`\`

## Ejecución

1. Desarrollo:
\`\`\`bash
npm run dev
\`\`\`

2. Producción:
\`\`\`bash
npm start
\`\`\`

## Endpoints API

### Conexiones
- POST /api/connections - Crear nueva conexión
- GET /api/connections - Listar todas las conexiones
- GET /api/connections/:id - Obtener conexión por ID
- PUT /api/connections/:id - Actualizar conexión
- DELETE /api/connections/:id - Eliminar conexión
- POST /api/connections/generate - Generar código de acceso
- GET /api/connections/validate/:accessCode - Validar código de acceso
- POST /api/connections/connect/:accessCode - Conectar técnico

### Sesiones
- POST /api/sessions - Iniciar sesión
- GET /api/sessions/active - Obtener sesiones activas
- PUT /api/sessions/:id/end - Finalizar sesión

### Usuarios
- POST /api/auth/register - Registrar usuario
- POST /api/auth/login - Iniciar sesión
- GET /api/auth/profile - Obtener perfil

## Estándares de Codificación

### Nomenclatura
- Variables y funciones: camelCase
  - Ejemplo: \`getUserById\`, \`connectionStatus\`
- Clases: PascalCase
  - Ejemplo: \`Connection\`, \`User\`, \`Session\`
- Archivos: camelCase
  - Ejemplo: \`connectionController.js\`, \`authMiddleware.js\`
- Carpetas: minúsculas
  - Ejemplo: \`models/\`, \`controllers/\`, \`middleware/\`

### Estructura de Código
- Usar espacios en lugar de tabs (2 espacios)
- Punto y coma al final de las declaraciones
- Usar comillas simples para strings
- Documentar funciones con JSDoc cuando sea necesario
