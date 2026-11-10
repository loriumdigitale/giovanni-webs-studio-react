import "./wheelSelector.css";

export function WheelSelector({ groups, selectedId, onSelect }) {
  const activeIndex = groups.findIndex((group) => group.id === selectedId);
  const nextGroup = groups[(activeIndex + 1) % groups.length];
  const middle = (groups.length - 1) / 2;

  return (
    <div className="the-studio__wheel-selector">
      <div className="the-studio__hint">TOCA PARA CAMBIAR</div>

      <div
        className="the-studio__wheel"
        style={{ "--shift": `${(middle - activeIndex) * 30}deg` }}
      >
        {/* Capa clicable: avanza a la opción siguiente */}
        <button
          type="button"
          className="the-studio__next-trigger"
          onClick={() => onSelect(nextGroup.id)}
          aria-label={`Girar: ir a ${nextGroup.label}`}
        />

        <div className="the-studio__glass" />

        {groups.map((group, index) => {
          const inputId = `the-studio-option-${group.id}`;

          return (
            <span key={group.id} className="the-studio__option">
              <input
                type="radio"
                name="the-studio-wheel"
                id={inputId}
                value={group.id}
                checked={selectedId === group.id}
                onChange={() => onSelect(group.id)}
              />
              <label
                className="the-studio__wheel-label"
                htmlFor={inputId}
                style={{ "--angle": `${(index - middle) * 30}deg` }}
              >
                <span className="the-studio__num">{group.num}</span>
                <span className="the-studio__label">{group.label}</span>
              </label>
            </span>
          );
        })}
      </div>
    </div>
  );
}
