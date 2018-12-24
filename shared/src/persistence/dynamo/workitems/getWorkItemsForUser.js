const { getRecordsViaMapping } = require('../../awsDynamoPersistence');

exports.getWorkItemsForUser = ({ userId, applicationContext }) => {
  console.log('we are here', userId);
  return getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'workItem',
  });
};
