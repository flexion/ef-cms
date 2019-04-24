const client = require('../../dynamodbClientService');

exports.setMessageAsRead = async ({
  userId,
  messageId,
  applicationContext,
}) => {
  await client.put({
    Item: {
      messageId,
      pk: `${userId}|read-messages`,
      sk: messageId,
      userId,
    },
    applicationContext,
  });
};
