import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '../../../business/entities/EntityConstants';
import { update } from '../../dynamodbClientService';

export const updateDocketEntryProcessingStatus = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
}) => {
  await update({
    ExpressionAttributeNames: {
      '#processingStatus': 'processingStatus',
    },
    ExpressionAttributeValues: {
      ':status': { S: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE },
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    UpdateExpression: 'SET #processingStatus = :status',
    applicationContext,
  });
};
