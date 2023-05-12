import { PDF } from '../../entities/documents/PDF';

/**
 * Validates a PDF
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.pdf a pdf that has been uploaded and instantiated as a PDF entity
 * @returns {void}
 */
export const validateFileInteractor = ({ pdf }: { pdf: PDF }) => {
  return pdf.getFormattedValidationErrors();
};
