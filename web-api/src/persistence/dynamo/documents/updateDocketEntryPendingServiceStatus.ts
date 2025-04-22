import { update } from '@web-api/persistence/dynamodbClientService';

export const updateDocketEntryPendingServiceStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
  status,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
  status: boolean;
}): Promise<void> => {
  try {
    await update({
      ConditionExpression: 'attribute_exists(docketEntryId)', //this function should never create a docket entry record if it does not already exist
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
  } catch (e: any) {
    const ERROR: { code: string } = e;
    if (ERROR.code === 'ConditionalCheckFailedException') {
      applicationContext.logger.info(
        `Tried to reset docket entry pending state on non-existent docket entry on docket number ${docketNumber}.`,
      );
    } else {
      throw ERROR;
    }
  }
};
