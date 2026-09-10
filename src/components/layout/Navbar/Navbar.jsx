import { useState } from "react";
import { NavLink } from "react-router-dom";
import loriumLargeLogo from "../../../assets/logos/LoriumIcon-grdient-large-white-v1.svg";
import { NavSpanMotion } from "./motion/NavSpanMotion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`header container-wrapper ${isOpen ? "header--menu-open" : ""}`}
    >
      <nav className="nav">
        <div className="nav__brand">
          <NavLink to="/" className="nav__brand-link">
            <img
              src={loriumLargeLogo}
              className="nav__brand-logo"
              alt="Lorium"
            />
          </NavLink>
        </div>

        <NavSpanMotion />

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

        <ul
          id="nav-list"
          className={isOpen ? "nav__list nav__list--open" : "nav__list"}
        >
          <li className="nav__item">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Inicio
            </NavLink>
          </li>

          <li className="nav__item">
            <NavLink
              to="/about-me"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Sobre mí
            </NavLink>
          </li>

          <li className="nav__item">
            <NavLink
              to="/the-study"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              El estudio
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink
              to="/catalog"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              Proyectos
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
