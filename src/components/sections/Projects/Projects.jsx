import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getFavoriteProjects } from "../../../data/projects/index.js";
import { ProjectCard } from "../../ui/ProjectCard/ProjectCard.jsx";

export function Projects() {
  const favoriteProjects = getFavoriteProjects();
  const hasOneProject = favoriteProjects.length === 1;
  const carouselItems = hasOneProject
    ? Array.from({ length: 7 }, (_, index) => ({
        project: favoriteProjects[0],
        key: `${favoriteProjects[0].id}-copy-${index}`,
      }))
    : [
        {
          project: favoriteProjects.at(-2) ?? favoriteProjects.at(-1),
          key: `clone-before-second-${favoriteProjects.at(-2)?.id ?? favoriteProjects.at(-1)?.id}`,
        },
        { project: favoriteProjects.at(-1), key: `clone-before-last-${favoriteProjects.at(-1)?.id}` },
        ...favoriteProjects.map((project) => ({ project, key: project.id })),
        { project: favoriteProjects[0], key: `clone-after-first-${favoriteProjects[0]?.id}` },
        {
          project: favoriteProjects[1] ?? favoriteProjects[0],
          key: `clone-after-second-${favoriteProjects[1]?.id ?? favoriteProjects[0]?.id}`,
        },
      ];
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState(() =>
    hasOneProject ? 3 : 2,
  );
  const [trackOffset, setTrackOffset] = useState(0);
  const [animateTrack, setAnimateTrack] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const viewport = viewportRef.current;
      const activeSlide = slideRefs.current[activeTrackIndex];
      if (!viewport || !activeSlide) return;

      setTrackOffset(
        viewport.clientWidth / 2 - activeSlide.offsetLeft - activeSlide.offsetWidth / 2,
      );
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeTrackIndex, carouselItems.length]);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || favoriteProjects.length === 0) return;

    const intervalId = window.setInterval(() => {
      setActiveTrackIndex((index) => Math.min(index + 1, carouselItems.length - 2));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [carouselItems.length, favoriteProjects.length, isPaused, prefersReducedMotion]);

  useEffect(() => {
    if (animateTrack) return;
    const frameId = window.requestAnimationFrame(() => setAnimateTrack(true));
    return () => window.cancelAnimationFrame(frameId);
  }, [animateTrack]);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    if (hasOneProject && activeTrackIndex === 1) {
      setActiveTrackIndex(4);
    } else if (hasOneProject && activeTrackIndex === carouselItems.length - 2) {
      setActiveTrackIndex(2);
    } else if (!hasOneProject && activeTrackIndex === 1) {
      setActiveTrackIndex(favoriteProjects.length + 1);
    } else if (!hasOneProject && activeTrackIndex === carouselItems.length - 2) {
      setActiveTrackIndex(2);
    }
  }, [
    activeTrackIndex,
    carouselItems.length,
    favoriteProjects.length,
    hasOneProject,
    prefersReducedMotion,
  ]);

  if (favoriteProjects.length === 0) return null;

  const goTo = (index) => setActiveTrackIndex(index);
  const activeProjectIndex = hasOneProject
    ? 0
    : (activeTrackIndex - 2 + favoriteProjects.length) % favoriteProjects.length;

  const handleTransitionEnd = (event) => {
    if (event.target !== trackRef.current) return;

    const isAtClone =
      activeTrackIndex === 1 || activeTrackIndex === carouselItems.length - 2;

    if (!isAtClone) return;

    setAnimateTrack(false);
    setActiveTrackIndex(
      hasOneProject
        ? activeTrackIndex === 1
          ? 4
          : 2
        : activeTrackIndex === 1
          ? favoriteProjects.length + 1
          : 2,
    );
  };

  return (
    <section
      className="projects reveal-on-scroll"
      aria-roledescription="carrusel"
      aria-labelledby="projects-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <h2 className="projects__title" id="projects-title">
        Proyectos destacados
      </h2>

      <p className="projects__text">
        Una selección de proyectos que reflejan mi forma de resolver problemas,
        cuidar los detalles y desarrollar experiencias web funcionales. Detrás
        de cada uno hay un proceso de análisis, decisiones de diseño y
        soluciones que dieron forma al resultado final.
      </p>

      <div className="projects__carousel" ref={viewportRef}>
        <ol
          className={`projects__carousel-track${animateTrack ? " projects__carousel-track--animated" : ""}`}
          ref={trackRef}
          style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
          aria-live="off"
        >
          {carouselItems.map(({ project, key }, index) => (
            <li
              className={`projects__carousel-slide${index === activeTrackIndex ? " projects__carousel-slide--active" : ""}`}
              key={key}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              aria-current={index === activeTrackIndex ? "true" : undefined}
            >
              <ProjectCard project={project} />
            </li>
          ))}
        </ol>
      </div>

      <nav className="projects__carousel-controls" aria-label="Controles de proyectos">
        <button
          className="projects__carousel-arrow"
          type="button"
          aria-label="Proyecto anterior"
          onClick={() => goTo(Math.max(1, activeTrackIndex - 1))}
        >
          <span aria-hidden="true">←</span>
        </button>

        {favoriteProjects.length > 1 && (
          <div className="projects__carousel-indicators" aria-label="Elegir proyecto">
            {favoriteProjects.map((project, index) => (
              <button
                className="projects__carousel-indicator"
                type="button"
                key={project.id}
                aria-label={`Mostrar ${project.name}`}
                aria-current={index === activeProjectIndex}
                onClick={() => goTo(index + 2)}
              />
            ))}
          </div>
        )}

        <button
          className="projects__carousel-arrow"
          type="button"
          aria-label="Proyecto siguiente"
          onClick={() => goTo(Math.min(carouselItems.length - 2, activeTrackIndex + 1))}
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  );
}
