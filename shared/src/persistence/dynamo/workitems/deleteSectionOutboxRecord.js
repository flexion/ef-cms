const client = require('../../dynamodbClientService');

exports.deleteSectionOutboxRecord = ({
  applicationContext,
  completedAt,
  section,
}) => {
  return client.delete({
    applicationContext,
    key: {
      pk: `section-outbox|${section}`,
      sk: completedAt,
    },
  });
};
