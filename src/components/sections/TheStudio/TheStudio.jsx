import { useState } from "react";
import { studyGroups } from "../../../data/theStudio.js";
import { WheelSelector } from "./parts/WheelSelector/WheelSelector.jsx";
import { StudyPanel } from "./parts/StudyPanel/StudyPanel.jsx";
import "./theStudio.css";

function getPanelState(index, activeIndex) {
  if (index === activeIndex) return "is-active";
  return index < activeIndex ? "is-before" : "is-after";
}

export function TheStudio() {
  const [selectedId, setSelectedId] = useState(studyGroups[0].id);
  const activeIndex = studyGroups.findIndex((group) => group.id === selectedId);

  return (
    <section
      id="the-studio"
      className="the-studio container-wrapper"
      aria-labelledby="the-studio-title"
    >
      <div className="the-studio__card">
        <div className="the-studio__main">
          <h2 id="the-studio-title" className="the-studio__title">
            Conocé más sobre{" "}
            <span className="the-studio__title-accent">Lorium</span>
          </h2>

          <div className="the-studio__content" aria-live="polite">
            {studyGroups.map((group, index) => (
              <StudyPanel
                key={group.id}
                group={group}
                state={getPanelState(index, activeIndex)}
              />
            ))}
          </div>
        </div>

        <WheelSelector
          groups={studyGroups}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </section>
  );
}
