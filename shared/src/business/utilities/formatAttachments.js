/**
 * formats message attachments with meta data from aggregate case document arrays
 *
 * @params {object} params the params object
 * @param {array} attachments attachments to format
 * @param {object} caseDetail the case detail with documents, archivedDocuments (optional), and correspondence (optional)
 * @returns {array} the formatted array of attachment objects
 */
export const formatAttachments = ({ attachments, caseDetail }) => {
  const { archivedDocuments = [], correspondence = [], documents } = caseDetail;

  const allDocuments = [...archivedDocuments, ...documents, ...correspondence];

  const formattedAttachments = attachments.map(({ documentId }) => {
    const document = allDocuments.find(
      document => document.documentId === documentId,
    );

    if (document) {
      return {
        archived: !!document.archived,
        documentId,
        documentTitle: document.documentTitle || document.documentType,
      };
    } else {
      // TODO:  handle broken document references (deleted, etc..)
      return {
        archived: true,
        documentId: null,
        documentTitle: '[ Document Unavailable ]',
      };
    }
  });

  return formattedAttachments;
};
