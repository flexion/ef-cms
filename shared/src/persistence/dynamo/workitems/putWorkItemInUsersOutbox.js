const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');

exports.putWorkItemInUsersOutbox = async ({
  applicationContext,
  section,
  userId,
  workItem,
}) => {
  await createUserOutboxRecord({
    applicationContext,
    userId,
    workItem: {
      ...workItem,
    },
  });
  await createSectionOutboxRecord({
    applicationContext,
    section,
    workItem: {
      ...workItem,
    },
  });
};
