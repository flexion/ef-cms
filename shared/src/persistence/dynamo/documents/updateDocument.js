const client = require('../../dynamodbClientService');
const { UnblessedPersistenceError } = require('../../../errors/errors');

exports.updateDocument = async ({
  applicationContext,
  docketNumber,
  document,
  documentId,
}) => {
  document.blessed || throw new UnblessedPersistenceError();
  await client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `document|${documentId}`,
      ...document,
    },
    applicationContext,
  });
};
