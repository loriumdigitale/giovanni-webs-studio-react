import { Hero } from "../components/sections/Hero/Hero.jsx";
import { Services } from "../components/sections/Services/Services.jsx";
import { Projects } from "../components/sections/Projects/Projects.jsx";
import { ContactForm } from "../components/sections/ContactForm/ContactForm.jsx";
import { ContactSection } from "../components/sections/ContactSection/ContactSection.jsx";
import { LoriumCards } from "../components/sections/LoriumCards/LoriumCards.jsx";

export function Home({ isIntroComplete }) {
  return (
    <>
      <Hero isIntroComplete={isIntroComplete} />
      <Services />
      <Projects />
      <ContactSection />
      <LoriumCards />
      <ContactForm />
    </>
  );
}
