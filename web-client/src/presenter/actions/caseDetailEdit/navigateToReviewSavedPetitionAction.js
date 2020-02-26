import { state } from 'cerebral';
/**
 * changes the route to view the review
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToReviewSavedPetitionAction = async ({ get, router }) => {
  const documentId = get(state.documentId);
  const docketNumber = get(state.caseDetail.docketNumber);

  if (documentId && docketNumber) {
    await router.route(
      `/case-detail/${docketNumber}/documents/${documentId}/review`,
    );
  }
};
