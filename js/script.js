/* =========================================================
   MISHIBROTH — ETAPA 4
   INTERACCIONES:
   1. Menú móvil
   2. Hero slider
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
      mainNavigation.querySelectorAll("a");

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
          "aria-selected",
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
   Abrir modal
   ------------------------------------------------------- */

const openAccountModal = () => {

  if (!accountModal) return;

  lastFocusedElement = document.activeElement;

  accountModal.hidden = false;

  document.body.classList.add("modal-open");


  /* Activar login por defecto */

  accountTabs.forEach((tab) => {

    const isLogin =
      tab.dataset.accountTab === "login";

    tab.classList.toggle(
      "is-active",
      isLogin
    );

  });


  accountPanels.forEach((panel) => {

    const isLogin =
      panel.dataset.accountPanel === "login";

    panel.hidden = !isLogin;

  });


  /* Enviar foco al primer campo */

  const firstInput =
    accountModal.querySelector("input");

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
   Escape
   ------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    accountModal &&
    !accountModal.hidden
  ) {
    closeAccountModal();
  }

});

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


/* -------------------------------------------------------
   Datos de productos
   ------------------------------------------------------- */

const products = {

  individual: {
    name: "MishiBroth Individual",
    presentation: "1 sobre · 80 ml",
    price: 1.50,
    priceText: "$1,50",
    imagePlaceholder: "[MISHIBROTH INDIVIDUAL]"
  },

  semanal: {
    name: "Pack Semanal",
    presentation: "7 sobres · 80 ml c/u",
    price: 8.99,
    priceText: "$8,99",
    imagePlaceholder: "[PACK SEMANAL]"
  },

  familiar: {
    name: "Pack Familiar",
    presentation: "7 sobres · 100 ml c/u",
    price: 12.99,
    priceText: "$12,99",
    imagePlaceholder: "[PACK FAMILIAR]"
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

  lastProductFocus = document.activeElement;


  /* Cargar contenido */

  productModalName.textContent =
    product.name;

  productModalPresentation.textContent =
    product.presentation;

  productModalPrice.textContent =
    product.priceText;

  productModalImage.textContent =
    product.imagePlaceholder;


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


/* -------------------------------------------------------
   Escape
   ------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    productModal &&
    !productModal.hidden
  ) {
    closeProductModal();
  }

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


  renderCart();

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

  if (
    event.key === "Escape" &&
    cartPanel &&
    !cartPanel.hidden
  ) {
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

});
