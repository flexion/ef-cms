export const scanMessages = ({ applicationContext, messages }) => {
  const scanCalls = messages.map(message =>
    applicationContext
      .getUseCases()
      .virusScanPdfInteractor(applicationContext, {
        key: applicationContext
          .getPersistenceGateway()
          .getDocumentIdFromSQSMessage(message),
      }),
  );

  return Promise.all(scanCalls);
};
