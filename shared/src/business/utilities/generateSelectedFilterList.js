const { TRIAL_STATUS_TYPES } = require('../entities/EntityConstants');

const generateCaseStatus = (trialStatus, updatedTrialSessionTypes) => {
  if (!trialStatus) return 'Unassigned';

  let foundTrialStatusFromConstant;

  Object.keys(TRIAL_STATUS_TYPES).forEach(key => {
    if (key === trialStatus) {
      foundTrialStatusFromConstant =
        !updatedTrialSessionTypes && TRIAL_STATUS_TYPES[trialStatus].legacyLabel
          ? TRIAL_STATUS_TYPES[trialStatus].legacyLabel
          : TRIAL_STATUS_TYPES[trialStatus].label;
    }
  });

  return foundTrialStatusFromConstant;
};

const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.leadCase;
};

module.exports = {
  generateCaseStatus,
  isMemberCase,
};
