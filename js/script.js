/* =========================================================
   MISHIBROTH — INTERACCIONES GENERALES
   Menú · Slider · BROTH · Cuenta · Productos · Carrito
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1. MENÚ HAMBURGUESA
     ======================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNavigation = document.querySelector(".main-navigation");

  if (menuToggle && mainNavigation) {

    const closeMenu = () => {
      mainNavigation.classList.remove("is-open");
      menuToggle.classList.remove("is-active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Abrir menú de navegación"
      );
    };


    const openMenu = () => {
      mainNavigation.classList.add("is-open");
      menuToggle.classList.add("is-active");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute(
        "aria-label",
        "Cerrar menú de navegación"
      );
    };


    menuToggle.addEventListener("click", () => {
      const menuIsOpen =
        mainNavigation.classList.contains("is-open");

      if (menuIsOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    /* Cerrar al seleccionar un enlace */

    const navigationLinks =
      mainNavigation.querySelectorAll("a, button");

    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    /* Cerrar con Escape */

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mainNavigation.classList.contains("is-open")
      ) {
        closeMenu();
        menuToggle.focus();
      }
    });

    /* Cerrar si volvemos a escritorio */

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        closeMenu();
      }
    });
  }

  /* =======================================================
     2. HERO SLIDER
     ======================================================= */

  const slider = document.querySelector("[data-slider]");

  if (slider) {

    const slides = Array.from(
      slider.querySelectorAll("[data-slide]")
    );

    const dots = Array.from(
      slider.querySelectorAll("[data-slide-to]")
    );

    const previousButton =
      slider.querySelector("[data-slider-prev]");

    const nextButton =
      slider.querySelector("[data-slider-next]");


    /* -------------------------------------------------------
       Configuración
       ------------------------------------------------------- */

    let currentSlide = 0;

    const autoplayDelay = 5500;

    let autoplayInterval = null;


    /* -------------------------------------------------------
       Mostrar un slide
       ------------------------------------------------------- */

    const showSlide = (index) => {

      /*
        Si pasa del último slide,
        vuelve al primero.
      */

      if (index >= slides.length) {
        index = 0;
      }


      /*
        Si intenta ir antes del primero,
        va al último.
      */

      if (index < 0) {
        index = slides.length - 1;
      }

      currentSlide = index;


      /* Actualizar slides */

      slides.forEach((slide, slideIndex) => {

        const isActive =
          slideIndex === currentSlide;

        slide.classList.toggle(
          "is-active",
          isActive
        );

        slide.setAttribute(
          "aria-hidden",
          String(!isActive)
        );
      });


      /* Actualizar dots */

      dots.forEach((dot, dotIndex) => {

        const isActive =
          dotIndex === currentSlide;

        dot.classList.toggle(
          "is-active",
          isActive
        );

        dot.setAttribute(
          "aria-current",
          String(isActive)
        );
      });
    };


    /* -------------------------------------------------------
       Siguiente / anterior
       ------------------------------------------------------- */

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };


    const previousSlide = () => {
      showSlide(currentSlide - 1);
    };


    /* -------------------------------------------------------
       Autoplay
       ------------------------------------------------------- */

    const startAutoplay = () => {

      stopAutoplay();

      autoplayInterval = setInterval(
        nextSlide,
        autoplayDelay
      );
    };


    const stopAutoplay = () => {

      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };


    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };


    /* -------------------------------------------------------
       Flechas
       ------------------------------------------------------- */

    if (previousButton) {

      previousButton.addEventListener(
        "click",
        () => {
          previousSlide();
          restartAutoplay();
        }
      );
    }


    if (nextButton) {

      nextButton.addEventListener(
        "click",
        () => {
          nextSlide();
          restartAutoplay();
        }
      );
    }


    /* -------------------------------------------------------
       Dots
       ------------------------------------------------------- */

    dots.forEach((dot) => {

      dot.addEventListener("click", () => {

        const destination =
          Number(dot.dataset.slideTo);

        showSlide(destination);

        restartAutoplay();
      });
    });


    /* -------------------------------------------------------
       Teclado
       ------------------------------------------------------- */

    slider.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "ArrowLeft") {
          previousSlide();
          restartAutoplay();
        }

        if (event.key === "ArrowRight") {
          nextSlide();
          restartAutoplay();
        }
      }
    );


    /* -------------------------------------------------------
       Pausar cuando el cursor está encima
       ------------------------------------------------------- */

    slider.addEventListener(
      "mouseenter",
      stopAutoplay
    );


    slider.addEventListener(
      "mouseleave",
      startAutoplay
    );


    /* -------------------------------------------------------
       Pausar cuando la pestaña no está visible
       ------------------------------------------------------- */

    document.addEventListener(
      "visibilitychange",
      () => {

        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      }
    );


    /* =======================================================
       3. SWIPE EN MÓVIL
       ======================================================= */

    let touchStartX = 0;
    let touchEndX = 0;

    const minimumSwipeDistance = 50;


    slider.addEventListener(
      "touchstart",
      (event) => {

        touchStartX =
          event.changedTouches[0].screenX;

        stopAutoplay();

      },
      {
        passive: true
      }
    );


    slider.addEventListener(
      "touchend",
      (event) => {

        touchEndX =
          event.changedTouches[0].screenX;

        const swipeDistance =
          touchEndX - touchStartX;


        /*
          Swipe hacia la izquierda
          = siguiente slide
        */

        if (
          swipeDistance <
          -minimumSwipeDistance
        ) {
          nextSlide();
        }


        /*
          Swipe hacia la derecha
          = slide anterior
        */

        if (
          swipeDistance >
          minimumSwipeDistance
        ) {
          previousSlide();
        }


        startAutoplay();

      },
      {
        passive: true
      }
    );


    /* -------------------------------------------------------
       Estado inicial
       ------------------------------------------------------- */

    showSlide(0);

    startAutoplay();
  }

/* =======================================================
     4. FLIP CARDS — PILARES BROTH
     ======================================================= */
 
  const flipCards = document.querySelectorAll("[data-flip-card]");
 
  flipCards.forEach((card) => {
 
    const toggleCard = () => {
      card.classList.toggle("is-flipped");
    };
 
 
    /* Click / tap */
 
    card.addEventListener("click", () => {
      toggleCard();
    });
 
 
    /* Teclado */
 
    card.addEventListener("keydown", (event) => {
 
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        toggleCard();
      }
 
    });
 
  });
 
  /* =======================================================
     5. MODAL DE CUENTA
     ======================================================= */
 
  const accountModal =
    document.querySelector("[data-account-modal]");
 
  const openAccountButtons =
    document.querySelectorAll("[data-open-account-modal]");
 
  const closeAccountButtons =
    document.querySelectorAll("[data-close-account-modal]");
 
  const accountTabs =
    document.querySelectorAll("[data-account-tab]");
 
  const accountPanels =
    document.querySelectorAll("[data-account-panel]");
 
  let lastFocusedElement = null;
 
 /* -------------------------------------------------------
   Abrir modal o Cerrar sesión si ya estamos logueados
   ------------------------------------------------------- */
  const openAccountModal = () => {
  // 1. Revisamos si el usuario ya tiene su "pulsera VIP" guardada
  const token = localStorage.getItem('mishibroth_token');

  if (token) {
    // Si ya inició sesión, le damos la opción de salir
    if (confirm("Ya iniciaste sesión como Administradora. ¿Deseas cerrar sesión? 🐱")) {
      localStorage.removeItem('mishibroth_token');
      alert("Sesión cerrada correctamente.");
      location.reload(); // Recargamos la página para limpiar todo
    }
    return; // Detenemos la función para que NO se abra el modal
  }

  // 2. Si no hay token, abrimos el modal normalmente
  if (!accountModal) return;

  lastFocusedElement = document.activeElement;
  accountModal.hidden = false;
  document.body.classList.add("modal-open");

  /* Activar login por defecto */
  accountTabs.forEach((tab) => {
    const isLogin = tab.dataset.accountTab === "login";
    tab.classList.toggle("is-active", isLogin);
    tab.setAttribute("aria-pressed", String(isLogin));
  });

  accountPanels.forEach((panel) => {
    const isLogin = panel.dataset.accountPanel === "login";
    panel.hidden = !isLogin;
  });

  /* Enviar foco al primer campo */
  const firstInput = accountModal.querySelector("input");
  if (firstInput) {
    setTimeout(() => {
      firstInput.focus();
    }, 50);
  }
};
 
  /* -------------------------------------------------------
     Cerrar modal
     ------------------------------------------------------- */
 
  const closeAccountModal = () => {
 
    if (!accountModal) return;
 
    accountModal.hidden = true;
 
    document.body.classList.remove("modal-open");
 
 
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
 
  };
 
 
  /* -------------------------------------------------------
     Botones de apertura
     ------------------------------------------------------- */
 
  openAccountButtons.forEach((button) => {
 
    button.addEventListener(
      "click",
      openAccountModal
    );
 
  });
 
 
  /* -------------------------------------------------------
     Botones / backdrop para cerrar
     ------------------------------------------------------- */
 
  closeAccountButtons.forEach((button) => {
 
    button.addEventListener(
      "click",
      closeAccountModal
    );
 
  });
 
 
  /* -------------------------------------------------------
     Tabs login / registro
     ------------------------------------------------------- */
 
  accountTabs.forEach((tab) => {
 
    tab.addEventListener("click", () => {
 
      const selectedTab =
        tab.dataset.accountTab;
 
 
      /* Cambiar botón activo */
 
      accountTabs.forEach((item) => {
 
    const isActive =
      item.dataset.accountTab ===
      selectedTab;
 
    item.classList.toggle(
      "is-active",
      isActive
    );
 
    item.setAttribute(
      "aria-pressed",
      String(isActive)
    );
 
  });
 
 
      /* Cambiar panel */
 
      accountPanels.forEach((panel) => {
 
        const isActive =
          panel.dataset.accountPanel ===
          selectedTab;
 
        panel.hidden = !isActive;
 
      });
 
 
      /* Foco en primer campo */
 
      const activePanel =
        document.querySelector(
          `[data-account-panel="${selectedTab}"]`
        );
 
      const firstInput =
        activePanel?.querySelector("input");
 
      if (firstInput) {
        firstInput.focus();
      }
 
    });
 
  });

  /* -------------------------------------------------------
   Registro de Usuario (Conexión con el Backend)
   ------------------------------------------------------- */
const registerPanel = document.querySelector('[data-account-panel="register"]');

if (registerPanel) {
  const registerButton = registerPanel.querySelector('.button');
  const nameInput = registerPanel.querySelector('input[autocomplete="name"]');
  const emailInput = registerPanel.querySelector('input[type="email"]');
  const passwordInput = registerPanel.querySelector('input[type="password"]');

  registerButton.addEventListener('click', async () => {
    const nombre = nameInput.value.trim();
    const correo = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nombre || !correo || !password) {
      alert("Por favor, completa todos los campos para registrarte. 🐱");
      return;
    }

    try {
      // 1. Cambiamos el botón para que el usuario sepa que está cargando
      registerButton.textContent = "Registrando...";
      registerButton.disabled = true;

      // 2. Usamos fetch para enviar los datos por POST a nuestro backend en formato JSON
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, password })
      });

      const data = await response.json();

      // 3. Revisamos si el backend nos dijo que todo salió bien (código 201)
      if (response.ok) {
        alert("¡Éxito! " + data.mensaje);
        
        // Limpiamos el formulario y regresamos a la pestaña de Iniciar Sesión
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        document.querySelector('[data-account-tab="login"]').click();
      } else {
        alert("Error: " + data.mensaje);
      }

    } catch (error) {
      alert("Hubo un problema de conexión con el servidor.");
    } finally {
      // Restauramos el botón a la normalidad
      registerButton.textContent = "Registrarme";
      registerButton.disabled = false;
    }
  });
}

/* -------------------------------------------------------
   Inicio de Sesión (Conexión con el Backend)
   ------------------------------------------------------- */
const loginPanel = document.querySelector('[data-account-panel="login"]');

if (loginPanel) {
  const loginButton = loginPanel.querySelector('.button');
  const emailInput = loginPanel.querySelector('input[type="email"]');
  const passwordInput = loginPanel.querySelector('input[type="password"]');

  loginButton.addEventListener('click', async () => {
    const correo = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!correo || !password) {
      alert("Por favor, ingresa tu correo y contraseña. 🐱");
      return;
    }

    try {
      loginButton.textContent = "Ingresando...";
      loginButton.disabled = true;

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.mensaje} (Rol: ${data.rol})`);
        
        // Guardamos la "pulsera VIP" y el rol en la memoria del navegador
        localStorage.setItem('mishibroth_token', data.token);
        localStorage.setItem('mishibroth_rol', data.rol);
        
        // Verificamos si es administradora para mostrar el botón
        if (data.rol === 'admin') {
           const btnPanel = document.getElementById('btn-abrir-panel');
           if(btnPanel) btnPanel.hidden = false;
        }

        // Limpiamos los campos y cerramos el modal
        emailInput.value = "";
        passwordInput.value = "";
        closeAccountModal();
      } else {
        alert("Error: " + data.mensaje);
      }

    } catch (error) {
      alert("Hubo un problema de conexión con el servidor.");
    } finally {
      loginButton.textContent = "Ingresar";
      loginButton.disabled = false;
    }
  });
}

  /* =======================================================
     6. MODAL DE PRODUCTO
     ======================================================= */
 
  const productModal =
    document.querySelector("[data-product-modal]");
 
  const productButtons =
    document.querySelectorAll("[data-product]");
 
  const closeProductButtons =
    document.querySelectorAll("[data-close-product-modal]");
 
  const productModalName =
    document.querySelector("[data-product-modal-name]");
 
  const productModalPresentation =
    document.querySelector("[data-product-modal-presentation]");
 
  const productModalPrice =
    document.querySelector("[data-product-modal-price]");
 
  const productModalImage =
    document.querySelector("[data-product-modal-image]");
 
  const productModalAdd =
    document.querySelector("[data-product-modal-add]");
 
  const productViewButtons =
    document.querySelectorAll("[data-product-view]");
 
  let currentProductView = "front";
 
 
  /* -------------------------------------------------------
     Datos de productos
     ------------------------------------------------------- */
 
  const products = {
 
    individual: {
      name: "MishiBroth Individual",
      presentation: "1 sobre · 80 ml",
      price: 1.50,
      priceText: "$1,50",
 
      images: {
        front: "assets/productos/SobreIndividual_VF.png",
        back: "assets/productos/SobreIndividual_VA.png"
      }
    },
 
    semanal: {
      name: "Pack Semanal",
      presentation: "7 sobres · 80 ml c/u",
      price: 8.99,
      priceText: "$8,99",
 
      images: {
        front: "assets/productos/Pack_Semanal_VF.png",
        back: "assets/productos/Pack_Semanal_VA.png"
      }
    },
 
    familiar: {
      name: "Pack Familiar",
      presentation: "7 sobres · 100 ml c/u",
      price: 12.99,
      priceText: "$12,99",
 
      images: {
        front: "assets/productos/Pack_Familiar_VF.png",
        back: "assets/productos/Pack_Familiar_VA.webp"
      }
    }
 
  };
 
 
  let currentProductId = null;
  let lastProductFocus = null;
 
 
  /* -------------------------------------------------------
     Abrir modal
     ------------------------------------------------------- */
 
  const openProductModal = (productId) => {
 
    if (!productModal) return;
 
    const product = products[productId];
 
    if (!product) return;
 
    currentProductId = productId;
    currentProductView = "front";
 
    lastProductFocus = document.activeElement;
 
 
    /* Cargar contenido */
 
    productModalName.textContent =
      product.name;
 
    productModalPresentation.textContent =
      product.presentation;
 
    productModalPrice.textContent =
      product.priceText;
 
    const imgElement = productModalImage.querySelector("img");
    imgElement.src = product.images.front;
    imgElement.alt = `${product.name} — frente`;
 
    productViewButtons.forEach((button) => {
 
    const isFront =
      button.dataset.productView === "front";
 
    button.classList.toggle(
      "is-active",
      isFront
    );
 
    button.setAttribute(
      "aria-pressed",
      String(isFront)
    );
 
  });
 
    /* Guardar producto en botón */
 
    productModalAdd.dataset.addToCart =
      productId;
 
 
    /* Mostrar modal */
 
    productModal.hidden = false;
 
    document.body.classList.add("modal-open");
 
 
    /* Foco */
 
    setTimeout(() => {
      productModalAdd.focus();
    }, 50);
 
  };
 
 
  /* -------------------------------------------------------
     Cerrar modal
     ------------------------------------------------------- */
 
  const closeProductModal = () => {
 
    if (!productModal) return;
 
    productModal.hidden = true;
 
    document.body.classList.remove("modal-open");
 
    currentProductId = null;
 
 
    if (lastProductFocus) {
      lastProductFocus.focus();
    }
 
  };
 
 
  /* -------------------------------------------------------
     Botones "Ver producto"
     ------------------------------------------------------- */
 
  productButtons.forEach((button) => {
 
    button.addEventListener("click", () => {
 
      const productId =
        button.dataset.product;
 
      openProductModal(productId);
 
    });
 
  });
 
 
  /* -------------------------------------------------------
     Cerrar modal
     ------------------------------------------------------- */
 
  closeProductButtons.forEach((button) => {
 
    button.addEventListener(
      "click",
      closeProductModal
    );
 
  });
 
  /* =======================================================
     CAMBIAR FRENTE / REVERSO
     ======================================================= */
 
  productViewButtons.forEach((button) => {
 
    button.addEventListener("click", () => {
 
      if (!currentProductId) return;
 
      const selectedView =
        button.dataset.productView;
 
      if (
        selectedView !== "front" &&
        selectedView !== "back"
      ) {
        return;
      }
 
      if (selectedView === currentProductView) {
        return;
      }
 
      const product =
        products[currentProductId];
 
      if (!product) return;
 
      currentProductView = selectedView;
 
 
      /* Actualizar botón activo */
 
      productViewButtons.forEach((item) => {
 
    const isActive =
      item.dataset.productView ===
      selectedView;
 
    item.classList.toggle(
      "is-active",
      isActive
    );
 
    item.setAttribute(
      "aria-pressed",
      String(isActive)
    );
 
  });
 
 
      /* Cambio suave de imagen */
 
      productModalImage.classList.add(
        "is-changing"
      );
 
      setTimeout(() => {
 
        const imgElement = productModalImage.querySelector("img");
        imgElement.src = product.images[selectedView];
        imgElement.alt = `${product.name} — ${selectedView === "front" ? "frente" : "reverso"}`;
 
        productModalImage.classList.remove(
          "is-changing"
        );
 
      }, 180);
 
    });
 
  });
 
  /* =======================================================
     7. CARRITO DEMO
     ======================================================= */
 
  const cart = document.querySelector("[data-cart]");
 
  const cartToggle =
    document.querySelector("[data-cart-toggle]");
 
  const cartPanel =
    document.querySelector("[data-cart-panel]");
 
  const cartClose =
    document.querySelector("[data-cart-close]");
 
  const cartItemsContainer =
    document.querySelector("[data-cart-items]");
 
  const cartCount =
    document.querySelector("[data-cart-count]");
 
  const cartSubtotal =
    document.querySelector("[data-cart-subtotal]");
 
 
  /*
    El carrito se guarda solamente en memoria.
 
    No hay:
    - base de datos;
    - backend;
    - pagos;
    - almacenamiento real.
  */
 
  const cartItems = {};
 
 
  /* =======================================================
     FORMATO DE PRECIO
     ======================================================= */
 
  const formatPrice = (value) => {
 
    return `$${value.toFixed(2).replace(".", ",")}`;
 
  };
 
 
  /* =======================================================
     ABRIR / CERRAR
     ======================================================= */
 
  const openCart = () => {
 
    if (!cartPanel) return;
 
    cartPanel.hidden = false;
 
    if (cartToggle) {
      cartToggle.setAttribute(
        "aria-label",
        "Cerrar carrito"
      );
 
      cartToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }
 
  };
 
 
  const closeCart = () => {
 
    if (!cartPanel) return;
 
    cartPanel.hidden = true;
 
    if (cartToggle) {
      cartToggle.setAttribute(
        "aria-label",
        "Abrir carrito"
      );
 
      cartToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
 
  };
 
 
  const toggleCart = () => {
 
    if (!cartPanel) return;
 
    if (cartPanel.hidden) {
      openCart();
    } else {
      closeCart();
    }
 
  };
 
 
  if (cartToggle) {
 
    cartToggle.addEventListener(
      "click",
      toggleCart
    );
 
  }
 
 
  if (cartClose) {
 
    cartClose.addEventListener(
      "click",
      closeCart
    );
 
  }
 
 
  /* =======================================================
     AGREGAR PRODUCTO
     ======================================================= */
 
  const addProductToCart = (productId) => {
 
    const product = products[productId];
 
    if (!product) return;
 
 
    /*
      Si ya existe, aumentamos cantidad.
    */
 
    if (cartItems[productId]) {
 
      cartItems[productId].quantity += 1;
 
    } else {
 
      cartItems[productId] = {
        ...product,
        quantity: 1
      };
 
    }
 
 
    if (cart) {
    renderCart();
  }
 
    openCart();
 
  };
 
 
  /* =======================================================
     ELIMINAR PRODUCTO
     ======================================================= */
 
  const removeProductFromCart = (productId) => {
 
    if (!cartItems[productId]) return;
 
    delete cartItems[productId];
 
    renderCart();
 
  };
 
 
  /* =======================================================
     CAMBIAR CANTIDAD
     ======================================================= */
 
  const changeProductQuantity = (
    productId,
    change
  ) => {
 
    const item = cartItems[productId];
 
    if (!item) return;
 
    item.quantity += change;
 
 
    /*
      Si llega a cero, desaparece.
    */
 
    if (item.quantity <= 0) {
 
      delete cartItems[productId];
 
    }
 
    renderCart();
 
  };

  /* =======================================================
     CALCULAR TOTAL DE UNIDADES
     ======================================================= */
 
  const calculateCartCount = () => {
 
    return Object.values(cartItems)
      .reduce(
        (total, item) =>
          total + item.quantity,
        0
      );
 
  };
 
 
  /* =======================================================
     CALCULAR SUBTOTAL
     ======================================================= */
 
  const calculateSubtotal = () => {
 
    return Object.values(cartItems)
      .reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      );
 
  };
 
 
  /* =======================================================
     RENDERIZAR CARRITO
     ======================================================= */
 
  const renderCart = () => {
 
    if (
      !cartItemsContainer ||
      !cartCount ||
      !cartSubtotal
    ) {
      return;
    }
 
 
    const entries =
      Object.entries(cartItems);
 
 
    /* Limpiar contenido anterior */
 
    cartItemsContainer.innerHTML = "";
 
 
    /* -----------------------------------------
       Carrito vacío
       ----------------------------------------- */
 
    if (entries.length === 0) {
 
      const emptyMessage =
        document.createElement("p");
 
      emptyMessage.dataset.emptyCart = "";
 
      emptyMessage.textContent =
        "Tu carrito está vacío.";
 
      cartItemsContainer.appendChild(
        emptyMessage
      );
 
    }
 
 
    /* -----------------------------------------
       Productos
       ----------------------------------------- */
 
    entries.forEach(
      ([productId, item]) => {
 
        const cartItem =
          document.createElement("article");
 
        cartItem.className = "cart-item";
 
 
        cartItem.innerHTML = `
          <div class="cart-item-top">
 
            <div class="cart-item-info">
              <h3 class="cart-item-name">
                ${item.name}
              </h3>
 
              <p class="cart-item-presentation">
                ${item.presentation}
              </p>
            </div>
 
            <span class="cart-item-price">
              ${formatPrice(
                item.price * item.quantity
              )}
            </span>
 
          </div>
 
          <div class="cart-item-bottom">
 
            <div
              class="cart-quantity"
              aria-label="Cantidad de ${item.name}"
            >
 
              <button
                type="button"
                aria-label="Disminuir cantidad de ${item.name}"
                data-cart-decrease="${productId}"
              >
                −
              </button>
 
              <span>
                ${item.quantity}
              </span>
 
              <button
                type="button"
                aria-label="Aumentar cantidad de ${item.name}"
                data-cart-increase="${productId}"
              >
                +
              </button>
 
            </div>
 
            <button
              class="cart-remove"
              type="button"
              data-cart-remove="${productId}"
            >
              Eliminar
            </button>
 
          </div>
        `;
 
 
        cartItemsContainer.appendChild(
          cartItem
        );
 
      }
    );
 
 
    /* -----------------------------------------
       Contador
       ----------------------------------------- */
 
    cartCount.textContent =
      calculateCartCount();
 
 
    /* -----------------------------------------
       Subtotal
       ----------------------------------------- */
 
    cartSubtotal.textContent =
      formatPrice(
        calculateSubtotal()
      );
 
  };
 
 
  /* =======================================================
     DETECTAR "AGREGAR AL CARRITO"
     ======================================================= */
 
  /*
    Usamos delegación de eventos.
 
    Esto permite que funcione tanto:
    - en las tarjetas;
    - como en el botón del modal,
      cuyo data-add-to-cart cambia dinámicamente.
  */
 
  document.addEventListener("click", (event) => {
 
    const addButton =
      event.target.closest(
        "[data-add-to-cart]"
      );
 
    if (!addButton) return;
 
    const productId =
      addButton.dataset.addToCart;
 
    if (!productId) return;
 
    addProductToCart(productId);
 
 
    /*
      Si agregamos desde el modal
      de producto, lo cerramos.
    */
 
    if (
      productModal &&
      addButton.closest("[data-product-modal]")
    ) {
      closeProductModal();
    }
 
  });
 
 
  /* =======================================================
     CONTROLES INTERNOS DEL CARRITO
     ======================================================= */
 
  if (cartItemsContainer) {
 
    cartItemsContainer.addEventListener(
      "click",
      (event) => {
 
 
        /* Aumentar */
 
        const increaseButton =
          event.target.closest(
            "[data-cart-increase]"
          );
 
        if (increaseButton) {
 
          changeProductQuantity(
            increaseButton.dataset.cartIncrease,
            1
          );
 
          return;
        }
 
 
        /* Disminuir */
 
        const decreaseButton =
          event.target.closest(
            "[data-cart-decrease]"
          );
 
        if (decreaseButton) {
 
          changeProductQuantity(
            decreaseButton.dataset.cartDecrease,
            -1
          );
 
          return;
        }
 
 
        /* Eliminar */
 
        const removeButton =
          event.target.closest(
            "[data-cart-remove]"
          );
 
        if (removeButton) {
 
          removeProductFromCart(
            removeButton.dataset.cartRemove
          );
 
        }
 
      }
    );
 
  }
 
 
  /* =======================================================
     ESCAPE
     ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    if (accountModal && !accountModal.hidden) {
      closeAccountModal();
      return;
    }

    if (productModal && !productModal.hidden) {
      closeProductModal();
      return;
    }

    if (cartPanel && !cartPanel.hidden) {
      closeCart();
    }

  });
 
 
  /* =======================================================
     ESTADO INICIAL
     ======================================================= */
 
  renderCart();
 
  /* =======================================================
     8. ANIMACIONES AL HACER SCROLL
     ======================================================= */
 
  const revealElements =
    document.querySelectorAll("[data-reveal]");
 
 
  /*
    Comprobamos si el usuario prefiere
    reducir las animaciones.
  */
 
  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
 
 
  /* -------------------------------------------------------
     Sin animación
     ------------------------------------------------------- */
 
  if (prefersReducedMotion) {
 
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
 
  }
 
 
  /* -------------------------------------------------------
     Con animación
     ------------------------------------------------------- */
 
  else {
 
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
 
          entries.forEach((entry) => {
 
            if (!entry.isIntersecting) {
              return;
            }
 
            entry.target.classList.add(
              "is-visible"
            );
 
 
            /*
              Después de aparecer una vez,
              dejamos de observarlo.
            */
 
            observer.unobserve(
              entry.target
            );
 
          });
 
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        }
      );
 
 
    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
 
  }
 
// --- LÓGICA DEL PANEL DE ADMIN Y BASE DE DATOS ---
const rolGuardado = localStorage.getItem('mishibroth_rol');
const btnPanel = document.getElementById('btn-abrir-panel');

if (rolGuardado === 'admin' && btnPanel) {
  btnPanel.hidden = false;
}

const formNuevoProducto = document.getElementById('form-nuevo-producto');

if (formNuevoProducto) {
  formNuevoProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('prod-nombre').value.trim();
    const precio = document.getElementById('prod-precio').value.trim();
    const descripcion = document.getElementById('prod-descripcion').value.trim();
    const imagen = document.getElementById('prod-imagen').value.trim();
    const botonSubir = formNuevoProducto.querySelector('button');

    try {
      botonSubir.textContent = "Subiendo...";
      botonSubir.disabled = true;

      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, descripcion, imagen })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Éxito! " + data.mensaje + " 🐾");
        formNuevoProducto.reset();
        document.getElementById('admin-panel-modal').hidden = true;
      } else {
        alert("Error al subir: " + data.mensaje);
      }
    } catch (error) {
      alert("Error de conexión. Revisa que el servidor Node esté encendido.");
    } finally {
      botonSubir.textContent = "Subir Producto al Catálogo";
      botonSubir.disabled = false;
    }
  });
}

// --- LÓGICA PARA MOSTRAR Y BORRAR PRODUCTOS DE MONGODB ---
const cargarProductosBD = async () => {
  const gridsProductos = document.querySelectorAll('.product-grid');
  const esAdmin = localStorage.getItem('mishibroth_rol') === 'admin'; // Verificamos tu rol
  
  if (gridsProductos.length > 0) {
    try {
      const response = await fetch('/api/productos');
      const productosDB = await response.json();
      
      gridsProductos.forEach(grid => {
        productosDB.forEach(producto => {
          
          products[producto._id] = {
            name: producto.nombre,
            presentation: producto.descripcion,
            price: parseFloat(producto.precio),
            priceText: `$${parseFloat(producto.precio).toFixed(2).replace('.', ',')}`,
            images: { front: producto.imagen, back: producto.imagen }
          };

          const nuevaTarjeta = document.createElement('article');
          nuevaTarjeta.className = 'product-card';
          
          // Preparamos los botones normales
          let botonesHTML = `
            <button class="button btn-dinamico-ver" type="button" data-product="${producto._id}">Ver producto</button>
            <button class="button-secondary" type="button" data-add-to-cart="${producto._id}">Agregar al carrito</button>
          `;
          
          // Si eres admin, agregamos el botón rojo de borrar
          if (esAdmin) {
            botonesHTML += `<button class="button btn-dinamico-borrar" type="button" style="background-color: #d9534f; color: white; border: none; margin-top: 10px;">🗑️ Borrar</button>`;
          }

          nuevaTarjeta.innerHTML = `
            <div class="product-image-placeholder">
              <img src="${producto.imagen}" alt="${producto.nombre}" />
            </div>
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <p class="product-price">$${parseFloat(producto.precio).toFixed(2).replace('.', ',')}</p>
            ${botonesHTML}
          `;
          
          // Conexión del botón "Ver producto"
          const btnVer = nuevaTarjeta.querySelector('.btn-dinamico-ver');
          btnVer.addEventListener('click', () => {
            openProductModal(producto._id);
          });

          // Conexión del botón "Borrar" (Solo si es admin)
          if (esAdmin) {
            const btnBorrar = nuevaTarjeta.querySelector('.btn-dinamico-borrar');
            btnBorrar.addEventListener('click', async () => {
              const confirmar = confirm(`¿Estás segura de que quieres borrar "${producto.nombre}" para siempre? 😿`);
              
              if (confirmar) {
                try {
                  btnBorrar.textContent = "Borrando...";
                  const res = await fetch(`/api/productos/${producto._id}`, { method: 'DELETE' });
                  
                  if (res.ok) {
                    nuevaTarjeta.remove(); // Hace desaparecer la tarjeta visualmente al instante
                  } else {
                    alert("No se pudo borrar del servidor.");
                    btnBorrar.textContent = "🗑️ Borrar";
                  }
                } catch (error) {
                  alert("Error de conexión al intentar borrar.");
                }
              }
            });
          }
          
          grid.appendChild(nuevaTarjeta);
        });
      });
    } catch (error) {
      console.error("No se pudieron cargar los productos", error);
    }
  }
};

cargarProductosBD();

});
