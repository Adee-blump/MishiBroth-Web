import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import MishiClub from './pages/MishiClub';

function App() {
  // --- MEMORIA DE NAVEGACIÓN ---
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estados para MishiBot (Chatbot IA)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! 🐱💧 Soy MishiBot. Pregúntame sobre hidratación felina, cómo servir MishiBroth o nuestras presentaciones.'
    }
  ]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    const texto = chatInput.trim();
    if (!texto || chatLoading) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: texto }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto })
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.respuesta || '¡Miau! No pude procesar eso ahora.' }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Ups, revisa que el servidor esté encendido 🐾' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- MEMORIA DE USUARIO Y MODALES ---
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState('login'); // 'login' o 'register'
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [userRole, setUserRole] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Al cargar la app, revisamos si ya hay una sesión guardada
  useEffect(() => {
    const token = localStorage.getItem('mishibroth_token');
    const rol = localStorage.getItem('mishibroth_rol');
    if (token) {
      setUserToken(token);
      setUserRole(rol);
    }
  }, []);

  // Función inteligente para abrir el modal de cuenta (igual a tu script original)
  const handleAccountClick = () => {
    if (userToken) {
      if (window.confirm("Ya iniciaste sesión. ¿Deseas cerrar sesión? 🐱")) {
        localStorage.removeItem('mishibroth_token');
        localStorage.removeItem('mishibroth_rol');
        setUserToken(null);
        setUserRole(null);
        alert("Sesión cerrada correctamente.");
        window.location.reload();
      }
    } else {
      setIsAccountModalOpen(true);
      setAccountTab('login');
      document.body.classList.add("modal-open");
    }
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  // --- MEMORIA DEL FORMULARIO DE LOGIN ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que la página parpadee al hacer clic
    if (!loginEmail || !loginPassword) {
      alert("Por favor, ingresa tu correo y contraseña. 🐱");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.mensaje} (Rol: ${data.rol})`);
        // Guardamos la sesión en el navegador
        localStorage.setItem('mishibroth_token', data.token);
        localStorage.setItem('mishibroth_rol', data.rol);
        window.location.reload(); // Recargamos para que aparezca tu Panel Admin
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      alert("Hubo un problema de conexión. ¿Está encendido server.js?");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MEMORIA Y FUNCIÓN DEL PANEL ADMIN ---
  const [prodNombre, setProdNombre] = useState('');
  const [prodPrecio, setProdPrecio] = useState('');
  const [prodDescripcion, setProdDescripcion] = useState('');
  const [prodImagen, setProdImagen] = useState('');

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('mishibroth_token');
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: prodNombre,
          precio: parseFloat(prodPrecio),
          descripcion: prodDescripcion,
          imagen: prodImagen || 'img/productos/individual_VF.png',
          imagenReverso: prodImagenReverso || prodImagen || 'assets/productos/SobreIndividual_VA.png'
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("¡Producto guardado en la base de datos! 🐾");
        setProdNombre('');
        setProdPrecio('');
        setProdDescripcion('');
        setProdImagen('');
        setProdImagenReverso('');
        window.location.reload();
      } else {
        alert("Error: " + (data.mensaje || "No se pudo guardar el producto"));
      }
    } catch (error) {
      alert("Error de conexión al guardar producto.");
    }
  };

  const [prodImagenReverso, setProdImagenReverso] = useState('');

  // --- MEMORIA Y FUNCIÓN DE REGISTRO ---
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      alert("Completa todos los campos para registrarte. 🐱");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: registerName, correo: registerEmail, password: registerPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión. 🐾");
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setAccountTab('login');
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      {/* =========================================================
           HEADER
      ========================================================== */}
      <header className="site-header" id="inicio">
        <div className="header-container">
          <Link className="brand" to="/" aria-label="Ir al inicio de MishiBroth">
            <img
              src="/assets/iconos/Logo_MishiBroth.png"
              alt="Logo MishiBroth"
              style={{ height: '90px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Abrir menú de navegación"
            aria-expanded={menuAbierto}
            aria-controls="main-navigation"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`main-navigation ${menuAbierto ? 'is-open' : ''}`} id="main-navigation" aria-label="Navegación principal">
            <ul>
              <li><Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
              <li><a href="/#por-que-mishibroth" onClick={() => setMenuAbierto(false)}>¿Por qué MishiBroth?</a></li>
              <li><Link to="/tienda" onClick={() => setMenuAbierto(false)}>Tienda</Link></li>
              <li><Link to="/mishiclub" onClick={() => setMenuAbierto(false)}>MishiClub</Link></li>
              <li><a href="/#contacto" onClick={() => setMenuAbierto(false)}>Contacto</a></li>
              <li><button className="account-button" type="button" onClick={handleAccountClick}>Cuenta</button></li>
              {/* Botón de Admin solo visible si el rol es 'admin' */}
              {userRole === 'admin' && (
                <li><button className="button" onClick={() => setIsAdminPanelOpen(true)}>Panel Admin 🐾</button></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* =========================================================
           ENRUTADOR
      ========================================================== */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/mishiclub" element={<MishiClub />} />
      </Routes>

      {/* =========================================================
           FOOTER
      ========================================================== */}
      <footer className="site-footer">
        <div className="footer-container section-container">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label="Ir al inicio de MishiBroth">
              <img
                src="/assets/iconos/Logo_MishiBroth_Footer.png"
                alt="Logo MishiBroth"
                style={{ height: '90px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p>Una propuesta pensada para sumar hidratación, cuidado y disfrute a la rutina de tu michi.</p>
          </div>

          <nav className="footer-links" aria-label="Enlaces del pie de página">
            <h2>Enlaces rápidos</h2>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><a href="/#por-que-mishibroth">¿Por qué MishiBroth?</a></li>
              <li><Link to="/tienda">Tienda</Link></li>
              <li><Link to="/mishiclub">MishiClub</Link></li>
              <li><a href="/#contacto">Contacto</a></li>
              <li><button type="button" onClick={handleAccountClick}>Cuenta</button></li>
            </ul>
          </nav>

          <div className="footer-social">
            <h2>Redes</h2>
            <a href="https://www.instagram.com/mishi_broth/" target="_blank" rel="noopener noreferrer"> Instagram (@mishi_broth) </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© MishiBroth - Adela Villarreal</p>
        </div>
      </footer>

      {/* =========================================================
           MODAL DE CUENTA (Ahora con memoria React)
      ========================================================== */}
      <div className="modal" hidden={!isAccountModalOpen} data-account-modal>
        <div className="modal-backdrop" onClick={closeAccountModal} data-close-account-modal></div>
        <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
          <button className="modal-close" type="button" aria-label="Cerrar" onClick={closeAccountModal} data-close-account-modal>×</button>
          <h2 id="account-modal-title">Cuenta</h2>
          <p>¡Se parte de nuestra comunidad!</p>

          <div className="account-tabs">
            <button
              type="button"
              className={accountTab === 'login' ? 'is-active' : ''}
              aria-pressed={accountTab === 'login'}
              onClick={() => setAccountTab('login')}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={accountTab === 'register' ? 'is-active' : ''}
              aria-pressed={accountTab === 'register'}
              onClick={() => setAccountTab('register')}
            >
              Registro
            </button>
          </div>

          {/* Panel de Login */}
          <div className="account-panel" hidden={accountTab !== 'login'} data-account-panel="login">
            <form onSubmit={handleLogin}>
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                name="login-email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                name="login-password"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button className="button" type="submit" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>

          {/* Panel de Registro */}
          <div className="account-panel" hidden={accountTab !== 'register'} data-account-panel="register">
            <form onSubmit={handleRegister}>
              <label htmlFor="register-name">Nombre</label>
              <input id="register-name" name="register-name" type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
              <label htmlFor="register-email">Correo electrónico</label>
              <input id="register-email" name="register-email" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
              <label htmlFor="register-password">Contraseña</label>
              <input id="register-password" name="register-password" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
              <button className="button" type="submit" disabled={isLoading}>Registrarme</button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= MODAL PANEL DE ADMINISTRACIÓN ================= */}
      <div className="modal" id="admin-panel-modal" hidden={!isAdminPanelOpen}>
        <div className="modal-content">
          <button className="close-btn" onClick={() => setIsAdminPanelOpen(false)}>✖</button>
          <h2>Panel de Control MishiBroth 🐾</h2>
          <p>Añade nuevos productos al catálogo sin tocar el código.</p>

          <form id="form-nuevo-producto" onSubmit={handleCrearProducto} style={{ marginTop: '20px' }}>
            <input
              type="text"
              id="prod-nombre"
              placeholder="Nombre del producto (ej. Pack Familiar)"
              value={prodNombre}
              onChange={(e) => setProdNombre(e.target.value)}
              required
            />
            <input
              type="number"
              id="prod-precio"
              placeholder="Precio en $"
              step="0.01"
              value={prodPrecio}
              onChange={(e) => setProdPrecio(e.target.value)}
              required
            />
            <input
              type="text"
              id="prod-descripcion"
              placeholder="Descripción de los beneficios"
              value={prodDescripcion}
              onChange={(e) => setProdDescripcion(e.target.value)}
              required
            />
            <input
              type="text"
              id="prod-imagen"
              placeholder="Ruta imagen frontal VF (ej. assets/productos/SobreIndividual_VF.png)"
              value={prodImagen}
              onChange={(e) => setProdImagen(e.target.value)}
            />
            <input
              type="text"
              id="prod-imagen-reverso"
              placeholder="Ruta imagen reverso VA (ej. assets/productos/SobreIndividual_VA.png)"
              value={prodImagenReverso}
              onChange={(e) => setProdImagenReverso(e.target.value)}
            />
            <button className="button" type="submit">Guardar Producto</button>
          </form>
        </div>
      </div>

        {/* =========================================================
           CHATBOT FLOTANTE MISHIBOT (IA)
      ========================================================== */}
        <div className="mishibot-widget">
          {chatOpen && (
            <div className="mishibot-window" role="dialog" aria-label="Chat con MishiBot">
              <div className="mishibot-header">
                <span>🐱 MishiBot · Asistente IA</span>
                <button type="button" onClick={() => setChatOpen(false)} aria-label="Cerrar chat">
                  ✕
                </button>
              </div>

              <div className="mishibot-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`mishibot-msg ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                {chatLoading && (
                  <div className="mishibot-msg bot">Escribiendo... 🐾</div>
                )}
              </div>

              <form className="mishibot-form" onSubmit={handleSendChat}>
                <input
                  type="text"
                  placeholder="Escribe tu duda sobre tu michi..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" disabled={chatLoading}>
                  Enviar
                </button>
              </form>
            </div>
          )}

          <button
            type="button"
            className="mishibot-toggle"
            onClick={() => setChatOpen(!chatOpen)}
          >
            {chatOpen ? 'Cerrar chat' : '💬 MishiBot IA'}
          </button>
        </div>
    </Router>
  );
}

export default App;