import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.jsx";
import { IntroVideo } from "./components/IntroVideo/IntroVideo.jsx";
import { Navbar } from "./components/layout/Navbar/Navbar.jsx";
import { Home } from "./pages/Home.jsx";
import { AboutMe } from "./pages/AboutMe/AboutMe.jsx";
import { Catalog } from "./pages/Catalog/Catalog.jsx";
import { TheStudy } from "./pages/TheStudy/TheStudy.jsx";
import { Footer } from "./components/layout/Footer/Footer.jsx";
import { AnimatedMotion } from "./components/ui/AnimatedMotion/AnimatedMotion.jsx";
import Crosshair from "./components/ui/Crosshair/Crosshair.jsx";
import { CrosshairAutoplay } from "./components/ui/Crosshair/CrosshairAutoplay.jsx";
import { CustomScrollbar } from "./components/ui/CustomScrollbar/CustomScrollbar.jsx";

export function App() {
  const location = useLocation();

  useEffect(() => {
    // Le decimos al navegador: "no restaures el scroll vos solo, yo me encargo"
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <div className="app-shell">
      <IntroVideo />
      {/* Crosshair global: cambia estas props para ajustar su aspecto y comportamiento.

          color: color CSS hexadecimal; thickness: grosor en px (0.5–8); opacity: opacidad (0–1).

          lineStyle: solid, dashed o dotted; gap: apertura alrededor del puntero en px; fade: desvanecimiento (0–1).

          smoothing: suavidad del movimiento (0–1; valor menor = respuesta más rápida);

          showCoordinates: mostrar/ocultar coordenadas.

          targetEffect: lock, glitch o none; targetSelector: selector CSS de los elementos que reaccionan.

          clickPulse: pulso al hacer clic;

          hideCursor: ocultar cursor nativo; blendMode: modo de mezcla.
      */}
      <Crosshair
        color="#753ce9"
        opacity={0.70}
        thickness={2}
        smoothing={0.18}
        showCoordinates={false}
        targetEffect="lock"
        clickPulse={true}
        hideCursor={true}
      />
      <CrosshairAutoplay />
      <CustomScrollbar />
      {/* Definición global del gradiente, reutilizable por cualquier ícono SVG */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <linearGradient
            id="lorium-gradient"
            gradientUnits="objectBoundingBox"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="50%" stopColor="var(--color-secondary)" />
            <stop offset="100%" stopColor="var(--color-tertiary)" />
          </linearGradient>
        </defs>
      </svg>
      <ScrollToTop />
      <Navbar />
      <main className="container-wrapper">
        <AnimatePresence mode="wait">
          <AnimatedMotion key={location.pathname}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/the-study" element={<TheStudy />} />
            </Routes>
          </AnimatedMotion>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
