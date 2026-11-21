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
    required: true // Aquí guardaremos de la imagen del frente, ej: '/assets/productos/sobre.png'
  },
  imagenReverso: { 
    type: String } // Aquí guardaremos de la imagen del reverso, ej: '/assets/productos/sobre.png'
});

module.exports = mongoose.model('Producto', productoSchema);