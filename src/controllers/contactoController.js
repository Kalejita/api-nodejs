const Contacto = require('../models/Contacto');
const { contactoCreado, contactoActualizado, contactoEliminado } = require('../services/eventEmitter');

// Obtener todos los contactos
const obtenerContactos = async (req, res) => {
  try {
    const contactos = await Contacto.find().sort({ createdAt: -1 });
    res.json(contactos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener contactos', error: error.message });
  }
};

// Obtener un contacto por ID
const obtenerContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findById(req.params.id);
    if (!contacto) {
      return res.status(404).json({ mensaje: 'Contacto no encontrado' });
    }
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener contacto', error: error.message });
  }
};

// Crear un nuevo contacto
const crearContacto = async (req, res) => {
  try {
    const contacto = new Contacto(req.body);
    const contactoGuardado = await contacto.save();

    // Emitir evento a Redis
    await contactoCreado(contactoGuardado.toObject());

    res.status(201).json(contactoGuardado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    res.status(400).json({ mensaje: 'Error al crear contacto', error: error.message });
  }
};

// Actualizar un contacto
const actualizarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contacto) {
      return res.status(404).json({ mensaje: 'Contacto no encontrado' });
    }

    // Emitir evento a Redis
    await contactoActualizado(contacto.toObject());

    res.json(contacto);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    res.status(400).json({ mensaje: 'Error al actualizar contacto', error: error.message });
  }
};

// Eliminar un contacto
const eliminarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByIdAndDelete(req.params.id);
    if (!contacto) {
      return res.status(404).json({ mensaje: 'Contacto no encontrado' });
    }

    // Emitir evento a Redis
    await contactoEliminado(req.params.id);

    res.json({ mensaje: 'Contacto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar contacto', error: error.message });
  }
};

module.exports = {
  obtenerContactos,
  obtenerContacto,
  crearContacto,
  actualizarContacto,
  eliminarContacto
};
