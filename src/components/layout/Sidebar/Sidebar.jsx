import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LoriumLogo } from "../../../assets/logos/LoriumLogo.jsx";
import "./sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: "home" },
  { to: "/about-me", label: "Sobre mí", icon: "about" },
  { to: "/catalog", label: "Proyectos", icon: "projects" },
];

function SidebarIcon({ name }) {
  return (
    <svg
      className="studio-sidebar__icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "home" && (
        <>
          <path d="m3.5 10 8.5-7 8.5 7" />
          <path d="M5.5 9v11h13V9" />
          <path d="M9.5 20v-6h5v6" />
        </>
      )}
      {name === "about" && (
        <>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M4.5 20c.8-3.5 3.4-5.3 7.5-5.3s6.7 1.8 7.5 5.3" />
        </>
      )}
      {name === "study" && (
        <>
          <path d="M4 20V8.5L12 3l8 5.5V20H4Z" />
          <path d="M9 20v-7h6v7" />
          <path d="M8 9h.01M16 9h.01" />
        </>
      )}
      {name === "projects" && (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </>
      )}
    </svg>
  );
}

export function Sidebar() {
  // Mantener este estado local evita volver a renderizar toda la aplicación.
  const [isExpanded, onExpandedChange] = useState(false);

  useEffect(() => {
    if (!isExpanded) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onExpandedChange(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isExpanded, onExpandedChange]);

  const toggleSidebar = () => onExpandedChange(!isExpanded);
  const closeOnNavigation = () => onExpandedChange(false);

  return (
    <>
      {isExpanded && (
        <button
          type="button"
          className="studio-sidebar__scrim"
          aria-label="Cerrar menú"
          onClick={() => onExpandedChange(false)}
        />
      )}

      <aside
        className="studio-sidebar"
        data-expanded={isExpanded ? "true" : "false"}
        aria-label="Menú del estudio"
      >
        <button
          type="button"
          className="studio-sidebar__brand-control"
          aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
          aria-expanded={isExpanded}
          aria-controls="studio-sidebar-navigation"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <span className="studio-sidebar__brand-lockup">
              <LoriumLogo
                className="studio-sidebar__brand-logo"
                title={null}
                color="var(--color-surface-op2)"
              />
              <span className="studio-sidebar__brand-copy">
                <span className="studio-sidebar__brand-name">lorium</span>
                <span className="studio-sidebar__brand-tagline">
                  ESTUDIO CREATIVO
                </span>
              </span>
            </span>
          ) : (
            <span className="studio-sidebar__loop" aria-hidden="true">
              <LoriumLogo
                className="studio-sidebar__loop-logo"
                title={null}
                color="var(--color-surface-op2)"
              />
              <span className="studio-sidebar__loop-menu">
                <span />
                <span />
                <span />
              </span>
            </span>
          )}
        </button>

        <nav
          className="studio-sidebar__navigation"
          id="studio-sidebar-navigation"
          aria-label="Navegación principal"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                "studio-sidebar__link" +
                (isActive ? " studio-sidebar__link--active" : "")
              }
              aria-label={item.label}
              title={!isExpanded ? item.label : undefined}
              onClick={closeOnNavigation}
            >
              <span className="studio-sidebar__link-icon">
                <SidebarIcon name={item.icon} />
              </span>
              <span className="studio-sidebar__link-label">{item.label}</span>
              <span className="studio-sidebar__active-dot" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <section className="studio-sidebar__callout" aria-label="Contacto">
          <p className="studio-sidebar__callout-title">¿Una idea en mente?</p>
          <a
            className="studio-sidebar__callout-link"
            href="/#consulta"
            onClick={closeOnNavigation}
          >
            <span>Hagámosla realidad</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </aside>
    </>
  );
}

export default Sidebar;
