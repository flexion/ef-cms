import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkEditsDocketEntryNonstandardA } from './journey/docketClerkEditsDocketEntryNonstandardA';
import { docketClerkEditsDocketEntryNonstandardB } from './journey/docketClerkEditsDocketEntryNonstandardB';
import { docketClerkEditsDocketEntryNonstandardC } from './journey/docketClerkEditsDocketEntryNonstandardC';
import { docketClerkEditsDocketEntryNonstandardD } from './journey/docketClerkEditsDocketEntryNonstandardD';
import { docketClerkEditsDocketEntryNonstandardE } from './journey/docketClerkEditsDocketEntryNonstandardE';
import { docketClerkEditsDocketEntryNonstandardF } from './journey/docketClerkEditsDocketEntryNonstandardF';
import { docketClerkEditsDocketEntryNonstandardG } from './journey/docketClerkEditsDocketEntryNonstandardG';
import { docketClerkEditsDocketEntryNonstandardH } from './journey/docketClerkEditsDocketEntryNonstandardH';
import { docketClerkEditsDocketEntryStandard } from './journey/docketClerkEditsDocketEntryStandard';
import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();
integrationTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('docket clerk updates docket entries', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(integrationTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsDocketEntryWithoutFile(integrationTest);
  docketClerkEditsDocketEntryStandard(integrationTest);
  docketClerkEditsDocketEntryNonstandardA(integrationTest);
  docketClerkEditsDocketEntryNonstandardB(integrationTest);
  docketClerkEditsDocketEntryNonstandardC(integrationTest);
  docketClerkEditsDocketEntryNonstandardD(integrationTest);
  docketClerkEditsDocketEntryNonstandardE(integrationTest);
  docketClerkEditsDocketEntryNonstandardF(integrationTest);
  docketClerkEditsDocketEntryNonstandardG(integrationTest);
  docketClerkEditsDocketEntryNonstandardH(integrationTest);
});
