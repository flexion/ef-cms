import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsDocketEntryForOrderAndSavesForLater } from './journey/petitionsClerkAddsDocketEntryForOrderAndSavesForLater';
import { petitionsClerkAddsGenericOrderToCase } from './journey/petitionsClerkAddsGenericOrderToCase';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';
import { petitionsClerkEditsDraftOrder } from './journey/petitionsClerkEditsDraftOrder';
import { petitionsClerkEditsGenericOrder } from './journey/petitionsClerkEditsGenericOrder';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';
import { petitionsClerkViewsAddDocketEntryForGenericOrder } from './journey/petitionsClerkViewsAddDocketEntryForGenericOrder';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingOrder } from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { petitionsDeletesOrderFromCase } from './journey/petitionsDeletesOrderFromCase';

const integrationTest = setupTest();

describe('Petitions Clerk Create Order Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(integrationTest);
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCase(integrationTest, fakeFile);
  petitionerViewsDashboard(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkViewsDraftDocuments(integrationTest);
  petitionsClerkAddsOrderToCase(integrationTest);
  petitionsClerkViewsCaseDetailAfterAddingOrder(integrationTest);
  petitionsClerkViewsDraftDocuments(integrationTest, 1);
  petitionsClerkEditsDraftOrder(integrationTest, {});
  petitionsClerkViewsDraftDocuments(integrationTest, 1);
  petitionsClerkEditsDraftOrder(integrationTest, {
    currentRichText: '<p>This is an edited test order.</p>',
    setRichText: '<p>This is a re-edited test order</p>',
  });
  petitionsClerkCreatesMessageToChambers(integrationTest);
  petitionsDeletesOrderFromCase(integrationTest);
  petitionsClerkViewsDraftDocuments(integrationTest, 0);

  petitionsClerkAddsGenericOrderToCase(integrationTest);
  petitionsClerkSignsOrder(integrationTest);
  petitionsClerkViewsAddDocketEntryForGenericOrder(integrationTest);
  petitionsClerkEditsGenericOrder(integrationTest);
  petitionsClerkSignsOrder(integrationTest);
  petitionsClerkViewsAddDocketEntryForGenericOrder(integrationTest);
  petitionsClerkServesElectronicCaseToIrs(integrationTest);
  petitionsClerkAddsDocketEntryForOrderAndSavesForLater(integrationTest);
});
