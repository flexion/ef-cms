const { Case } = require('../entities/cases/Case');
const { isEmpty } = require('lodash');
const { Petitioner } = require('../entities/contacts/Petitioner');

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contact the contact to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddPetitionerInteractor = ({ applicationContext, contact }) => {
  const petitionerErrors = new Petitioner(contact, {
    applicationContext,
  }).getFormattedValidationErrors();

  let caseCaptionError;
  if (!contact.caseCaption) {
    caseCaptionError = {
      caseCaption: Case.VALIDATION_ERROR_MESSAGES.caseCaption,
    };
  }

  const aggregatedErrors = {
    ...petitionerErrors,
    ...caseCaptionError,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
