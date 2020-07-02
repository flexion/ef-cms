import { state } from 'cerebral';
/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({
  applicationContext,
  get,
}) => {
  let viewerDocumentToDisplay = null;
  const caseDetail = get(state.caseDetail);

  const formattedDocketRecordWithDocument = applicationContext
    .getUtilities()
    .formatDocketRecordWithDocument(
      applicationContext,
      caseDetail.docketRecord,
      caseDetail.documents,
    );

  const entriesWithDocument = formattedDocketRecordWithDocument.filter(
    entry => !!entry.document,
  );

  if (entriesWithDocument && entriesWithDocument.length) {
    viewerDocumentToDisplay = entriesWithDocument[0].document;
  }

  return {
    viewerDocumentToDisplay,
  };
};
