const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  empresa: {
    type: String,
    trim: true
  },
  notas: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contacto', contactoSchema);
