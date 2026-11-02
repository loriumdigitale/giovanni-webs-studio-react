import { useEffect } from 'react';

const DEFAULT_TARGET_SELECTOR = 'a, button, [data-crosshair-target]';
const TOUCH_DEVICE = '(hover: none) and (pointer: coarse)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const randomBetween = (min, max) => min + Math.random() * (max - min);

/**
 * Drives the existing Crosshair with synthetic pointer-move events on touch-only
 * devices. It never dispatches pointerdown, click, or navigation events.
 */
export function CrosshairAutoplay({ targetSelector = DEFAULT_TARGET_SELECTOR }) {
  useEffect(() => {
    const touchQuery = window.matchMedia(TOUCH_DEVICE);
    const motionQuery = window.matchMedia(REDUCED_MOTION);
    const root = document.documentElement;
    const activePointers = new Set();
    let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let motionFrame = 0;
    let motionTimer = 0;
    let selectionTimer = 0;
    let holdTimer = 0;
    let enabled = false;
    let selected = false;
    let alive = true;

    const clearTimer = timer => {
      if (timer) window.clearTimeout(timer);
    };

    const sendMove = (target, x, y) => {
      const event = new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: false,
        composed: true,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        clientX: x,
        clientY: y,
        buttons: 0,
        pressure: 0
      });
      target.dispatchEvent(event);
    };

    const visibleTargets = () => {
      let nodes;
      try {
        nodes = document.querySelectorAll(targetSelector);
      } catch {
        return [];
      }

      return Array.from(nodes).filter(node => {
        if (!node.isConnected || node.closest('[inert], [aria-hidden="true"]')) return false;
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          visibleWidth > 1 &&
          visibleHeight > 1 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.visibility !== 'collapse' &&
          Number(style.opacity) > 0
        );
      });
    };

    const cancelMovement = () => {
      if (motionFrame) cancelAnimationFrame(motionFrame);
      motionFrame = 0;
      clearTimer(motionTimer);
      motionTimer = 0;
    };

    const stopAutomation = () => {
      cancelMovement();
      clearTimer(selectionTimer);
      clearTimer(holdTimer);
      selectionTimer = 0;
      holdTimer = 0;
      selected = false;
    };

    const animateTo = (destination, duration, onComplete) => {
      cancelMovement();
      const start = { ...position };
      const startedAt = performance.now();

      const step = now => {
        if (!alive || !enabled || activePointers.size) return;
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = progress * progress * (3 - 2 * progress);
        position = {
          x: start.x + (destination.x - start.x) * eased,
          y: start.y + (destination.y - start.y) * eased
        };
        sendMove(root, position.x, position.y);
        if (progress < 1) {
          motionFrame = requestAnimationFrame(step);
          return;
        }
        motionFrame = 0;
        onComplete?.();
      };

      motionFrame = requestAnimationFrame(step);
    };

    const scheduleSelection = () => {
      clearTimer(selectionTimer);
      selectionTimer = window.setTimeout(selectTarget, randomBetween(5000, 10000));
    };

    const moveFreely = () => {
      if (!enabled || selected || activePointers.size) return;
      const destination = {
        x: randomBetween(12, Math.max(13, window.innerWidth - 12)),
        y: randomBetween(12, Math.max(13, window.innerHeight - 12))
      };
      animateTo(destination, randomBetween(1800, 3600), () => {
        motionTimer = window.setTimeout(moveFreely, 180);
      });
    };

    function selectTarget() {
      selectionTimer = 0;
      if (!enabled || activePointers.size) return;
      const candidates = visibleTargets();
      if (!candidates.length) {
        selectionTimer = window.setTimeout(selectTarget, 1800);
        return;
      }

      const target = candidates[Math.floor(Math.random() * candidates.length)];
      const rect = target.getBoundingClientRect();
      const destination = {
        x: Math.min(window.innerWidth - 1, Math.max(0, rect.left + rect.width / 2)),
        y: Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height / 2))
      };

      selected = true;
      cancelMovement();
      // The next selection interval starts now; this is only a pointermove.
      scheduleSelection();
      animateTo(destination, 750, () => {
        if (!target.isConnected || activePointers.size) {
          selected = false;
          moveFreely();
          return;
        }
        position = destination;
        sendMove(target, position.x, position.y);
        holdTimer = window.setTimeout(() => {
          holdTimer = 0;
          if (!enabled || activePointers.size) return;
          // Moving the event target back to the document root clears the lock.
          sendMove(root, position.x, position.y);
          selected = false;
          moveFreely();
        }, 3000);
      });
    }

    const enable = () => {
      if (!alive || !touchQuery.matches || motionQuery.matches || document.hidden || activePointers.size) return;
      if (!enabled) {
        enabled = true;
        sendMove(root, position.x, position.y);
        scheduleSelection();
        moveFreely();
      }
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      stopAutomation();
      // Clear the Crosshair's visible/hidden state without triggering a click.
      if (!activePointers.size) {
        root.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true,
          pointerId: 1,
          pointerType: 'touch',
          isPrimary: true,
          clientX: position.x,
          clientY: position.y
        }));
      }
    };

    const onPointerDown = event => {
      if (event.pointerType !== 'touch') return;
      activePointers.add(event.pointerId);
      position = { x: event.clientX, y: event.clientY };
      stopAutomation();
    };

    const onPointerMove = event => {
      if (event.pointerType !== 'touch' || !activePointers.has(event.pointerId)) return;
      position = { x: event.clientX, y: event.clientY };
    };

    const onPointerEnd = event => {
      if (event.pointerType !== 'touch' || !activePointers.has(event.pointerId)) return;
      position = { x: event.clientX, y: event.clientY };
      activePointers.delete(event.pointerId);
      if (activePointers.size) return;
      selected = false;
      // Crosshair's original touch handler fades on release; re-enter at the
      // exact release coordinate, then resume the autonomous path from there.
      requestAnimationFrame(() => {
        if (!alive || !touchQuery.matches || motionQuery.matches || document.hidden) return;
        enabled = true;
        sendMove(root, position.x, position.y);
        scheduleSelection();
        moveFreely();
      });
    };

    const onVisibilityChange = () => {
      if (document.hidden) disable();
      else enable();
    };

    const onEnvironmentChange = () => {
      if (touchQuery.matches && !motionQuery.matches) enable();
      else disable();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    document.addEventListener('visibilitychange', onVisibilityChange);
    touchQuery.addEventListener('change', onEnvironmentChange);
    motionQuery.addEventListener('change', onEnvironmentChange);
    enable();

    return () => {
      alive = false;
      disable();
      stopAutomation();
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      touchQuery.removeEventListener('change', onEnvironmentChange);
      motionQuery.removeEventListener('change', onEnvironmentChange);
    };
  }, [targetSelector]);

  return null;
}

export default CrosshairAutoplay;
