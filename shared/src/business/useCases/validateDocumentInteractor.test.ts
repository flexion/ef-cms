import { ROLES } from '../entities/EntityConstants';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { validateDocumentInteractor } from './validateDocumentInteractor';

describe('validateDocumentInteractor', () => {
  it('returns the expected errors object on an empty docket record', () => {
    const errors = validateDocumentInteractor(
      {
        document: {},
      },
      mockDocketClerkUser,
    );

    expect(Object.keys(errors!).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateDocumentInteractor(
      {
        document: {
          docketNumber: '101-21',
          documentTitle: 'Administrative Record',
          documentType: 'Administrative Record',
          eventCode: 'ADMR',
          filedBy: 'Test User',
          filedByRole: ROLES.docketClerk,
          filingDate: '2020-01-01T02:04:06.007Z',
          index: '1',
          userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
        },
      },
      mockDocketClerkUser,
    );

    expect(result).toEqual(null);
  });
});
