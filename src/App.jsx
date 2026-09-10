import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useState } from "react";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.jsx";
import { WelcomeModal } from "./components/WelcomeModal/WelcomeModal.jsx";
import { Navbar } from "./components/layout/Navbar/Navbar.jsx";
import { Home } from "./pages/Home.jsx";
import { AboutMe } from "./pages/AboutMe/AboutMe.jsx";
import { Catalog } from "./pages/Catalog/Catalog.jsx";
import { TheStudy } from "./pages/TheStudy/TheStudy.jsx";
import { Footer } from "./components/layout/Footer/Footer.jsx";
import { AnimatedMotion } from "./components/ui/AnimatedMotion/AnimatedMotion.jsx";
import { ProceduralBlobs } from "./components/ui/ProceduralBlobs/ProceduralBlobs.jsx";
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
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="app-shell">
      <ProceduralBlobs />
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
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

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
