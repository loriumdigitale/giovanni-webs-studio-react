import loriumLargeLogo from "../../../assets/logos/LoriumIcon-grdient-white-v1.svg";

import { useState } from "react";

export function Footer() {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);

  return (
    <div className="footer__container">
      <footer className="footer container-wrapper">
        <div className="footer__brand">
          <img src={loriumLargeLogo} className="footer__brand-logo" alt="" />
          <p className="footer__brand-name text-gradient">Lorium</p>
        </div>
        <div className="footer__socials">
          <p className="footer__socials-title">Redes</p>
          <ul className="footer__socials-list">
            <li className="footer__social-item">
              <a
                href="https://wa.me/5493834368435"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                Whatsapp
              </a>
            </li>
            <li className="footer__social-item">
              <a
                href="mailto:lorium.digitale@gmail.com"
                className="footer__social-link"
              >
                Correo
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__tools">
          <p className="footer__tools-title">
            Herramientas y tecnologías utilizadas
          </p>
          <ul className="footer__tools-list">
            <li className="footer__tool-item">
              <a
                href="https://docs.github.com/es"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--software"
              >
                GitHub
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://docs.netlify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--software"
              >
                Netlify
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://code.visualstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--software"
              >
                VS Code
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://git-scm.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--software"
              >
                Git
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://developer.mozilla.org/es/docs/Web/HTML"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                HTML
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://developer.mozilla.org/es/docs/Web/CSS"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                CSS
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://developer.mozilla.org/es/docs/Web/JavaScript"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                JavaScript
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://www.json.org/json-es.html"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                JSON
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://es.react.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                React
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                Vite
              </a>
            </li>
            <li className="footer__tool-item">
              <a
                href="https://nodejs.org/es"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tool-link tool--technology"
              >
                Node
              </a>
            </li>
          </ul>
        </div>
        <p className="footer__tagline">
          Cada proyecto está diseñado con un objetivo claro: combinar diseño,
          funcionalidad y rendimiento en una sola experiencia.
        </p>
        <button
          type="button"
          className="footer__groups-trigger"
          onClick={() => setIsGroupsOpen(true)}
          aria-haspopup="dialog"
        >
          Lorium Groups
        </button>
        <p className="footer__copyright">
          © 2026 Giovanni - Todos los derechos reservados
        </p>
      </footer>
      {isGroupsOpen && (
        <div
          className="footer__groups-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsGroupsOpen(false);
          }}
        >
          <section
            className="footer__groups-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-groups-title"
          >
            <button
              type="button"
              className="footer__groups-close"
              onClick={() => setIsGroupsOpen(false)}
              aria-label="Cerrar información de Lorium Groups"
            >
              ×
            </button>
            <p className="footer__groups-eyebrow">Una iniciativa de Lorium</p>
            <h2 id="footer-groups-title">Lorium Groups</h2>
            <p>
              Lorium Groups es una subdivisión vinculada a Lorium, la marca
              madre, creada para impulsar proyectos desarrollados en grupo.
              Cuenta con una identidad propia y tendrá su propio sitio web,
              manteniendo siempre su vínculo con Lorium.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
