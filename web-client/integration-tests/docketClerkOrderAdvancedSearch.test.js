import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../shared/src/business/entities/documents/DocumentSearch';
import {
  FORMATS,
  calculateISODate,
  createISODateString,
  deconstructDate,
  formatDateString,
} from '../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';

const integrationTest = setupTest();

const { COUNTRY_TYPES, DOCKET_NUMBER_SUFFIXES, SERVICE_INDICATOR_TYPES } =
  applicationContext.getConstants();

const seedData = {
  caseCaption: 'Hanan Al Hroub, Petitioner',
  contactPrimary: {
    address1: '123 Teachers Way',
    city: 'Haifa',
    country: 'Palestine',
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    name: 'Hanan Al Hroub',
    postalCode: '123456',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  },
  contactSecondary: {},
  docketEntryId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
  docketNumber: '104-20',
  docketNumberSuffix:
    DOCKET_NUMBER_SUFFIXES.DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION,
  documentContents:
    'Déjà vu, this is a seed order filed on Apr 13 at 11:01pm ET',
  documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
  filingDate: '2020-04-14T03:01:15.215Z',
  signedJudgeName: 'Maurice B. Foley',
};
const signedByJudge = 'Maurice B. Foley';
let caseDetail;

describe('docket clerk order advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    integrationTest.draftOrders = [];
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  describe('performing data entry', () => {
    loginAs(integrationTest, 'petitioner@example.com');
    it('create case', async () => {
      caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail).toBeDefined();
      integrationTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(integrationTest, 'docketclerk@example.com');
    docketClerkCreatesAnOrder(integrationTest, {
      documentTitle: 'Order',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(integrationTest, 0);
    docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
    docketClerkServesDocument(integrationTest, 0);

    docketClerkCreatesAnOrder(integrationTest, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(integrationTest, 1);
    docketClerkAddsDocketEntryFromOrderOfDismissal(integrationTest, 1);

    docketClerkCreatesAnOrder(integrationTest, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(integrationTest, 2);
    docketClerkAddsDocketEntryFromOrderOfDismissal(integrationTest, 2);
    docketClerkServesDocument(integrationTest, 2);

    docketClerkCreatesAnOrder(integrationTest, {
      documentTitle: 'Order of something',
      eventCode: 'O',
      expectedDocumentType: 'Order',
    });
    docketClerkSignsOrder(integrationTest, 3);
    docketClerkAddsDocketEntryFromOrder(integrationTest, 3);
    docketClerkServesDocument(integrationTest, 3);
    docketClerkSealsCase(integrationTest);
  });

  describe('search form default behavior', () => {
    it('go to advanced order search tab', async () => {
      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoAdvancedSearchSequence');
      integrationTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      const judges = integrationTest.getState('legacyAndCurrentJudges');
      expect(judges.length).toBeGreaterThan(0);

      const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
      expect(legacyJudge).toBeTruthy();

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({
        keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
      });
    });

    it('clears search fields', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await integrationTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'orderSearch',
      });

      expect(
        integrationTest.getState('advancedSearchForm.orderSearch'),
      ).toEqual({
        keyword: '',
      });
    });

    it('clears validation errors when switching tabs', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {},
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(integrationTest.getState('alertError')).toEqual({
        messages: ['Enter a keyword or phrase'],
        title: 'Please correct the following errors:',
      });

      await integrationTest.runSequence('advancedSearchTabChangeSequence');

      expect(integrationTest.getState('alertError')).not.toBeDefined();
    });
  });

  describe('search for things that should not be found', () => {
    it('search for a keyword that is not present in any served order', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'osteodontolignikeratic',
          startDate: '2001-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a docket number that is not present in any served orders', async () => {
      const docketNumberNoOrders = '999-99';

      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: docketNumberNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a case title that is not present in any served orders', async () => {
      const caseCaptionNoOrders = 'abcdefghijk';

      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseCaptionNoOrders,
          keyword: 'dismissal',
          startDate: '2001-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a date range that does not contain served orders', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          endDate: '2005-01-03',
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });

    it('search for a judge that has not signed any served orders', async () => {
      const invalidJudge = 'Judge Exotic';

      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          judge: invalidJudge,
          keyword: 'dismissal',
          startDate: '2005-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    });
  });

  describe('search for things that should be found', () => {
    it('search for a keyword that is present in served orders', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[2].docketEntryId,
            isSealed: true,
          }),
        ]),
      );
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a docket number that is present in served orders', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
          startDate: '1995-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a case title that is present in served orders', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a date range that contains served orders', async () => {
      const endOrderCreationMoment = calculateISODate({
        howMuch: 1,
        unit: 'months',
      });
      const startOrderCreationMoment = calculateISODate({
        howMuch: -1,
        unit: 'months',
      });

      const {
        day: endDateDay,
        month: endDateMonth,
        year: endDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(endOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );
      const {
        day: startDateDay,
        month: startDateMonth,
        year: startDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(startOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );

      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          endDate: `${endDateYear}-${endDateMonth}-${endDateDay}`,
          keyword: 'dismissal',
          startDate: `${startDateYear}-${startDateMonth}-${startDateDay}`,
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      await refreshElasticsearchIndex();

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[2].docketEntryId,
          }),
        ]),
      );
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('search for a judge that has signed served orders', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          judge: signedByJudge,
          keyword: 'dismissal',
          startDate: '1000-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ docketEntryId: seedData.docketEntryId }),
        ]),
      );
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: integrationTest.draftOrders[1].docketEntryId,
          }),
        ]),
      );
    });

    it('includes the number of pages present in each document in the search results', async () => {
      integrationTest.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'Order of Dismissal Entered',
          startDate: '1000-01-01',
        },
      });

      await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            numberOfPages: 1,
          }),
        ]),
      );
    });
  });
});
