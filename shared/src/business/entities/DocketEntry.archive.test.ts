import { A_VALID_DOCKET_ENTRY } from './DocketEntry.test';
import { DocketEntry } from './DocketEntry';

describe('archive', () => {
  it('archives the document', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      authorizedUser: undefined,
      petitioners: [
        {
          contactId: '7111b30b-ad38-42c8-9db0-d938cb2cb16b',
          contactType: 'primary',
        },
      ],
    });

    expect(docketEntry.archived).toBeFalsy();

    docketEntry.archive();

    expect(docketEntry.archived).toBeTruthy();
  });
});
