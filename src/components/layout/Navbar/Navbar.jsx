import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LoriumLogo } from "../../../assets/logos/LoriumLogo.jsx";
import JellyRadio from "../../ui/JellyRadio/JellyRadio.jsx";

const NAV_ITEMS = [
  { value: "/", label: "Inicio" },
  { value: "/about-me", label: "Sobre mí" },
  { value: "/the-study", label: "El estudio" },
  { value: "/catalog", label: "Proyectos" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`header container-wrapper ${isOpen ? "header--menu-open" : ""}`}
    >
      <nav className="nav">
        <div className="nav__brand">
          <NavLink to="/" className="nav__brand-link">
            <LoriumLogo className="nav__brand-logo" />
            <span className="nav__brand-name text-gradient">Lorium</span>
          </NavLink>
        </div>

        <button
          type="button"
          className="nav__toggle"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="nav-list"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="nav__toggle-bar"></span>
          <span className="nav__toggle-bar"></span>
          <span className="nav__toggle-bar"></span>
        </button>

        <JellyRadio
          id="nav-list"
          className={isOpen ? "nav__list nav__list--open" : "nav__list"}
          navigation
          ariaLabel="Navegación principal"
          items={NAV_ITEMS}
          value={location.pathname}
          onChange={(path) => {
            navigate(path);
            closeMenu();
          }}
          chipColor="transparent"
          activeColor="var(--color-secondary)"
          textColor="var(--color-text)"
          activeTextColor="var(--color-text)"
          size="md"
          radius={8}
          gap={8}
        />
      </nav>
    </header>
  );
}
