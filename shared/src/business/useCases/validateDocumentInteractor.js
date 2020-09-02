const { Document } = require('../entities/Document');

/**
 * validateDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.document the document to be validated
 * @returns {object} the validation errors or null
 */
exports.validateDocumentInteractor = ({ applicationContext, document }) => {
  const errors = new Document(document, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors || null;
};
