import { useState } from "react";

export function Footer() {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);

  return (
    <div className="footer__container">
      <footer className="footer container-wrapper">
        <div className="footer__brand">
          <p className="footer__brand-name">Giovanni Webs Studio</p>
          <svg
            className="footer__brand-logo"
            version="1.1"
            viewBox="0 0 159 159"
            role="img"
            aria-label="Logo Giovanni Webs Studio"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              style={{ fill: "#fcbf49", fillOpacity: 1 }}
              d="M 85.899854,7.350127 C 74.731953,6.6561217 64.327698,8.3133701 55.143905,11.800311 41.302225,17.055778 30.232957,26.46759 23.500117,38.250059 c -14.3999994,25.1 -12.100361,47.499746 -1.880361,67.699731 3.63,7.17 9.550146,17.60011 14.800146,26.40011 2.64,4.41 5.109952,8.38018 7.079952,11.40018 0.987,1.49 1.830332,2.71969 2.630332,3.75969 0.401,0.521 0.760658,0.98298 1.329658,1.55998 0.284,0.29 0.597951,0.61518 1.249951,1.08018 0.652,0.465 1.520254,1.52007 4.630254,1.43007 2.52,-0.0721 3.209726,-0.78406 3.819726,-1.15006 0.606,-0.365 0.952971,-0.64708 1.279971,-0.91508 0.644,-0.536 1.130391,-1.01981 1.660391,-1.56981 1.07,-1.1 2.259941,-2.45022 3.619941,-4.04022 2.71,-3.18 6.019824,-7.27965 9.269824,-11.39965 3.41,-4.3 3.870293,-5.27011 6.280293,-8.38011 2.2,3.08 3.349688,3.95995 6.409688,8.13995 3,4.09 6.050205,8.16977 8.530205,11.29977 1.24,1.58 2.329912,2.91019 3.309912,4.01019 0.492,0.55 0.932146,1.03 1.550146,1.59 0.31,0.278 0.643807,0.58016 1.289804,0.99116 0.646,0.411 1.46005,1.50985 4.58005,1.34985 2.67,-0.144 3.35999,-1.11013 3.95999,-1.52013 0.6,-0.41 0.90491,-0.71665 1.18991,-0.99065 0.56,-0.547 0.93201,-0.99545 1.34001,-1.50045 0.816,-1 1.68019,-2.16957 2.67019,-3.57957 1.99,-2.82 4.44974,-6.52011 7.02974,-10.50011 5.14,-7.99 10.6001,-16.99996 13.4001,-22.19996 5.21,-9.34 9.06009,-17.500257 9.94009,-25.300257 0.437,-3.91 2.00001,-11.399931 -0.98599,-14.999931 -2.5,-2.98 -8.75029,-2.609776 -13.70029,-2.569776 -12.5,0.1 -55.199707,-0.07815 -55.199707,-0.07815 l 8.040059,14.900039 c 0,0 35.199738,-0.14 46.499738,0 0.891,0.011 0.83637,-0.133834 0.73237,1.050166 -0.397,3.56 -3.36999,11.199947 -8.19999,19.799949 l -0.029,0.0538 -0.0326,0.0543 c -2.32,4.33 -7.88012,13.49989 -12.90012,21.29989 -1.75,2.71 -3.17992,4.82006 -4.64992,6.98006 -2.05,-2.66 -4.280029,-5.60007 -6.670029,-8.85007 -5.89,-8.04 -12.000049,-16.49987 -12.000049,-16.49987 0,0 -2.779922,-3.47036 -6.239922,-3.47036 -3.47,0 -6.239922,3.47036 -6.239922,3.47036 0,0 -5.110068,8.21957 -11.500068,16.29957 -2.72,3.43 -5.309952,6.59022 -7.609952,9.34022 -1.52,-2.38 -3.049931,-4.77998 -4.929931,-7.91998 -5.14,-8.57 -11.000166,-19.00004 -14.300166,-25.500039 -8.86,-17.5 -10.799873,-32.200175 1.520127,-53.800175 8.32,-14.5 25.699853,-25.00001 48.799853,-23.60001 8.72,0.541 18.700019,4.540371 26.000019,9.580371 7.28,5.04 10.79979,11.599834 10.79979,12.199834 l 18.40042,-0.194092 c -4.37168,-8.442598 -8.11297,-13.656823 -11.55363,-17.086707 -3.53875,-3.52767 -3.5564,-3.621 -8.72189,-7.538193 C 106.74007,8.0970302 85.899844,7.350061 85.899844,7.350061 Z"
            />
          </svg>
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
                href="mailto:giovanniwebsstudio@gmail.com"
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
        <p className="footer__copyright">
          © 2026 Giovanni - Todos los derechos reservados
        </p>
        <button
          type="button"
          className="footer__groups-trigger"
          onClick={() => setIsGroupsOpen(true)}
          aria-haspopup="dialog"
        >
          Lorium Groups
        </button>
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
