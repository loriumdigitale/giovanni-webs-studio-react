import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import "./JellyRadio.css";

const DEFAULT_ITEMS = ["Off", "Low", "Medium", "High", "Max"];
const SIZES = { sm: [28, 12, 12], md: [36, 13, 16], lg: [44, 14, 20] };

const spring = (stiffness, mass, bounce) => ({
  type: "spring",
  stiffness,
  damping: 2 * Math.sqrt(stiffness * mass) * (1 - bounce),
  mass,
});

const Chip = forwardRef(function Chip({ motionValues, children, ...rest }, ref) {
  const transform = useTransform(
    () =>
      `translateX(${motionValues.x.get()}px) scale(${motionValues.sx.get()}, ${motionValues.sy.get()})`,
  );

  return (
    <motion.button ref={ref} style={{ transform }} {...rest}>
      {children}
    </motion.button>
  );
});

export default function JellyRadio({
  items = DEFAULT_ITEMS,
  value,
  defaultValue,
  onChange,
  chipColor = "#27272a",
  activeColor = "#f5f5f5",
  textColor = "#f5f5f5",
  activeTextColor = "#18181b",
  size = "md",
  gap = 8,
  radius = 18,
  swell = 0.2,
  barge = 6,
  shrink = 0.05,
  jelly = 1,
  bounce = 0.25,
  stagger = 22,
  stiffness = 580,
  disabled = false,
  ariaLabel = "Options",
  className = "",
  id,
  navigation = false,
}) {
  const list = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
  const [inner, setInner] = useState(() => defaultValue ?? list[0]?.value);
  const current = value ?? inner;
  const at = Math.max(0, list.findIndex((item) => item.value === current));
  const reduce = useReducedMotion();
  const groupRef = useRef(null);
  const chipRefs = useRef([]);
  const widths = useRef([]);
  const motionValuesRef = useRef([]);
  const applied = useRef(at);
  const config = useRef({});

  config.current = {
    swell,
    barge,
    shrink,
    jelly,
    bounce,
    stagger,
    stiffness,
    reduce,
    count: list.length,
  };

  const [height, fontSize, horizontalPadding] = SIZES[size] ?? SIZES.md;
  const itemsKey = list.map((item) => item.value).join("|");

  const getMotionValues = (index) => {
    let values = motionValuesRef.current[index];

    if (!values) {
      values = {
        x: motionValue(0),
        sx: motionValue(1),
        sy: motionValue(1),
      };
      motionValuesRef.current[index] = values;
    }

    return values;
  };

  const apply = (selectedIndex, instant) => {
    const settings = config.current;
    const group = groupRef.current;
    const isRtl = group
      ? getComputedStyle(group).direction === "rtl"
      : false;
    const push =
      ((widths.current[selectedIndex] ?? 0) * settings.swell) / 2 +
      settings.barge;

    for (let index = 0; index < settings.count; index += 1) {
      const values = getMotionValues(index);
      const isSelected = index === selectedIndex;
      const distance = Math.abs(index - selectedIndex);
      const direction = Math.sign(index - selectedIndex) * (isRtl ? -1 : 1);
      const x = direction * push;
      const scale = isSelected ? 1 + settings.swell : 1 - settings.shrink;

      if (instant || settings.reduce) {
        values.x.jump(x);
        values.sx.jump(scale);
        values.sy.jump(scale);
        continue;
      }

      const springStiffness =
        settings.stiffness * (1 - 0.12 * Math.min(distance, 3));
      const inFlight =
        values.x.isAnimating() ||
        values.sx.isAnimating() ||
        values.sy.isAnimating();
      const delay = inFlight ? 0 : (distance * settings.stagger) / 1000;

      animate(values.x, x, {
        ...spring(springStiffness, 0.9, settings.bounce),
        delay,
      });

      const jellyAmount = settings.jelly;

      animate(values.sx, scale, {
        ...spring(
          springStiffness * (1 + 0.24 * jellyAmount),
          0.9 - 0.1 * jellyAmount,
          Math.min(0.85, settings.bounce + 0.3 * jellyAmount),
        ),
        delay,
      });

      animate(values.sy, scale, {
        ...spring(
          springStiffness * (1 - 0.14 * jellyAmount),
          0.9 + 0.05 * jellyAmount,
          settings.bounce,
        ),
        delay: delay + 0.05 * jellyAmount,
      });
    }
  };

  const measure = () => {
    const group = groupRef.current;
    if (!group) return;

    widths.current = chipRefs.current.map((element) => element?.offsetWidth ?? 0);
    const chipHeight = chipRefs.current[0]?.offsetHeight ?? 0;
    const maxWidth = Math.max(0, ...widths.current);

    group.style.setProperty(
      "--jr-pad-x",
      `${Math.ceil((maxWidth * swell * 1.3) / 2 + barge) + 2}px`,
    );
    group.style.setProperty(
      "--jr-pad-y",
      `${Math.ceil((chipHeight * swell) / 2) + 2}px`,
    );
  };

  useLayoutEffect(() => {
    const settle = () => {
      measure();
      apply(applied.current, true);
    };

    settle();

    const observer = new ResizeObserver(settle);
    if (groupRef.current) observer.observe(groupRef.current);
    document.fonts?.ready.then(settle);

    return () => observer.disconnect();
    // The values below intentionally trigger a fresh measurement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, size, gap, swell, barge, shrink]);

  useEffect(() => {
    if (applied.current === at) return;

    applied.current = at;
    apply(at, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  useEffect(
    () => () => {
      motionValuesRef.current.forEach((values) => {
        values.x.destroy();
        values.sx.destroy();
        values.sy.destroy();
      });
    },
    [],
  );

  const commit = (index, instant) => {
    if (
      disabled ||
      index === at ||
      !list[index] ||
      list[index].disabled
    ) {
      return;
    }

    applied.current = index;
    apply(index, instant);

    if (value === undefined) setInner(list[index].value);
    onChange?.(list[index].value, index);
  };

  const stepFrom = (index, direction) => {
    const count = list.length;
    let nextIndex = index;

    for (let tries = 0; tries < count; tries += 1) {
      nextIndex = (nextIndex + direction + count) % count;
      if (!list[nextIndex].disabled) return nextIndex;
    }

    return index;
  };

  const handleKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = stepFrom(index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = stepFrom(index, -1);
    } else if (event.key === "Home") {
      nextIndex = stepFrom(-1, 1);
    } else if (event.key === "End") {
      nextIndex = stepFrom(list.length, -1);
    } else if (event.key === " " || event.key === "Enter") {
      nextIndex = index;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    commit(nextIndex, true);
    chipRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      ref={groupRef}
      id={id}
      role={navigation ? "group" : "radiogroup"}
      aria-label={ariaLabel}
      data-disabled={disabled ? "" : undefined}
      className={`jelly-radio${className ? ` ${className}` : ""}`}
      style={{
        "--jr-chip": chipColor,
        "--jr-active": activeColor,
        "--jr-text": textColor,
        "--jr-active-text": activeTextColor,
        "--jr-gap": `${gap}px`,
        "--jr-radius": `${radius}px`,
        "--jr-h": `${height}px`,
        "--jr-font": `${fontSize}px`,
        "--jr-px": `${horizontalPadding}px`,
      }}
    >
      {list.map((item, index) => (
        <Chip
          key={item.value}
          motionValues={getMotionValues(index)}
          ref={(element) => {
            chipRefs.current[index] = element;
          }}
          type="button"
          role={navigation ? "link" : "radio"}
          aria-checked={navigation ? undefined : index === at}
          aria-current={navigation && index === at ? "page" : undefined}
          tabIndex={navigation || index === at ? 0 : -1}
          disabled={disabled || !!item.disabled}
          className="jelly-radio__chip"
          data-on={index === at ? "true" : "false"}
          onClick={(event) => commit(index, event.detail === 0)}
          onKeyDown={navigation ? undefined : (event) => handleKeyDown(event, index)}
        >
          <span className="jelly-radio__skin">
            {item.icon ? (
              <span className="jelly-radio__icon">{item.icon}</span>
            ) : null}
            <span className="jelly-radio__label">{item.label}</span>
          </span>
        </Chip>
      ))}
    </div>
  );
}
