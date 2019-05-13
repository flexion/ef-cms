const moment = require('moment');
const {
  getSortRecordsViaMapping,
} = require('../../dynamo/helpers/getSortRecordsViaMapping');

exports.getSentWorkItemsForUser = async ({ userId, applicationContext }) => {
  const workItems = await getSortRecordsViaMapping({
    afterDate: moment
      .utc(new Date().toISOString())
      .startOf('day')
      .subtract(7, 'd')
      .utc()
      .format(),
    applicationContext,
    foreignKey: 'workItemId',
    key: userId,
    type: 'outbox',
  });

  return workItems;
};
