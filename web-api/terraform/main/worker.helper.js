export const scanMessages = ({ applicationContext, messages }) => {
  const scanCalls = messages.map(message =>
    applicationContext
      .getUseCases()
      .virusScanPdfInteractor(applicationContext, {
        key: applicationContext
          .getPersistenceGateway()
          .getDocumentIdFromSQSMessage(message),
        scanCompleteCallback: () => null, // sqs-consumer already deletes the message for us, we might want to remove this callback
      }),
  );

  return Promise.all(scanCalls);
};
