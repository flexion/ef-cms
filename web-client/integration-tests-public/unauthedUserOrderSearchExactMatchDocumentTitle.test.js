import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
//import faker from 'faker';

const testPublic = setupTest();
const testClient = setupTestClient();

testClient.draftOrders = [];
const createdDocketNumbers = [];

const { COUNTRY_TYPES } = applicationContext.getConstants();
const getContactPrimary = () => ({
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: 'Rick Alex',
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
});

const documentTitleKeyword = `Sunglasses_${new Date().getTime()}`;
const nonExactDocumentTitleKeyword = `${documentTitleKeyword}y`;

describe(`Create and serve a case with an order with exact keyword (${documentTitleKeyword})`, () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
      });

      expect(caseDetail.docketNumber).toBeDefined();
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });

  describe('Docket clerk creates an order on the case', () => {
    loginAs(testClient, 'docketclerk@example.com');

    docketClerkCreatesAnOrder(testClient, {
      documentContents: 'pigeon',
      documentTitle: documentTitleKeyword,
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(testClient, 0);
    docketClerkAddsDocketEntryFromOrder(testClient, 0);
    docketClerkServesDocument(testClient, 0);
  });
});

describe(`Create and serve a case with an order with a similar but not exact keyword (${nonExactDocumentTitleKeyword})`, () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(10000);
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactPrimary: getContactPrimary(),
      });

      expect(caseDetail.docketNumber).toBeDefined();
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });

  describe('Docket clerk creates an order on the case', () => {
    loginAs(testClient, 'docketclerk@example.com');

    docketClerkCreatesAnOrder(testClient, {
      documentContents: 'pigeon',
      documentTitle: nonExactDocumentTitleKeyword,
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });

    docketClerkSignsOrder(testClient, 1);
    docketClerkAddsDocketEntryFromOrder(testClient, 1);
    docketClerkServesDocument(testClient, 1);
  });
});

describe('Unauthed user searches for exact keyword', () => {
  it('searches for an order by keyword', async () => {
    await refreshElasticsearchIndex();
    await testPublic.runSequence('navigateToPublicSiteSequence', {});

    testPublic.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    expect(testPublic.currentRouteUrl).toEqual(
      applicationContext.getPublicSiteUrl(),
    );

    testPublic.setState('advancedSearchForm', {
      orderSearch: {
        keyword: documentTitleKeyword,
      },
    });

    await testPublic.runSequence('submitPublicOrderAdvancedSearchSequence');

    const searchResults = testPublic.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toMatchObject([
      {
        docketNumber: createdDocketNumbers[0],
        documentTitle: documentTitleKeyword,
      },
    ]);

    const nonExactResult = searchResults.find(
      record => record.documentTitle === nonExactDocumentTitleKeyword,
    );
    expect(nonExactResult).toBeFalsy(); // non exact result not returned
  });
});
