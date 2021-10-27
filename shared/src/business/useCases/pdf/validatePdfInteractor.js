/**
 * validatePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {boolean} true if no errors
 */
exports.validatePdfInteractor = (applicationContext, { key }) =>
  applicationContext.getUseCaseHelpers().validatePdf(applicationContext, {
    key,
  });
