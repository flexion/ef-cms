const client = require('../../dynamodbClientService');

exports.deleteUserOutboxRecord = ({
  applicationContext,
  completedAt,
  createdAt,
  userId,
}) => {
  const completedKey = completedAt ? 'complete' : 'incomplete';

  return client.delete({
    applicationContext,
    key: {
      pk: `user-${completedKey}-outbox|${userId}`,
      sk: createdAt,
    },
  });
};
