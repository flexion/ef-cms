const client = require('../../dynamodbClientService');

exports.deleteUserOutboxRecord = ({
  applicationContext,
  completedAt,
  userId,
}) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `user-outbox|${userId}`,
      sk: completedAt,
    },
  });
};
