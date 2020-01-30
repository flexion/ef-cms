const isCaseRecord = item => !!item.caseType;
const { forAllRecords } = require('./00004-service-indicator');

const up = async (documentClient, tableName) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;

    // Case.docketRecord[].filingDate -> Case.docketRecord[].createdAt
    item.docketRecord.forEach(docketEntry => {
      if (docketEntry.filingDate) {
        docketEntry.createdAt = docketEntry.filingDate;

        // Case.documents[].filingDate = Case.docketRecord[].filingDate
        if (docketEntry.documentId) {
          item.documents.forEach(document => {
            if (docketEntry.documentId === document.documentId) {
              document.filingDate = docketEntry.filingDate;
            }
          });
        }

        docketEntry.filingDate = undefined;
      }
    });

    await documentClient
      .put({
        Item: item,
        TableName: tableName,
      })
      .promise();
  });
};

module.exports = { up };
