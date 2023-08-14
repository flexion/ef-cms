import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudge } from './getCasesClosedByJudge';
import { judgeUser } from '../../../../shared/src/test/mockUsers';

describe('getCasesClosedByJudge', () => {
  let mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
    startDate: '02/12/2020',
  };

  it('should make a persistence call to obtain all closed cases associated with the given judge within the selected date range', async () => {
    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        filter: [
          {
            range: {
              'closedDate.S': {
                gte: '02/12/2020||/h',
                lte: '03/21/2020||/h',
              },
            },
          },
        ],
        must: [
          {
            match_phrase: {
              'associatedJudge.S': 'Sotomayor',
            },
          },
        ],
      },
    });
  });

  it('should make a persistence call to obtain all closed cases for all judges within the selected date range', async () => {
    mockValidRequest = {
      ...mockValidRequest,
      judgeName: 'All Judges',
    };

    applicationContext.getSearchClient().search.mockReturnValue({
      body: {},
    });

    await getCasesClosedByJudge({
      applicationContext,
      ...mockValidRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.size,
    ).toEqual(10000);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        filter: [
          {
            range: {
              'closedDate.S': {
                gte: '02/12/2020||/h',
                lte: '03/21/2020||/h',
              },
            },
          },
        ],
        must: [],
      },
    });
  });
});
