const { publisher } = require('../config/redis');

// Canal de Redis para eventos de contactos
const CHANNEL = 'contactos:eventos';

/**
 * Publica un evento al canal de Redis
 * @param {string} tipo - Tipo de evento: 'CONTACTO_CREADO', 'CONTACTO_ACTUALIZADO', 'CONTACTO_ELIMINADO'
 * @param {object} datos - Datos del contacto
 */
const emitirEvento = async (tipo, datos) => {
  const evento = {
    tipo,
    datos,
    timestamp: new Date().toISOString()
  };

  try {
    await publisher.publish(CHANNEL, JSON.stringify(evento));
    console.log(`Evento publicado: ${tipo}`);
  } catch (error) {
    console.error('Error al publicar evento en Redis:', error.message);
  }
};

const contactoCreado = (contacto) => emitirEvento('CONTACTO_CREADO', contacto);
const contactoActualizado = (contacto) => emitirEvento('CONTACTO_ACTUALIZADO', contacto);
const contactoEliminado = (contactoId) => emitirEvento('CONTACTO_ELIMINADO', { _id: contactoId });

module.exports = {
  emitirEvento,
  contactoCreado,
  contactoActualizado,
  contactoEliminado,
  CHANNEL
};
