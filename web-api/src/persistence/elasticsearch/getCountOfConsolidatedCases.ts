import { count } from './searchClient';

export const getCountOfConsolidatedCases = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: IApplicationContext;
  leadDocketNumber: string;
}) => {
  const results = await count({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          term: {
            'leadDocketNumber.S': leadDocketNumber,
          },
        },
      },
      index: 'efcms-case',
    },
  });

  return results;
};
