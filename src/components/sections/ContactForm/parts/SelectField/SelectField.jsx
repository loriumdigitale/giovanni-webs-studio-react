import { useEffect, useId, useRef, useState } from "react";
import { FieldIcon } from "../FieldIcon/FieldIcon.jsx";

function normalizar(opcion) {
  return typeof opcion === "string"
    ? { value: opcion, label: opcion }
    : opcion;
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  multiple = false,
  required = false,
  icon,
  placeholder = "Seleccioná una opción",
}) {
  const items = options.map(normalizar);
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const selected = multiple ? value : value == null ? [] : [value];
  const isSelected = (optionValue) => selected.includes(optionValue);
  const summary = items
    .filter((item) => isSelected(item.value))
    .map((item) => item.label)
    .join(", ");

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${id}-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  function openList() {
    const firstSelected = items.findIndex((item) => isSelected(item.value));
    setActive(firstSelected >= 0 ? firstSelected : 0);
    setOpen(true);
  }

  function choose(item) {
    if (multiple) {
      onChange(
        isSelected(item.value)
          ? value.filter((current) => current !== item.value)
          : [...value, item.value],
      );
      return;
    }

    onChange(item.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActive((current) => Math.min(items.length - 1, current + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActive((current) => Math.max(0, current - 1));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(items.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) openList();
        else choose(items[active]);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
    }
  }

  return (
    <div className="contact-form__section" ref={rootRef}>
      <p id={labelId} className="contact-form__label">
        {label}
        {required && <span className="contact-form__required">*</span>}
      </p>

      <div className="contact-form__select">
        <button
          ref={triggerRef}
          type="button"
          className={`contact-form__select-trigger ${
            open ? "contact-form__select-trigger--open" : ""
          }`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          aria-required={required}
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
          onKeyUp={(event) => {
            if (event.key === " ") event.preventDefault();
          }}
        >
          {icon && (
            <FieldIcon name={icon} className="contact-form__select-icon" />
          )}
          <span
            className={`contact-form__select-value ${
              summary ? "" : "contact-form__select-value--placeholder"
            }`}
          >
            {summary || placeholder}
          </span>
          <span className="contact-form__select-chevron" aria-hidden="true" />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            aria-multiselectable={multiple}
            className="contact-form__select-list"
          >
            {items.map((item, index) => (
              <li
                key={item.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected(item.value)}
                className={`contact-form__select-option ${
                  index === active ? "contact-form__select-option--active" : ""
                } ${
                  isSelected(item.value)
                    ? "contact-form__select-option--selected"
                    : ""
                }`}
                onPointerDown={(event) => event.preventDefault()}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(item)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
