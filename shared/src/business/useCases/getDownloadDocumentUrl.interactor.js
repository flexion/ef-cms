exports.getDownloadDocumentUrl = ({ documentId, applicationContext }) => {
  return applicationContext.getPersistenceGateway().getDownloadPolicy({
    documentId: documentId,
    applicationContext,
  });
};
