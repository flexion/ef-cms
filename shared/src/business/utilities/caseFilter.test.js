const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
  caseSearchFilter,
} = require('./caseFilter');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../entities/EntityConstants');

describe('caseFilter', () => {
  it('should format sealed cases to preserve ONLY attributes appearing in a whitelist', () => {
    const result = caseSealedFormatter({
      baz: 'quux',
      docketNumber: '102-20',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      foo: 'bar',
      sealedDate: '2020-01-02T03:04:05.007Z',
    });

    expect(result).toEqual({
      docketNumber: '102-20',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      sealedDate: '2020-01-02T03:04:05.007Z',
    });
  });

  it('caseContactAddressSealedFormatter', () => {
    const result = caseContactAddressSealedFormatter({
      bananas: '12',
      city: 'Los Angeles',
      contactId: '42-universe-everything',
      isAddressSealed: 'maybe',
      name: 'Joe Dirt',
      secondaryName: 'Cheeseburgers',
      title: 'Emperor',
      transmission: 'manual',
    });
    expect(Object.keys(result)).toMatchObject([
      'contactId',
      'isAddressSealed',
      'name',
      'secondaryName',
      'title',
    ]);
  });

  describe('caseSearchFilter', () => {
    const caseSearchResults = [
      {
        baz: 'quux',
        docketNumber: '101-20',
        documents: [{ documentType: 'Petition' }],
        foo: 'baz',
        sealedDate: undefined,
      },
      {
        baz: 'quux',
        docketNumber: '102-20',
        documents: [{ documentType: 'Petition' }],
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
      {
        baz: 'quux',
        docketNumber: '102-20',
        documents: [
          { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
        ],
        foo: 'bar',
        irsPractitioners: [{ userId: 'authRespondent' }],
        privatePractitioners: [{ userId: 'authPractitioner' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
    ];

    it('should remove sealed cases from a set of advanced search results', () => {
      const result = caseSearchFilter(caseSearchResults, {
        role: ROLES.irsPractitioner,
        userId: 'some other respondent',
      });

      expect(result.length).toEqual(1);
      expect(result[0]).toMatchObject({
        docketNumber: '101-20',
        sealedDate: undefined,
      });
    });

    it('should keep sealed cases in search results if user is an internal user with permission to see sealed cases', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: ROLES.petitionsClerk,
        userId: 'petitionsClerk',
      });

      expect(result.length).toEqual(3);
    });

    it('should keep sealed cases in search results if user is an IRS superuser with permission to see sealed cases', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: ROLES.irsSuperuser,
        userId: 'irsSuperuser',
      });

      expect(result.length).toEqual(3);
    });

    it('should keep sealed cases in search results if user is associated as practitioner or respondent', () => {
      let result = caseSearchFilter(caseSearchResults, {
        userId: 'authPractitioner',
      });

      expect(result.length).toEqual(3);

      result = caseSearchFilter(caseSearchResults, {
        userId: 'authRespondent',
      });

      expect(result.length).toEqual(3);
    });
  });
});
