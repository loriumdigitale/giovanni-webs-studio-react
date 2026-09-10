import { useState } from "react";
import { StudySection } from "./Section/StudySection.jsx";

const studySections = [
  {
    id: "origen",
    title: "El origen",
    content:
      "Lorium existe con una idea simple: crear un estudio capaz de llevar ideas a la realidad. Un espacio donde crear, experimentar e investigar formen parte del mismo proceso, buscando transformar una idea inicial en algo que pueda existir, funcionar y generar una experiencia propia.",
  },
  {
    id: "cambio",
    title: "El cambio",
    content:
      "Lorium nació como una evolución de Giovanni Webs Studio. Con el tiempo entendí que mi interés iba más allá del desarrollo web y que limitar el proyecto a una sola disciplina no representaba lo que realmente quería construir. El cambio hacia Lorium representa esa nueva visión: un estudio con la libertad de explorar diferentes áreas y crear mucho más allá de una tecnología específica.",
  },
  {
    id: "laboratorium",
    title: "Laboratorium",
    content:
      "Laboratorium significa laboratorio, y representa una parte fundamental de la identidad de Lorium. Un laboratorio es un espacio para investigar, experimentar, probar ideas y descubrir nuevas posibilidades. Esa es también la forma en la que quiero entender este estudio: un lugar donde una idea pueda explorarse antes de convertirse en un resultado.",
  },
  {
    id: "filosofia",
    title: "Filosofía",
    content:
      "Desde el comienzo, Lorium busca construir cada proyecto sobre tres pilares: cercanía, profesionalismo y calidad. La intención es mantener una comunicación humana durante el proceso, cuidar cada decisión y crear resultados que no solo funcionen, sino que tengan identidad y un propósito detrás.",
  },
  {
    id: "forma-diferente",
    title: "Una forma diferente de crear",
    content:
      "Crear no significa solamente construir algo y hacerlo funcionar. También implica investigar, probar alternativas y experimentar con nuevas posibilidades. La experimentación tiene un lugar especial dentro de Lorium porque permite transformar algo simple en una experiencia mucho más completa, interactiva y significativa.",
  },
  {
    id: "no-construir",
    title: "Lo que no quiero construir",
    content:
      "No quiero que Lorium sea una empresa más que realiza trabajos rápidos y genéricos simplemente por cumplir. Cada proyecto merece tiempo, atención y decisiones que tengan un propósito. La intención es construir algo que tenga calidad y que pueda diferenciarse de aquello que podría haber hecho cualquier otra persona.",
  },
  {
    id: "identidad",
    title: "Identidad",
    content:
      "Para mí, crear con identidad significa conseguir que un proyecto se sienta propio. Que exista algo en él que haga sentir que realmente fue pensado y construido para quien lo va a utilizar. No se trata solamente de que algo se vea diferente, sino de que sus decisiones, detalles y experiencia tengan una razón para estar ahí.",
  },
  {
    id: "primer-aprendizaje",
    title: "El primer aprendizaje",
    content:
      "Roble Sur fue uno de los primeros proyectos donde esta forma de pensar comenzó a tomar verdadera forma. Dejé de verlo únicamente como una práctica y empecé a prestar atención a la experiencia de quien utilizaría el proyecto. Fue ahí donde comprendí mejor la importancia del UX y descubrí que incluso el detalle más pequeño puede tener un propósito dentro de una experiencia completa.",
  },
  {
    id: "hacia-donde-va",
    title: "Hacia donde va",
    content:
      "Quiero que Lorium pueda convertirse en un estudio capaz de crear mucho más que productos tecnológicos. La visión es construir una empresa con la libertad de explorar diferentes áreas y convertir ideas en proyectos reales, manteniendo siempre la misma curiosidad por investigar, experimentar y crear.",
  },
];

export function TheStudy() {
  const [openSectionId, setOpenSectionId] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSectionId((currentSectionId) =>
      currentSectionId === sectionId ? null : sectionId,
    );
  };

  return (
    <div className="the-study__main container-wrapper">
      <h1 className="the-study__title">
        <span className="text-gradient">Conocé más sobre Lorium</span>
      </h1>
      <div className="the-study__section-container">
        {studySections.map((section) => (
          <StudySection
            key={section.id}
            id={section.id}
            title={section.title}
            isOpen={openSectionId === section.id}
            onToggle={() => toggleSection(section.id)}
          >
            {section.content}
          </StudySection>
        ))}
      </div>
    </div>
  );
}
