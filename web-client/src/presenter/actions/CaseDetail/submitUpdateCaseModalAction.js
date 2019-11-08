import { state } from 'cerebral';

/**
 * Updates the case caption and case status
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the get function
 * @returns {object} the updated case as caseDetail
 */
export const submitUpdateCaseModalAction = async ({
  applicationContext,
  get,
}) => {
  const { associatedJudge, caseCaption, caseStatus } = get(state.modal);
  let selectedAssociatedJudge = associatedJudge;
  const caseToUpdate = get(state.caseDetail);
  const {
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();

  if (!STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus)) {
    selectedAssociatedJudge = undefined;
  }

  let updatedCase = caseToUpdate;
  if (caseCaption && caseToUpdate.caseCaption !== caseCaption) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseCaptionInteractor({
        applicationContext,
        caseCaption,
        caseId: caseToUpdate.caseId,
      });
  }

  if (
    (caseStatus && caseToUpdate.status !== caseStatus) ||
    (selectedAssociatedJudge &&
      caseToUpdate.associatedJudge !== selectedAssociatedJudge)
  ) {
    updatedCase = await applicationContext
      .getUseCases()
      .updateCaseStatusInteractor({
        applicationContext,
        associatedJudge: selectedAssociatedJudge,
        caseId: caseToUpdate.caseId,
        caseStatus,
      });
  }

  return {
    alertSuccess: {
      message: 'Your changes have been saved',
    },
    caseDetail: updatedCase,
  };
};
