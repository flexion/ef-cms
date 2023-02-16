import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '../../../business/utilities/DateHandler';
import { queryFull } from '../../dynamodbClientService';

export const getDocumentQCServedForUser = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const startOfDay = createISODateAtStartOfDayEST();
  const afterDate = calculateISODate({
    dateString: startOfDay,
    howMuch: -7,
    units: 'days',
  });

  return queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':afterDate': { S: afterDate },
      ':pk': { S: `user-outbox|${userId}` },
    },
    KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    applicationContext,
  });
};
