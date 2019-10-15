import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const completeDocketEntryQCAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);

  let entryMetadata = omit(
    {
      ...get(state.form),
    },
    ['workitems'],
  );

  entryMetadata = {
    ...entryMetadata,
    docketNumber,
    documentId,
    caseId,
    createdAt: entryMetadata.dateReceived,
    receivedAt: entryMetadata.dateReceived,
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .completeDocketEntryQCInteractor({
      applicationContext,
      entryMetadata,
    });

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
