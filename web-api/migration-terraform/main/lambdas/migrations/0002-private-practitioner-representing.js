const {
  PrivatePractitioner,
} = require('../../../../../shared/src/business/entities/PrivatePractitioner');

const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.includes('case|') && item.sk.includes('privatePractitioner|')) {
      if (item.representingPrimary || item.representingSecondary) {
        if (!item.representing) {
          item.representing = [];
        }
        const caseRecord = await documentClient
          .get({
            Key: {
              pk: item.pk,
              sk: item.pk,
            },
            TableName: process.env.SOURCE_TABLE,
          })
          .promise()
          .then(res => {
            return res.Item;
          });

        if (caseRecord && caseRecord.docketNumber) {
          if (item.representingPrimary) {
            const primaryContactId = caseRecord.contactPrimary.contactId;
            item.representing.push(primaryContactId);
          }
          if (item.representingSecondary) {
            const secondaryContactId = caseRecord.contactSecondary.contactId;
            item.representing.push(secondaryContactId);
          }
        } else {
          throw new Error(`Case record ${item.docketNumber} was not found`);
        }
        console.log('updated practitioner', item);
        const updatedPrivatePractitioner = new PrivatePractitioner(item)
          .validate()
          .toRawObject();

        itemsAfter.push({
          ...item,
          ...updatedPrivatePractitioner,
        });
      } else {
        itemsAfter.push(item);
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
