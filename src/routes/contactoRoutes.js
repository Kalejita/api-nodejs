const express = require('express');
const router = express.Router();
const {
  obtenerContactos,
  obtenerContacto,
  crearContacto,
  actualizarContacto,
  eliminarContacto
} = require('../controllers/contactoController');

router.get('/', obtenerContactos);
router.get('/:id', obtenerContacto);
router.post('/', crearContacto);
router.put('/:id', actualizarContacto);
router.delete('/:id', eliminarContacto);

module.exports = router;
