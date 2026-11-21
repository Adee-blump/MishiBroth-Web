import { useState, useEffect } from 'react';

function Home() {
  // Memoria y temporizador del carrusel de imágenes
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoria para las 5 tarjetas giratorias (false = frente, true = reverso)
  const [flippedCards, setFlippedCards] = useState([false, false, false, false, false]);

  // Función para voltear una tarjeta específica
  const toggleFlip = (index) => {
    setFlippedCards((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Función para voltear con el teclado (Accesibilidad)
  const handleFlipKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Animaciones al hacer scroll
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    }
  }, []);

  return (
    <main>
      {/* =========================================================
           HERO / SLIDER
      ========================================================== */}
      <section className="hero" aria-label="Presentación de MishiBroth">
        <div className="hero-slider">
          <div className="hero-slides">
            {/* Slide 1 */}
            <article className={`hero-slide ${currentSlide === 0 ? 'is-active' : ''}`} data-slide="0" aria-hidden={currentSlide !== 0}>
              <div className="hero-copy">
                <p className="hero-eyebrow">MishiBroth</p>
                <h1>MishiBroth</h1>
                <p>Una forma deliciosa de sumar hidratación a su día.</p>
                <a className="button" href="#conoce-mishibroth">Conoce MishiBroth</a>
              </div>
              <div className="hero-visual" aria-label="Visual de Mishi sonriendo">
                <img src="assets/mishi/gatofelizojosabiertos.png" alt="Mishi sonriendo" style={{ maxHeight: '280px', width: 'auto', objectFit: 'contain' }} />
                <div className="decorations-placeholder" aria-hidden="true">
                  <img src="assets/decoraciones/estrellasygota.png" alt="" style={{ width: '80px', height: 'auto' }} />
                </div>
              </div>
            </article>

            {/* Slide 2 */}
            <article className={`hero-slide ${currentSlide === 1 ? 'is-active' : ''}`} data-slide="1" aria-hidden={currentSlide !== 1}>
              <div className="hero-copy">
                <p className="hero-eyebrow">Hidratación y cuidado</p>
                <h2>Cuidar también es hidratar</h2>
                <p>Pequeños momentos de cuidado para grandes michis felices.</p>
                <a className="button" href="#por-que-mishibroth">Aprende sobre hidratación</a>
              </div>
              <div className="hero-visual" aria-label="Visual de Mishi relacionado con hidratación">
                <img src="assets/mishi/gatobebiendoagua.png" alt="Mishi hidratándose con MishiBroth" style={{ maxHeight: '280px', width: 'auto', objectFit: 'contain' }} />
                <div className="decorations-placeholder" aria-hidden="true">
                  <img src="assets/decoraciones/burbujas.png" alt="" style={{ width: '90px', height: 'auto' }} />
                </div>
              </div>
            </article>

            {/* Slide 3 */}
            <article className={`hero-slide ${currentSlide === 2 ? 'is-active' : ''}`} data-slide="2" aria-hidden={currentSlide !== 2}>
              <div className="hero-copy">
                <p className="hero-eyebrow">Presentaciones</p>
                <h2>Un MishiBroth para cada día</h2>
                <p>Elige la presentación que mejor acompañe la rutina de tu michi.</p>
                <a className="button" href="/tienda">Ver productos</a>
              </div>
              <div className="hero-visual" aria-label="Mishi junto a las tres presentaciones de MishiBroth">
                <div className="hero-product-list">
                  <div className="hero-product-placeholder">
                    <img src="assets/productos/SobreIndividual_VF.png" alt="Sobre individual de MishiBroth" />
                  </div>
                  <div className="hero-product-placeholder">
                    <img src="assets/productos/Pack_Semanal_Presentacion.png" alt="Pack Semanal de MishiBroth" />
                  </div>
                  <div className="hero-product-placeholder">
                    <img src="assets/productos/Pack_Familiar_Presentacion.webp" alt="Pack Familiar de MishiBroth" />
                  </div>
                </div>
                <div className="decorations-placeholder" aria-hidden="true">
                  <img src="assets/decoraciones/huellayestrellas.png" alt="" style={{ width: '80px', height: 'auto' }} />
                </div>
              </div>
            </article>
          </div>

          <button className="slider-arrow slider-arrow-prev" type="button" aria-label="Ver slide anterior" onClick={() => setCurrentSlide(currentSlide === 0 ? 2 : currentSlide - 1)}>
            &#10094;
          </button>
          <button className="slider-arrow slider-arrow-next" type="button" aria-label="Ver slide siguiente" onClick={() => setCurrentSlide(currentSlide === 2 ? 0 : currentSlide + 1)}>
            &#10095;
          </button>

          <div className="slider-dots" aria-label="Seleccionar slide">
            <button className={`slider-dot ${currentSlide === 0 ? 'is-active' : ''}`} type="button" aria-label="Ir al slide 1" aria-current={currentSlide === 0} onClick={() => setCurrentSlide(0)}></button>
            <button className={`slider-dot ${currentSlide === 1 ? 'is-active' : ''}`} type="button" aria-label="Ir al slide 2" aria-current={currentSlide === 1} onClick={() => setCurrentSlide(1)}></button>
            <button className={`slider-dot ${currentSlide === 2 ? 'is-active' : ''}`} type="button" aria-label="Ir al slide 3" aria-current={currentSlide === 2} onClick={() => setCurrentSlide(2)}></button>
          </div>
        </div>
      </section>

      {/* =========================================================
           CONOCE MISHIBROTH
      ========================================================== */}
      <section className="section section-about" id="conoce-mishibroth">
        <div className="section-container about-layout">
          <div className="section-copy" data-reveal>
            <p className="section-kicker">Nuestra propuesta</p>
            <h2>Conoce MishiBroth</h2>
            <p>
              MishiBroth es un caldo pensado para acompañar las croquetas de tu gato,
              aportando una forma diferente y sabrosa de incorporar más líquido a su
              alimentación diaria. La idea es convertir una comida cotidiana en un
              momento de hidratación, cuidado y disfrute para tu michi.
            </p>

            <ul className="concept-list">
              <li>🥣 Para acompañar sus croquetas</li>
              <li>💧 Pensado alrededor de la hidratación</li>
              <li>🐱 Hecho para convertir su rutina en un momento especial</li>
            </ul>
          </div>

          <div className="section-visual" data-reveal>
            <img src="assets/mishi/gatoconalimentos.png" alt="Mishi disfrutando MishiBroth con sus croquetas" style={{ maxHeight: '280px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* =========================================================
       ¿POR QUÉ MISHIBROTH? / BLOQUE INFORMATIVO
      ========================================================== */}
      <section className="section section-hydration" id="por-que-mishibroth">
        <div className="section-container hydration-layout" data-reveal>
          <div className="hydration-copy">
            <p className="section-kicker">¿Por qué MishiBroth?</p>
            <h2>Hidratación, rutina y cuidado en un mismo momento</h2>
            <p>
              MishiBroth propone acompañar la alimentación cotidiana de tu gato con una
              experiencia pensada alrededor de la hidratación y el cuidado diario.
            </p>
          </div>
          <div className="hydration-visual">
            <img src="assets/mishi/Gatocongota.png" alt="Mishi y la importancia de la hidratación" style={{ maxHeight: '260px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* =========================================================
           PILARES BROTH
      ========================================================== */}
      <section className="section section-pillars" id="pilares">
        <div className="section-container">
          <div className="section-heading" data-reveal>
            <p className="section-kicker">Nuestra esencia</p>
            <h2>Los pilares de MishiBroth</h2>
            <p>
              ¡Da clic en cada tarjeta y descubre el significado de la letra!
            </p>
          </div>

          <div className="broth-cards" aria-label="Pilares BROTH">
            {/* Tarjeta B */}
            <article className={`flip-card ${flippedCards[0] ? 'is-flipped' : ''}`} data-flip-card tabIndex="0" onClick={() => toggleFlip(0)} onKeyDown={(e) => handleFlipKeyDown(e, 0)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="pillar-letter">B</span>
                </div>
                <div className="flip-card-back">
                  <h3>Bienestar</h3>
                  <p>El cuidado diario como parte de una vida más cómoda y feliz.</p>
                </div>
              </div>
            </article>

            {/* Tarjeta R */}
            <article className={`flip-card ${flippedCards[1] ? 'is-flipped' : ''}`} data-flip-card tabIndex="0" onClick={() => toggleFlip(1)} onKeyDown={(e) => handleFlipKeyDown(e, 1)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="pillar-letter">R</span>
                </div>
                <div className="flip-card-back">
                  <h3>Rutina</h3>
                  <p>Pequeños hábitos que pueden integrarse de forma sencilla en el día a día.</p>
                </div>
              </div>
            </article>

            {/* Tarjeta O */}
            <article className={`flip-card ${flippedCards[2] ? 'is-flipped' : ''}`} data-flip-card tabIndex="0" onClick={() => toggleFlip(2)} onKeyDown={(e) => handleFlipKeyDown(e, 2)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="pillar-letter">O</span>
                </div>
                <div className="flip-card-back">
                  <h3>Orientación</h3>
                  <p>Información clara y cercana sobre hidratación y cuidado felino.</p>
                </div>
              </div>
            </article>

            {/* Tarjeta T */}
            <article className={`flip-card ${flippedCards[3] ? 'is-flipped' : ''}`} data-flip-card tabIndex="0" onClick={() => toggleFlip(3)} onKeyDown={(e) => handleFlipKeyDown(e, 3)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="pillar-letter">T</span>
                </div>
                <div className="flip-card-back">
                  <h3>Ternura</h3>
                  <p>Cuidar también es compartir momentos de cariño.</p>
                </div>
              </div>
            </article>

            {/* Tarjeta H */}
            <article className={`flip-card ${flippedCards[4] ? 'is-flipped' : ''}`} data-flip-card tabIndex="0" onClick={() => toggleFlip(4)} onKeyDown={(e) => handleFlipKeyDown(e, 4)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="pillar-letter">H</span>
                </div>
                <div className="flip-card-back">
                  <h3>Hidratación</h3>
                  <p>Uno de los pilares centrales de la propuesta de MishiBroth.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
       PRODUCTOS DESTACADOS
      ========================================================== */}
      <section className="section section-products" id="productos">
        <div className="section-container">
          <div className="section-heading" data-reveal>
            <p className="section-kicker">Tienda</p>
            <h2>Productos destacados</h2>
          </div>

          <div className="product-grid">
            <article className="product-card" data-reveal>
              <div className="product-image-placeholder">
                <img src="assets/productos/SobreIndividual_VF.png" alt="Sobre individual de MishiBroth" />
              </div>
              <h3>MishiBroth Individual</h3>
              <p>1 sobre · 80 ml</p>
              <a className="button" href="/tienda#individual">Ver producto</a>
            </article>

            <article className="product-card" data-reveal>
              <div className="product-image-placeholder">
                <img src="assets/productos/Pack_Semanal_Presentacion.png" alt="Pack Semanal de MishiBroth" />
              </div>
              <h3>Pack Semanal</h3>
              <p>7 sobres · 80 ml c/u</p>
              <a className="button" href="/tienda#semanal">Ver producto</a>
            </article>

            <article className="product-card" data-reveal>
              <div className="product-image-placeholder">
                <img src="assets/productos/Pack_Familiar_Presentacion.webp" alt="Pack Familiar de MishiBroth" />
              </div>
              <h3>Pack Familiar</h3>
              <p>7 sobres · 100 ml c/u</p>
              <a className="button" href="/tienda#familiar">Ver producto</a>
            </article>
          </div>

          <div className="products-cta" data-reveal>
            <a className="button" href="/tienda">Ir a la tienda</a>
            <img src="assets/mishi/gatofelizojoscerrados.png" alt="Mishi feliz" style={{ maxHeight: '180px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* =========================================================
           MISHICLUB
      ========================================================== */}
      <section className="section section-club" id="mishiclub">
        <div className="section-container club-layout">
          <div className="section-copy" data-reveal>
            <p className="section-kicker">Comunidad</p>
            <h2>Conoce MishiClub</h2>
            <p>
              MishiClub es el espacio de MishiBroth pensado para acercarte aún más al
              mundo de tu michi. Un lugar donde, poco a poco, podrás descubrir nuevas
              formas de participar, aprender, disfrutar y conectar con la comunidad
              MishiBroth.
            </p>
            <a className="button" href="/mishiclub">Descubrir MishiClub</a>
          </div>

          <div className="section-visual" data-reveal>
            <img src="assets/mishi/gatocelebrando.png" alt="Mishi entusiasta en MishiClub" style={{ maxHeight: '260px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* =========================================================
       CONTACTO / WHATSAPP
      ========================================================== */}
      <section className="section section-contact" id="contacto">
        <div className="section-container contact-card" data-reveal>
          <div>
            <p className="section-kicker">Contacto</p>
            <h2>¿Quieres saber más sobre MishiBroth?</h2>
            <p>
              Estamos aquí para ayudarte a conocer mejor nuestra propuesta
              y resolver tus dudas. Escríbenos por WhatsApp y cuéntanos
              en qué podemos orientarte.
            </p>
            <a
              className="button"
              href="https://wa.me/593983241544?text=Hola%2C%20estoy%20interesado%2Fa%20en%20MishiBroth."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar a MishiBroth por WhatsApp"
            >
              Contáctanos por WhatsApp
            </a>
          </div>
          <img src="assets/mishi/gatosaludandoo.png" alt="Mishi saludando en contacto" style={{ maxHeight: '160px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </section>
    </main>
  );
}

export default Home;