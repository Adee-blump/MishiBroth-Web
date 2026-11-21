import { useState, useEffect } from 'react';

// Base de datos inicial de productos de MishiBroth
const initialProductsData = {
  individual: {
    id: 'individual',
    name: "MishiBroth Individual",
    presentation: "1 sobre · 80 ml",
    price: 1.50,
    isStatic: true,
    images: {
      front: "assets/productos/SobreIndividual_VF.png",
      back: "assets/productos/SobreIndividual_VA.png"
    }
  },
  semanal: {
    id: 'semanal',
    name: "Pack Semanal",
    presentation: "7 sobres · 80 ml c/u",
    price: 8.99,
    isStatic: true,
    images: {
      front: "assets/productos/Pack_Semanal_VF.png",
      back: "assets/productos/Pack_Semanal_VA.png"
    }
  },
  familiar: {
    id: 'familiar',
    name: "Pack Familiar",
    presentation: "7 sobres · 100 ml c/u",
    price: 12.99,
    isStatic: true,
    images: {
      front: "assets/productos/Pack_Familiar_VF.png",
      back: "assets/productos/Pack_Familiar_VA.webp"
    }
  }
};

function Tienda() {
  // --- MEMORIA (ESTADOS) DE LA TIENDA ---
  const [productsData, setProductsData] = useState(initialProductsData);
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productView, setProductView] = useState('front');

  const esAdmin = localStorage.getItem('mishibroth_rol') === 'admin';

  // --- CARGAR PRODUCTOS NUEVOS DESDE MONGODB ---
  const cargarProductos = () => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.productos || []);
        const productosAdaptados = { ...initialProductsData };
        lista.forEach(prod => {
          productosAdaptados[prod._id] = {
            id: prod._id,
            name: prod.nombre,
            presentation: prod.descripcion,
            price: parseFloat(prod.precio),
            isStatic: false,
            images: {
              front: prod.imagen || "assets/productos/SobreIndividual_VF.png",
              back: prod.imagenReverso || prod.imagen || "assets/productos/SobreIndividual_VA.png"
            }
          };
        });
        setProductsData(productosAdaptados);
      })
      .catch(err => console.error("Error cargando productos desde MongoDB:", err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // --- ELIMINAR PRODUCTO DE MONGODB (SOLO ADMIN) ---
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Segura que deseas eliminar este producto de la tienda?")) return;
    try {
      const token = localStorage.getItem('mishibroth_token');
      const response = await fetch(`/api/productos/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert("Producto eliminado 🗑️");
        cargarProductos();
      } else {
        alert("No se pudo eliminar el producto.");
      }
    } catch (error) {
      alert("Error de conexión al eliminar.");
    }
  };

  // --- LÓGICA DEL CARRITO ---
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (productId) => {
    setCartItems(prev => {
      const currentItem = prev[productId] || { ...productsData[productId], quantity: 0 };
      return { ...prev, [productId]: { ...currentItem, quantity: currentItem.quantity + 1 } };
    });
    setIsCartOpen(true);
    setSelectedProduct(null);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      const item = prev[productId];
      if (!item) return prev;
      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      }
      return { ...prev, [productId]: { ...item, quantity: newQuantity } };
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  // Cálculos matemáticos del carrito
  const cartItemsArray = Object.values(cartItems);
  const cartCount = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItemsArray.reduce((total, item) => total + (item.price * item.quantity), 0);
  const formatPrice = (value) => `$${value.toFixed(2).replace(".", ",")}`;

  // --- LÓGICA DEL MODAL DE PRODUCTO ---
  const openProductModal = (productId) => {
    setSelectedProduct(productsData[productId]);
    setProductView('front');
  };

  const closeProductModal = () => setSelectedProduct(null);

  useEffect(() => {
    if (selectedProduct) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [selectedProduct]);

  // Animaciones de scroll originales
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
      revealElements.forEach(el => revealObserver.observe(el));
    }
  }, [productsData]);

  return (
    <>
      <main>
        {/* ENCABEZADO DE TIENDA */}
        <section className="section shop-hero">
          <div className="section-container">
            <div className="section-heading" data-reveal>
              <p className="section-kicker">Tienda</p>
              <h1>Tienda MishiBroth</h1>
              <p>
                Conoce las presentaciones disponibles de MishiBroth y explora
                esta experiencia comercial demostrativa.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCTOS DE TIENDA */}
        <section className="section section-products shop-products" aria-label="Productos disponibles">
          <div className="section-container">
            <div className="product-grid">

              {Object.values(productsData).map((producto) => (
                <article className="product-card" id={producto.id} data-reveal key={producto.id}>
                  <div className="product-image-placeholder">
                    <img src={producto.images.front} alt={`Imagen de ${producto.name}`} />
                  </div>
                  <h2>{producto.name}</h2>
                  <p>{producto.presentation}</p>
                  <p className="product-price">{formatPrice(producto.price)}</p>
                  <button className="button" type="button" onClick={() => openProductModal(producto.id)}>
                    Ver producto
                  </button>
                  <button className="button-secondary" type="button" onClick={() => addToCart(producto.id)}>
                    Agregar al carrito
                  </button>
                  {esAdmin && !producto.isStatic && (
                    <button 
                      type="button" 
                      onClick={() => handleDeleteProduct(producto.id)}
                      style={{ marginTop: '8px', backgroundColor: '#c0392b', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '999px', cursor: 'pointer', width: '100%', fontWeight: '600' }}
                    >
                      Eliminar producto
                    </button>
                  )}
                </article>
              ))}

            </div>
          </div>
        </section>

        {/* SCRATCH / DESCUENTO */}
        <section className="section shop-discount">
          <div className="section-container" data-reveal>
            <p className="section-kicker">Reto MishiBroth</p>
            <h2>¿Quieres conseguir un descuento?</h2>
            <p>Pon a prueba cuánto sabes sobre el cuidado de los michis y completa nuestro reto MishiBroth.</p>
            <a className="button" href="https://scratch.mit.edu/projects/1332551725" target="_blank" rel="noopener noreferrer">
              Jugar y obtener mi descuento
            </a>
          </div>
        </section>
      </main>

      {/* CARRITO DEMOSTRACIÓN */}
      <aside className="demo-cart" aria-label="Carrito de demostración">
        <button className="cart-trigger" type="button" aria-label="Abrir carrito" onClick={toggleCart}>
          Carrito (<span>{cartCount}</span>)
        </button>

        <div className="cart-panel" hidden={!isCartOpen}>
          <div className="cart-header">
            <h2>Carrito demo</h2>
            <button type="button" aria-label="Cerrar carrito" onClick={toggleCart}>×</button>
          </div>
          <p>Interfaz demostrativa. No procesa pagos reales.</p>
          
          <div className="cart-items">
            {cartItemsArray.length === 0 ? (
              <p data-empty-cart>Tu carrito está vacío.</p>
            ) : (
              cartItemsArray.map(item => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-top">
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-presentation">{item.presentation}</p>
                    </div>
                    <span className="cart-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="cart-quantity" aria-label={`Cantidad de ${item.name}`}>
                      <button type="button" aria-label="Disminuir" onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label="Aumentar" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <button className="cart-remove" type="button" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </article>
              ))
            )}
          </div>
          
          <p>Subtotal: <strong>{formatPrice(cartSubtotal)}</strong></p>
        </div>
      </aside>

      {/* MODAL DE PRODUCTO */}
      <div className="modal" hidden={!selectedProduct} data-product-modal>
        <div className="modal-backdrop" onClick={closeProductModal} data-close-product-modal></div>
        
        {selectedProduct && (
          <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <button className="modal-close" type="button" aria-label="Cerrar" onClick={closeProductModal} data-close-product-modal>×</button>
            
            <div className="product-modal-visual">
              <div className="product-modal-image" data-product-modal-image>
                <img src={selectedProduct.images[productView]} alt={selectedProduct.name} />
              </div>
              <div className="product-view-switch" role="group" aria-label="Cambiar vista del producto">
                <button type="button" className={productView === 'front' ? 'is-active' : ''} aria-pressed={productView === 'front'} onClick={() => setProductView('front')} data-product-view="front">Frente</button>
                <button type="button" className={productView === 'back' ? 'is-active' : ''} aria-pressed={productView === 'back'} onClick={() => setProductView('back')} data-product-view="back">Reverso</button>
              </div>
            </div>
            
            <h2 id="product-modal-title" data-product-modal-name>{selectedProduct.name}</h2>
            <p data-product-modal-presentation>{selectedProduct.presentation}</p>
            <p className="product-price" data-product-modal-price>{formatPrice(selectedProduct.price)}</p>
            <button className="button" type="button" data-product-modal-add onClick={() => addToCart(selectedProduct.id)}>
              Agregar al carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Tienda;