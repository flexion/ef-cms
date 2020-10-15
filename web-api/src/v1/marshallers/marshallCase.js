const { marshallContact } = require('./marshallContact');
const { marshallDocketEntry } = require('./marshallDocketEntry');
const { marshallPractitioner } = require('./marshallPractitioner');

// The returned object is specified by the v1 API and should not change
// without changing the API version.
exports.marshallCase = caseObject => {
  return {
    caseCaption: caseObject.caseCaption,
    caseType: caseObject.caseType,
    contactPrimary: caseObject.contactPrimary
      ? marshallContact(caseObject.contactPrimary)
      : undefined,
    contactSecondary: caseObject.contactSecondary
      ? marshallContact(caseObject.contactSecondary)
      : undefined,
    docketEntries: caseObject.docketEntries.map(marshallDocketEntry),
    docketNumber: caseObject.docketNumber,
    docketNumberSuffix: caseObject.docketNumberSuffix,
    filingType: caseObject.filingType,
    leadDocketNumber: caseObject.leadDocketNumber,
    noticeOfTrialDate: caseObject.noticeOfTrialDate,
    partyType: caseObject.partyType,
    practitioners: caseObject.privatePractitioners.map(marshallPractitioner),
    preferredTrialCity: caseObject.preferredTrialCity,
    respondents: caseObject.irsPractitioners.map(marshallPractitioner),
    sortableDocketNumber: caseObject.sortableDocketNumber,
    status: caseObject.status,
    trialLocation: caseObject.trialLocation,
  };
};
