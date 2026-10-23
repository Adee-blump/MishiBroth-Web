const mongoose = require('mongoose');

// Definimos la regla o "molde" para los usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true // MongoDB evitará que dos personas usen el mismo correo
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: 'usuario' // Por defecto, todos serán 'usuario'. Luego a ti te pondremos 'admin'.
  }
});

// Exportamos el modelo para poder usarlo en nuestro servidor
module.exports = mongoose.model('Usuario', usuarioSchema);