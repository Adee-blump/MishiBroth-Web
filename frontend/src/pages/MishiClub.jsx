import { useEffect } from 'react';

function MishiClub() {
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
      {/* =======================================================
      1. HERO MISHICLUB
      ======================================================== */}
      <section className="section club-page-hero">
        <div className="section-container club-page-hero-inner">
          <div className="club-page-heading" data-reveal>
            <p className="section-kicker">Comunidad MishiBroth</p>
            <h1>MishiClub</h1>
          </div>

          <div className="club-intro-bubble" data-reveal>
            <p>
              Un espacio creado para acompañarte más allá de MishiBroth,
              con nuevas formas de aprender, participar y cuidar a tu michi.
            </p>
          </div>

          <div className="club-hero-visual" data-reveal>
            <img src="assets/mishi/gatoycorazones.png" alt="Mishi alegre celebrando en MishiClub" style={{ maxHeight: '260px', width: 'auto', objectFit: 'contain' }} />
            <div className="club-decoration club-decoration-star" aria-hidden="true">
              <img src="assets/decoraciones/estrellas.png" alt="" style={{ width: '70px', height: 'auto' }} />
            </div>
            <div className="club-decoration club-decoration-heart" aria-hidden="true">
              <img src="assets/decoraciones/corazones.png" alt="" style={{ width: '70px', height: 'auto' }} />
            </div>
            <div className="club-decoration club-decoration-paw" aria-hidden="true">
              <img src="assets/decoraciones/huella.png" alt="" style={{ width: '70px', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
      2. PRÓXIMAMENTE
      ======================================================== */}
      <section className="section club-coming-soon">
        <div className="section-container club-coming-soon-card" data-reveal>
          <p className="section-kicker">MishiClub</p>
          <h2>Próximamente ✨</h2>
          <p>
            MishiClub está creciendo junto con MishiBroth.
            Por ahora puedes conocer algunas de las ideas que formarán
            parte de este espacio; sus funciones y recompensas se
            desarrollarán más adelante.
          </p>
        </div>
      </section>

      {/* =======================================================
      3. MISHIPUNTOS
      ======================================================== */}
      <section className="section club-feature club-feature-points">
        <div className="section-container club-feature-layout">
          <div className="club-feature-copy" data-reveal>
            <h2>MishiPuntos</h2>
            <p>
              Acumula puntos a través de diferentes actividades
              de MishiBroth y, en el futuro, podrás utilizarlos
              para acceder a recompensas y beneficios.
            </p>
          </div>
          <div className="club-feature-visual" data-reveal>
            <img src="assets/mishi/gatojugando.png" alt="Mishi jugando con MishiPuntos" style={{ maxHeight: '230px', width: 'auto', objectFit: 'contain' }} />
            <div className="club-mini-decoration" aria-hidden="true">
              <img src="assets/decoraciones/huellayestrellas.png" alt="" style={{ width: '80px', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
      4. MISHIECO
      ======================================================== */}
      <section className="section club-feature club-feature-eco">
        <div className="section-container club-feature-layout club-feature-layout-reverse">
          <div className="club-feature-visual" data-reveal>
            <img src="assets/iconos/mishiECO.png" alt="MishiEco reciclaje y sostenibilidad" style={{ maxHeight: '230px', width: 'auto', objectFit: 'contain' }} />
            <div className="club-mini-decoration" aria-hidden="true">
              <img src="assets/decoraciones/huellayreciclaje.png" alt="" style={{ width: '80px', height: 'auto' }} />
            </div>
          </div>
          <div className="club-feature-copy" data-reveal>
            <h2>MishiEco</h2>
            <p className="club-feature-highlight">Devuelve y recompensa.</p>
            <p>
              Una propuesta que busca reconocer acciones responsables,
              como devolver las cajas de MishiBroth para facilitar
              su reutilización o reciclaje y obtener puntos a cambio.
            </p>
          </div>
        </div>
      </section>

      {/* =======================================================
      5. MISHICARE
      ======================================================== */}
      <section className="section club-feature club-feature-care">
        <div className="section-container club-feature-layout">
          <div className="club-feature-copy" data-reveal>
            <h2>MishiCare</h2>
            <p>
              Un espacio pensado para compartir información sencilla
              sobre bienestar, hidratación y cuidado responsable
              de los felinos.
            </p>
          </div>
          <div className="club-feature-visual" data-reveal>
            <img src="assets/iconos/mishiCARE.png" alt="MishiCare bienestar felino" style={{ maxHeight: '230px', width: 'auto', objectFit: 'contain' }} />
            <div className="club-mini-decoration" aria-hidden="true">
              <img src="assets/decoraciones/huellacorazonygota.png" alt="" style={{ width: '80px', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
      6. CIERRE VISUAL / RESPIRO
      ======================================================== */}
      <div className="club-breathing-space" aria-hidden="true">
        <div className="section-container club-breathing-inner">
          <div className="club-breathing-mishi" data-reveal>
            <img src="assets/mishi/gatodurmiendo.png" alt="" style={{ maxHeight: '160px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="club-floating-decoration club-floating-1" aria-hidden="true">
            <img src="assets/decoraciones/estrellas.png" alt="" style={{ width: '90px' }} />
          </div>
          <div className="club-floating-decoration club-floating-2" aria-hidden="true">
            <img src="assets/decoraciones/corazones.png" alt="" style={{ width: '90px' }} />
          </div>
          <div className="club-floating-decoration club-floating-3" aria-hidden="true">
            <img src="assets/decoraciones/huella.png" alt="" style={{ width: '90px' }} />
          </div>
          <div className="club-floating-decoration club-floating-4" aria-hidden="true">
            <img src="assets/decoraciones/burbujas.png" alt="" style={{ width: '40px' }} />
          </div>
          <div className="club-floating-decoration club-floating-5" aria-hidden="true">
            <img src="assets/decoraciones/gota.png" alt="" style={{ width: '90px' }} />
          </div>
          <div className="club-floating-decoration club-floating-6" aria-hidden="true">
            <img src="assets/decoraciones/gatoycorazones.png" alt="" style={{ width: '90px' }} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default MishiClub;