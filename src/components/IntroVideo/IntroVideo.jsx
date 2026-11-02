import { useEffect, useState } from "react";
import "./introVideo.css";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

export function IntroVideo() {
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_BREAKPOINT).matches,
  );
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateViewport = (event) => setIsMobile(event.matches);

    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (isFinished) return null;

  const videoSource = isMobile
    ? "/intro/lorium_intro_mobile.webm"
    : "/intro/lorium_intro_desktop.webm";

  return (
    <div className="intro-video" aria-hidden="true">
      <video
        key={videoSource}
        className="intro-video__media"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIsFinished(true)}
        onError={() => setIsFinished(true)}
      >
        <source src={videoSource} type="video/webm" />
      </video>
    </div>
  );
}
