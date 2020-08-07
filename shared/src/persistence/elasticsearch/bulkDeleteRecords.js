const { getIndexNameForRecord } = require('./getIndexNameForRecord');

exports.bulkDeleteRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const body = records
    .map(record => ({
      ...record.dynamodb.OldImage,
    }))
    .flatMap(doc => {
      const index = getIndexNameForRecord(doc);

      if (index) {
        return [{ delete: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: index } }];
      }
    })
    .filter(item => item);

  const response = await searchClient.bulk({
    body,
    refresh: true,
  });

  const failedRecords = [];
  if (response.errors) {
    response.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        let record = body[i * 2];
        failedRecords.push(record);
      }
    });
  }

  return { failedRecords };
};
