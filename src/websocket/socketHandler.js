const { Server } = require('socket.io');
const { subscriber } = require('../config/redis');
const { CHANNEL } = require('../services/eventEmitter');

let io;

/**
 * Inicializa Socket.io y configura la suscripción a Redis
 * @param {http.Server} httpServer - Servidor HTTP de Node.js
 */
const inicializarSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.join('contactos');

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  // Suscribirse al canal de Redis
  subscriber.subscribe(CHANNEL, (err, count) => {
    if (err) {
      console.error('Error al suscribirse a Redis:', err.message);
      return;
    }
    console.log(`Suscrito a ${count} canal(es) de Redis`);
  });

  // Escuchar mensajes de Redis y reenviar a clientes WebSocket
  subscriber.on('message', (channel, message) => {
    if (channel === CHANNEL) {
      try {
        const evento = JSON.parse(message);
        console.log(`Evento recibido de Redis: ${evento.tipo}`);

        io.to('contactos').emit('contacto:evento', evento);
      } catch (error) {
        console.error('Error al procesar mensaje de Redis:', error.message);
      }
    }
  });

  console.log('Socket.io inicializado');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado');
  }
  return io;
};

module.exports = { inicializarSocket, getIO };
