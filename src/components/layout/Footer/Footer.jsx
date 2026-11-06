import { useEffect, useRef, useState } from "react";
import { LoriumLogo } from "../../../assets/logos/LoriumLogo.jsx";

const STACK_ITEMS = [
  { label: "GitHub", href: "https://docs.github.com/es" },
  { label: "Netlify", href: "https://docs.netlify.com/" },
  { label: "VS Code", href: "https://code.visualstudio.com/" },
  { label: "Git", href: "https://git-scm.com/" },
  { label: "HTML", href: "https://developer.mozilla.org/es/docs/Web/HTML" },
  { label: "CSS", href: "https://developer.mozilla.org/es/docs/Web/CSS" },
  {
    label: "JavaScript",
    href: "https://developer.mozilla.org/es/docs/Web/JavaScript",
  },
  { label: "JSON", href: "https://www.json.org/json-es.html" },
  { label: "React", href: "https://es.react.dev/" },
  { label: "Vite", href: "https://vite.dev/" },
  { label: "Node", href: "https://nodejs.org/es" },
];

const QUICK_COMMANDS = ["help", "stack", "contacto", "clear"];

function TerminalResponse({ kind }) {
  if (kind === "help") {
    return (
      <div className="footer__terminal-response">
        <p>Comandos disponibles:</p>
        <ul className="footer__terminal-help">
          <li><kbd>help</kbd><span>ver los comandos</span></li>
          <li><kbd>stack</kbd><span>explorar herramientas y tecnologías</span></li>
          <li><kbd>contacto</kbd><span>encontrar una forma de hablar</span></li>
          <li><kbd>clear</kbd><span>limpiar la terminal</span></li>
        </ul>
      </div>
    );
  }

  if (kind === "stack") {
    return (
      <div className="footer__terminal-response">
        <p>Herramientas y tecnologías detrás de Lorium:</p>
        <div className="footer__terminal-stack">
          {STACK_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "contacto") {
    return (
      <div className="footer__terminal-response">
        <p>Podés escribirme directamente:</p>
        <div className="footer__terminal-contact-links">
          <a href="mailto:lorium.digitale@gmail.com">
            lorium.digitale@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://wa.me/5493834368435"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <p className="footer__terminal-response footer__terminal-error">
      Comando no reconocido. Escribe <kbd>help</kbd> para ver las opciones.
    </p>
  );
}

export function Footer() {
  const [terminalEntries, setTerminalEntries] = useState(null);
  const [command, setCommand] = useState("");
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const terminalOutputRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (terminalEntries === null) return;
    terminalOutputRef.current?.scrollTo({
      top: terminalOutputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [terminalEntries]);

  useEffect(() => {
    if (!isGroupsOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsGroupsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isGroupsOpen]);

  const runCommand = (value) => {
    const enteredCommand = value.trim();
    if (!enteredCommand) return;

    const normalizedCommand = enteredCommand.toLowerCase();
    setCommand("");

    if (normalizedCommand === "clear") {
      setTerminalEntries([]);
      return;
    }

    const knownCommands = ["help", "stack", "contacto"];
    const kind = knownCommands.includes(normalizedCommand)
      ? normalizedCommand
      : "unknown";

    setTerminalEntries((entries) =>
      [...(entries ?? []), { command: enteredCommand, kind }].slice(-8),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(command);
  };

  return (
    <div className="footer__container">
      <footer className="footer container-wrapper">
        <div className="footer__eyebrow-row">
          <p>PARA MENTES CURIOSAS.</p>
          <p>NO HACE FALTA SABER PROGRAMAR.</p>
        </div>

        <div className="footer__main">
          <section className="footer__intro" aria-labelledby="footer-title">
            <LoriumLogo
              className="footer__brand-logo"
              title={null}
              color="var(--color-tertiary)"
            />
            <h2 id="footer-title" className="footer__headline">
              Siempre hay algo
              <br />
              debajo del diseño<span aria-hidden="true">_</span>
            </h2>
            <p className="footer__subtitle">
              Una pequeña puerta al universo Lorium.
            </p>

            <div className="footer__human-contact">
              <span>¿Buscás desarrollar tu próximo proyecto web?</span>
              <a className="footer__human-link" href="/#consulta">
                Hablemos <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>

          <section
            className="footer__terminal-column"
            aria-label="Terminal de Lorium"
          >
            <div className="footer__terminal">
              <div className="footer__terminal-header">
                <span className="footer__terminal-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="footer__terminal-title">
                  lorium / studio — terminal
                </span>
                <span className="footer__terminal-version">v.01</span>
              </div>

              <div
                className="footer__terminal-output"
                ref={terminalOutputRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {terminalEntries === null ? (
                  <div className="footer__terminal-welcome">
                    <p>Bienvenido a Lorium.</p>
                    <p>Escribe help o explora un comando.</p>
                  </div>
                ) : (
                  terminalEntries.map((entry, index) => (
                    <div
                      className="footer__terminal-entry"
                      key={index + "-" + entry.command}
                    >
                      <p className="footer__terminal-command">
                        <span>lorium ~ %</span> {entry.command}
                      </p>
                      <TerminalResponse kind={entry.kind} />
                    </div>
                  ))
                )}
              </div>

              <form className="footer__terminal-prompt" onSubmit={handleSubmit}>
                <label className="footer__sr-only" htmlFor="footer-terminal-command">
                  Escribe un comando
                </label>
                <span className="footer__terminal-prefix">lorium ~ %</span>
                <input
                  id="footer-terminal-command"
                  className="footer__terminal-input"
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  placeholder="help"
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  className="footer__terminal-submit"
                  type="submit"
                  aria-label="Ejecutar comando"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </form>
            </div>

            <div className="footer__terminal-shortcuts" aria-label="Comandos rápidos">
              {QUICK_COMMANDS.map((shortcut) => (
                <button
                  className="footer__terminal-chip"
                  key={shortcut}
                  type="button"
                  onClick={() => runCommand(shortcut)}
                >
                  {shortcut}
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Giovanni ·{" "}
            <button
              type="button"
              className="footer__groups-trigger"
              onClick={() => setIsGroupsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isGroupsOpen}
            >
              Lorium Groups
            </button>
          </p>
          <p className="footer__motto">
            Diseño • funcionalidad • rendimiento.
          </p>
          <button
            className="footer__back-top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Volver arriba <span aria-hidden="true">↑</span>
          </button>
        </div>
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
              madre, que sirve como marco de representación profesional para
              presentarte como parte de una marca, tanto en proyectos
              individuales como colaborativos. Tendrá su propia identidad y su
              propio sitio web, manteniendo su vínculo con Lorium.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
