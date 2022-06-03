const client = require('../../dynamodbClientService');

exports.updateDocketEntryPendingServiceStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  status,
}) => {
  try {
    // updated to conditional update since this function should never create a docket entry record if it does not already exist
    await client.update({
      ConditionExpression: 'attribute_exists(docketEntryId)',
      ExpressionAttributeNames: {
        '#isPendingService': 'isPendingService',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
      Key: {
        pk: `case|${docketNumber}`,
        sk: `docket-entry|${docketEntryId}`,
      },
      UpdateExpression: 'SET #isPendingService = :status',
      applicationContext,
    });
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      applicationContext.logger.info(
        `Tried to reset docket entry pending state on non-existent docket entry on docket number ${docketNumber}.`,
      );
    } else {
      throw e;
    }
  }
};
