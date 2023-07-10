import { PETITIONS_SECTION } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { getSectionOutboxMessages } from './getSectionOutboxMessages';
import { search } from '../searchClient';
jest.mock('../searchClient');

describe('getSectionOutboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getSectionOutboxMessages({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
