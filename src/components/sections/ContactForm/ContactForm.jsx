import { useState } from "react";
import emailjs from "@emailjs/browser";

import { FormHeader } from "./parts/FormHeader/FormHeader.jsx";
import { ServiceSelector } from "./parts/ServiceSelector/ServiceSelector.jsx";
import { ProjectDetails } from "./parts/ProjectDetails/ProjectDetails.jsx";
import { StageSelector } from "./parts/StageSelector/StageSelector.jsx";
import { NameInput } from "./parts/NameInput/NameInput.jsx";
import { ContactMethodSelector } from "./parts/ContactMethodSelector/ContactMethodSelector.jsx";
import { SubmitButton } from "./parts/SubmitButton/SubmitButton.jsx";

import { getWhatsAppUrl } from "../../../utils/messages/whatsapp.js";
import { buildEmailParams } from "../../../utils/messages/gmail.js";
import { Toast } from "../../ui/Toast/Toast.jsx";
const initialFormData = {
  service: null,
  projectDetails: "",
  stage: null,
  name: "",
  contactMethod: null,
  contactChoice: "default",
  customContact: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSelectContactMethod(socialName) {
    setFormData((prev) => ({
      ...prev,
      contactMethod: socialName,
      contactChoice: "default",
      customContact: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!formData.service || !formData.stage) {
      setToast({
        type: "error",
        message: "Seleccioná el servicio y la etapa de tu proyecto.",
      });
      return;
    }

    if (!formData.projectDetails.trim()) {
      setToast({
        type: "error",
        message:
          "Por favor describe tu idea, eso me ayuda a tener una mejor propuesta",
      });
      return;
    }

    setIsSubmitting(true);

    if (formData.contactMethod === "WhatsApp") {
      const url = getWhatsAppUrl(formData);
      window.open(url, "_blank", "noopener,noreferrer");
      setToast({ type: "success", message: "¡Mensaje enviado!" });
      setFormData(initialFormData);
      setIsSubmitting(false);
    }

    if (formData.contactMethod === "Gmail") {
      const params = buildEmailParams(formData);

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          params,
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
          setToast({
            type: "error",
            message: `Error: ${errorMessage}`,
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });

      if (
        formData.contactMethod !== "WhatsApp" &&
        formData.contactMethod !== "Gmail"
      ) {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <section className="contact-form reveal-on-scroll">
      <form onSubmit={handleSubmit}>
        <FormHeader />

        <ServiceSelector
          selectedService={formData.service}
          onSelect={(value) => updateField("service", value)}
          required
        />

        <ProjectDetails
          value={formData.projectDetails}
          onChange={(value) => updateField("projectDetails", value)}
        />

        <StageSelector
          selectedStage={formData.stage}
          onSelect={(value) => updateField("stage", value)}
          required
        />

        <NameInput
          value={formData.name}
          onChange={(value) => updateField("name", value)}
        />

        <ContactMethodSelector
          selectedMethod={formData.contactMethod}
          contactChoice={formData.contactChoice}
          customContact={formData.customContact}
          onSelectMethod={handleSelectContactMethod}
          onSelectChoice={(value) => updateField("contactChoice", value)}
          onCustomChange={(value) => updateField("customContact", value)}
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
