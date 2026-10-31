require('dotenv').config(); // Esto lee tus secretos del archivo .env
const express = require('express');
const mongoose = require('mongoose'); // El traductor para MongoDB
const path = require('path');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
// Usa el puerto del .env, o el 3000 si no lo encuentra
const PORT = process.env.PORT || 3000; 

// 1. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Base de datos MongoDB conectada con éxito'))
  .catch((error) => console.error('❌ Error al conectar con MongoDB:', error));

// 2. Dar permiso público solo a las carpetas estáticas
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 3. Rutas de páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tienda.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'tienda.html'));
});

app.get('/mishiclub.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mishiclub.html'));
});

// Ruta para registrar usuarios nuevos
app.post('/api/registro', async (req, res) => {
  try {
    // 1. Extraemos los datos que enviará el modal del frontend
    const { nombre, correo, password } = req.body;

    // 2. Verificamos si el correo ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Ese correo ya está registrado." });
    }

    // 3. Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 4. Creamos el nuevo usuario con la contraseña segura
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: passwordEncriptada
    });

    // 5. Lo guardamos en MongoDB Atlas
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "¡Usuario registrado con éxito en MishiBroth!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor." });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Buscamos si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos." });
    }

    // 2. Comparamos la contraseña escrita con la encriptada en MongoDB
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos." });
    }

    // 3. Creamos el token (la pulsera VIP) usando el secreto de tu .env
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // El token caducará por seguridad en 2 horas
    );

    res.json({
      mensaje: `¡Bienvenida de nuevo, ${usuario.nombre}!`,
      token: token,
      rol: usuario.rol
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Hubo un error en el servidor." });
  }
});

/* ==========================================
   RUTAS DE PRODUCTOS (CATÁLOGO)
   ========================================== */

// 1. Ruta para VER todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cargar los productos." });
  }
});

// 2. Ruta para AGREGAR un producto nuevo
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen } = req.body;
    
    const nuevoProducto = new Producto({
      nombre,
      precio,
      descripcion,
      imagen
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: "¡Producto agregado al catálogo!", producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar el producto." });
  }
});

// 4. Encender el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de MishiBroth corriendo en http://localhost:${PORT}`);
});

