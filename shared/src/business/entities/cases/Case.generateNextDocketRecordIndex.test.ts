import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';

describe('generateNextDocketRecordIndex', () => {
  it('returns the next possible index based on the current docket record array', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
      },
      {
        authorizedUser: mockPetitionsClerkUser,
      },
    );

    const nextIndex = caseRecord.generateNextDocketRecordIndex();
    expect(nextIndex).toEqual(2); // because there is one document with isOnDocketRecord = true
  });

  it('returns an index of 1 if the docketEntries array is empty', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [],
      },
      {
        authorizedUser: mockPetitionsClerkUser,
      },
    );

    const nextIndex = caseRecord.generateNextDocketRecordIndex();
    expect(nextIndex).toEqual(1); // because there is one document with isOnDocketRecord = true
  });
});
