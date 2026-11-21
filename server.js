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
      mensaje: `¡Hola de nuevo, ${usuario.nombre}!`,
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

// Ruta para VER todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cargar los productos." });
  }
});

// Ruta para AGREGAR un producto nuevo
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen } = req.body;

    const nuevoProducto = new Producto({
      nombre,
      precio,
      descripcion,
      imagen,
      imagenReverso: req.body.imagenReverso || imagen // Si no se envía imagenReverso, usar la misma que la frontal
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: "¡Producto agregado al catálogo!", producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar el producto." });
  }
});

// Ruta para eliminar un producto de MongoDB
app.delete('/api/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado de la base de datos 😿" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al intentar borrar el producto" });
  }
});

// =========================================================
// RUTA DEL CHATBOT CON IA (MISHIBOT)
// =========================================================
app.post('/api/chat', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje || !mensaje.trim()) {
    return res.status(400).json({ respuesta: "Por favor escribe una pregunta para MishiBot 🐾" });
  }

  const contextoMarca = `Eres MishiBot, el asistente virtual amable y experto en hidratación felina de la marca MishiBroth.
Información oficial de MishiBroth:
- Producto: Caldo complementario para gatos que acompaña sus croquetas para mejorar la hidratación diaria y el bienestar renal/urinario.
- Presentaciones: 
  1) MishiBroth Individual (1 sobre de 80 ml).
  2) Pack Semanal (7 sobres de 80 ml c/u).
  3) Pack Familiar (7 sobres de 100 ml c/u).
- Comunidad MishiClub: incluye MishiPuntos (recompensas), MishiEco (devolución de cajas para reciclaje a cambio de puntos) y MishiCare (guías de cuidado felino).
- Contacto: Instagram @mishi_broth y WhatsApp +593 98 324 1544.
Reglas: Responde siempre en español, de forma cálida, breve (máximo 3 o 4 líneas), clara y con algún emoji de gatito o agüita. Si preguntan algo médico grave, sugiere consultar a un veterinario.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Falta GEMINI_API_KEY en .env");

    const modelos = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
    let textoIA = null;

    for (const modelo of modelos) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${contextoMarca}\n\nPregunta del usuario: ${mensaje}` }]
            }
          ]
        })
      });

      const data = await response.json();
      textoIA = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textoIA) break; // Si respondió bien, salimos del ciclo
      console.warn(`Modelo ${modelo} no disponible, probando respaldo...`, data?.error?.status);
    }

    if (textoIA) {
      return res.json({ respuesta: textoIA.trim() });
    } else {
      throw new Error("Sin texto de IA");
    }
  } catch (error) {
    console.error("Error en /api/chat:", error.message);
    // Respaldo inteligente para que nunca falle en vivo
    return res.json({
      respuesta: "¡Miau! 🐾 Soy MishiBot. MishiBroth es un caldo pensado para acompañar las croquetas de tu gato y sumar hidratación diaria. Tenemos Individual (80 ml), Pack Semanal (7x80 ml) y Pack Familiar (7x100 ml). ¿En qué te ayudo?"
    });
  }
});

// Servir el frontend de React compilado
const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Encender el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de MishiBroth corriendo en http://localhost:${PORT}`);
});

