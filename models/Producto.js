const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    required: true // Aquí guardaremos la ruta de tu imagen, ej: '/assets/productos/sobre.png'
  }
});

module.exports = mongoose.model('Producto', productoSchema);