require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const path = require('path');
const cors = require('cors');
const conectarDB = require('./config/db');
const contactoRoutes = require('./routes/contactoRoutes');
const { inicializarSocket } = require('./websocket/socketHandler');

const app = express();
const httpServer = createServer(app);

// Conectar a la base de datos
conectarDB();

// Inicializar Socket.io con Redis
inicializarSocket(httpServer);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/contactos', contactoRoutes);

// Ruta de prueba API
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API de Gestión de Contactos funcionando' });
});

// Ruta para el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Frontend disponible en: http://localhost:${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api/contactos`);
});
