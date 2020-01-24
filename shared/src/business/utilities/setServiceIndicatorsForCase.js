const constants = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};
const { isEmpty } = require('lodash');

/**
 * sets the service indicators for parties on the given case
 *
 * @param {object} caseDetail case to set service indicators on
 * @returns {object} service indicators for petitioner, practitioners, and respondents
 */
const setServiceIndicatorsForCase = caseDetail => {
  const {
    contactPrimary,
    contactSecondary,
    isPaper,
    practitioners,
  } = caseDetail;

  let hasPrimaryPractitioner = false;
  let hasSecondaryPractitioner = false;

  // practitioners
  if (practitioners && practitioners.length) {
    practitioners.forEach(practitioner => {
      if (practitioner.representingPrimary) {
        hasPrimaryPractitioner = true;
      }

      if (practitioner.representingSecondary) {
        hasSecondaryPractitioner = true;
      }
    });
  }

  // contactPrimary
  if (contactPrimary) {
    if (hasPrimaryPractitioner) {
      contactPrimary.serviceIndicator = constants.SI_NONE;
    } else {
      contactPrimary.serviceIndicator = isPaper
        ? constants.SI_PAPER
        : constants.SI_ELECTRONIC;
    }
  }

  // contactSecondary
  if (!isEmpty(contactSecondary)) {
    contactSecondary.serviceIndicator = hasSecondaryPractitioner
      ? constants.SI_NONE
      : constants.SI_PAPER;
  }

  return caseDetail;
};

module.exports = {
  constants,
  setServiceIndicatorsForCase,
};
