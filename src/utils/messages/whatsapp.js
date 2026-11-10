const WHATSAPP_NUMBER = "5493834368435"; // reemplazar con el número real

export function buildWhatsAppMessage(formData) {
  const { name, siteType, needs, projectDetails, contact } = formData;

  let message = `Hola! Soy ${name}.\n\n`;
  message += `Mi sitio web es para: ${siteType}\n`;
  message += `Necesito resolver: ${needs.join(", ")}\n\n`;
  message += `${projectDetails}\n\n`;
  message += `Mi WhatsApp: ${contact}\n`;

  return message;
}

export function getWhatsAppUrl(formData) {
  const message = buildWhatsAppMessage(formData);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
