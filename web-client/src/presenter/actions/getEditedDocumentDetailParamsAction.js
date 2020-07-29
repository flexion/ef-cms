import { state } from 'cerebral';

/**
 * Gets the docketNumber and documentId from current state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the docketNumber and documentId
 */
export const getEditedDocumentDetailParamsAction = async ({ get, props }) => {
  const caseDetail = get(state.caseDetail);
  const documentToEdit = get(state.documentToEdit);
  const documentId = documentToEdit
    ? documentToEdit.documentId
    : get(props.primaryDocumentFileId);

  return {
    docketNumber: caseDetail.docketNumber,
    docketNumber: caseDetail.docketNumber,
    documentId,
  };
};
