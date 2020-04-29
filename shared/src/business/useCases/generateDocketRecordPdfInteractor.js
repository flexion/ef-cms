/**
 * generateDocketRecordPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id for the docket record to be generated
 * @returns {Uint8Array} docket record pdf
 */
exports.generateDocketRecordPdfInteractor = async ({
  applicationContext,
  caseId,
  docketRecordSort,
  includePartyDetail = false,
}) => {
  // check user permissions

  return await applicationContext.getUseCaseHelpers().generateDocketRecordPdf({
    caseId,
    docketRecordSort,
    includePartyDetail,
  });
};
