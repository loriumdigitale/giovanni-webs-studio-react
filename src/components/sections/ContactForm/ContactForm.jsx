import { useState } from "react";
import emailjs from "@emailjs/browser";

import { FormHeader } from "./parts/FormHeader/FormHeader.jsx";
import { SelectField } from "./parts/SelectField/SelectField.jsx";
import { ProjectDetails } from "./parts/ProjectDetails/ProjectDetails.jsx";
import { NameInput } from "./parts/NameInput/NameInput.jsx";
import { ContactMethodSelector } from "./parts/ContactMethodSelector/ContactMethodSelector.jsx";
import { SubmitButton } from "./parts/SubmitButton/SubmitButton.jsx";

import { siteTypes, siteNeeds } from "../../../data/contactForm.js";
import { getWhatsAppUrl } from "../../../utils/messages/whatsapp.js";
import { buildEmailParams } from "../../../utils/messages/gmail.js";
import { Toast } from "../../ui/Toast/Toast.jsx";

const initialFormData = {
  siteType: null,
  needs: [],
  projectDetails: "",
  name: "",
  contactMethod: "whatsapp",
  contact: "",
};

const MIN_PHONE_DIGITS = 8;

function isValidContact(method, value) {
  if (method === "whatsapp") {
    return value.replace(/\D/g, "").length >= MIN_PHONE_DIGITS;
  }
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export function ContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSelectContactMethod(method) {
    setFormData((prev) =>
      prev.contactMethod === method
        ? prev
        : { ...prev, contactMethod: method, contact: "" },
    );
  }

  function showError(message) {
    setToast({ type: "error", message });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!formData.siteType) {
      showError("Contanos para qué es tu sitio web.");
      return;
    }

    if (formData.needs.length === 0) {
      showError("Elegí al menos una cosa que necesites resolver con la web.");
      return;
    }

    if (!formData.projectDetails.trim()) {
      showError(
        "Por favor describí tu idea, eso me ayuda a tener una mejor propuesta",
      );
      return;
    }

    if (!isValidContact(formData.contactMethod, formData.contact)) {
      showError(
        formData.contactMethod === "whatsapp"
          ? "Revisá tu número de WhatsApp (incluí el código de área)."
          : "Revisá tu correo electrónico.",
      );
      return;
    }

    setIsSubmitting(true);

    if (formData.contactMethod === "whatsapp") {
      window.open(getWhatsAppUrl(formData), "_blank", "noopener,noreferrer");
      setToast({ type: "success", message: "¡Mensaje enviado!" });
      setFormData(initialFormData);
      setIsSubmitting(false);
      return;
    }

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        buildEmailParams(formData),
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setToast({ type: "success", message: "¡Mensaje enviado!" });
        setFormData(initialFormData);
      })
      .catch((error) => {
        const errorMessage =
          error?.text || error?.message || "Ocurrió un error con EmailJS.";

        console.error("Error al enviar el email:", error);
        showError(`Error: ${errorMessage}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <section
      id="consulta"
      className="contact-form reveal-on-scroll"
      aria-label="Formulario de consulta"
    >
      <form onSubmit={handleSubmit}>
        <FormHeader />

        <SelectField
          label="¿Para qué es tu sitio web?"
          icon="globe"
          options={siteTypes}
          value={formData.siteType}
          onChange={(value) => updateField("siteType", value)}
          required
        />

        <SelectField
          label="¿Qué necesitás resolver con la web?"
          icon="list"
          placeholder="Elegí una o más opciones"
          options={siteNeeds}
          value={formData.needs}
          onChange={(value) => updateField("needs", value)}
          multiple
          required
        />

        <ProjectDetails
          value={formData.projectDetails}
          onChange={(value) => updateField("projectDetails", value)}
        />

        <NameInput
          value={formData.name}
          onChange={(value) => updateField("name", value)}
        />

        <ContactMethodSelector
          selectedMethod={formData.contactMethod}
          contactValue={formData.contact}
          onSelectMethod={handleSelectContactMethod}
          onContactChange={(value) => updateField("contact", value)}
        />

        <SubmitButton disabled={isSubmitting} />
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
