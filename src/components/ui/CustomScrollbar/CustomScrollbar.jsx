import { useEffect, useRef, useState } from "react";

const MIN_THUMB_SIZE = 40;

export function CustomScrollbar() {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const [scrollbar, setScrollbar] = useState({ thumbSize: 0, offset: 0 });

  useEffect(() => {
    const updateScrollbar = () => {
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - viewportHeight;

      if (maxScroll <= 0) {
        setScrollbar({ thumbSize: 0, offset: 0 });
        return;
      }

      const thumbSize = Math.max(
        MIN_THUMB_SIZE,
        (viewportHeight / documentHeight) * viewportHeight,
      );
      const availableTrack = viewportHeight - thumbSize;
      const offset = (window.scrollY / maxScroll) * availableTrack;

      setScrollbar({ thumbSize, offset });
    };

    updateScrollbar();
    window.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    return () => {
      window.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!draggingRef.current || !trackRef.current) return;

      const availableTrack =
        trackRef.current.clientHeight - scrollbar.thumbSize;
      const nextOffset = Math.min(
        Math.max(0, event.clientY - dragOffsetRef.current),
        availableTrack,
      );
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: (nextOffset / availableTrack) * maxScroll,
        behavior: "auto",
      });
    };

    const stopDragging = () => {
      draggingRef.current = false;
      document.body.classList.remove("custom-scrollbar-dragging");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [scrollbar.thumbSize]);

  const handleTrackPointerDown = (event) => {
    if (event.target !== trackRef.current || scrollbar.thumbSize === 0) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const clickOffset = event.clientY - trackRect.top - scrollbar.thumbSize / 2;
    const availableTrack = trackRect.height - scrollbar.thumbSize;
    const nextOffset = Math.min(Math.max(0, clickOffset), availableTrack);

    window.scrollTo({
      top: (nextOffset / availableTrack) * maxScroll,
      behavior: "smooth",
    });
  };

  const handleThumbPointerDown = (event) => {
    event.stopPropagation();
    draggingRef.current = true;
    const thumbRect = event.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = event.clientY - thumbRect.top;
    document.body.classList.add("custom-scrollbar-dragging");
  };

  if (scrollbar.thumbSize === 0) return null;

  return (
    <div
      ref={trackRef}
      className="custom-scrollbar"
      role="scrollbar"
      aria-controls="root"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(
        (scrollbar.offset / (window.innerHeight - scrollbar.thumbSize)) * 100,
      )}
      onPointerDown={handleTrackPointerDown}
    >
      <span
        className="custom-scrollbar__thumb"
        style={{
          height: `${scrollbar.thumbSize}px`,
          transform: `translateY(${scrollbar.offset}px)`,
        }}
        onPointerDown={handleThumbPointerDown}
      />
    </div>
  );
}
