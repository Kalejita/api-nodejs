const Redis = require('ioredis');

// Cliente para publicar eventos
const publisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

// Cliente para suscribirse a eventos (Redis requiere conexiones separadas para pub/sub)
const subscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000)
});

publisher.on('connect', () => {
  console.log('Redis Publisher conectado');
});

subscriber.on('connect', () => {
  console.log('Redis Subscriber conectado');
});

publisher.on('error', (err) => {
  console.error('Error en Redis Publisher:', err.message);
});

subscriber.on('error', (err) => {
  console.error('Error en Redis Subscriber:', err.message);
});

module.exports = { publisher, subscriber };
