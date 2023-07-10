import { PETITIONS_SECTION } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { getCompletedSectionInboxMessages } from './getCompletedSectionInboxMessages';
import { search } from '../searchClient';
jest.mock('../searchClient');

describe('getCompletedSectionInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedSectionInboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
