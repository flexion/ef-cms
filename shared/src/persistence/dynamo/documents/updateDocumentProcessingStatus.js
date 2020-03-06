const client = require('../../dynamodbClientService');

exports.updateDocumentProcessingStatus = async ({
  applicationContext,
  caseId,
  documentIndex,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#documents': 'documents',
      '#processingStatus': 'processingStatus',
    },
    ExpressionAttributeValues: {
      ':status': 'complete',
    },
    Key: {
      pk: `case|${caseId}`,
      sk: `case|${caseId}`,
    },
    UpdateExpression: `SET #documents[${documentIndex}].#processingStatus = :status`,
    applicationContext,
  });
};
