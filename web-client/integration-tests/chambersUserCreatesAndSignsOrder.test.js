import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserAppliesSignatureToDraftDocument } from './journey/chambersUserAppliesSignatureToDraftDocument';
import { chambersUserSavesSignatureForDraftDocument } from './journey/chambersUserSavesSignatureForDraftDocument';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsCaseDetailAfterAddingOrder } from './journey/chambersUserViewsCaseDetailAfterAddingOrder';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { chambersUserViewsSignDraftDocument } from './journey/chambersUserViewsSignDraftDocument';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Chambers dashboard', () => {
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

  loginAs(integrationTest, 'colvinsChambers@example.com');
  chambersUserViewsCaseDetail(integrationTest, 2);
  chambersUserViewsDraftDocuments(integrationTest);
  chambersUserAddsOrderToCase(integrationTest);
  chambersUserViewsCaseDetailAfterAddingOrder(integrationTest, 3);
  chambersUserViewsDraftDocuments(integrationTest, 1);
  chambersUserViewsSignDraftDocument(integrationTest);
  chambersUserAppliesSignatureToDraftDocument(integrationTest);
  chambersUserSavesSignatureForDraftDocument(integrationTest);
});
