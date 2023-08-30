import { put } from '../../dynamodbClientService';

export const updateIrsPractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  leadDocketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  leadDocketNumber?: string;
  practitioner: TPractitioner;
  userId: string;
}): Promise<void> => {
  const item: any = {
    ...practitioner,
    pk: `case|${docketNumber}`,
    sk: `irsPractitioner|${userId}`,
  };
  if (leadDocketNumber) {
    item.gsi1pk = `case|${leadDocketNumber}`;
  }

  await put({
    Item: item,
    applicationContext,
  });
};

export const updatePrivatePractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  leadDocketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  leadDocketNumber?: string;
  practitioner: TPractitioner;
  userId: string;
}): Promise<void> => {
  const item: any = {
    ...practitioner,
    pk: `case|${docketNumber}`,
    sk: `privatePractitioner|${userId}`,
  };
  if (leadDocketNumber) {
    item.gsi1pk = `case|${leadDocketNumber}`;
  }

  await put({
    Item: item,
    applicationContext,
  });
};
