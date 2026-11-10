/**
 * Parámetros para la plantilla de EmailJS.
 * Se conservan los nombres de variable existentes de la plantilla:
 *  - service → tipo de sitio web
 *  - stage   → necesidades (lista separada por comas)
 */
export function buildEmailParams(formData) {
  const { name, siteType, needs, projectDetails, contact } = formData;

  return {
    from_name: name,
    service: siteType,
    stage: needs.join(", "),
    message: projectDetails,
    contact_detail: contact,
  };
}
