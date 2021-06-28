import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkAppliesSignatureToDraftDocument } from './journey/petitionsClerkAppliesSignatureToDraftDocument';
import { petitionsClerkClearsSignatureFromDraftDocument } from './journey/petitionsClerkClearsSignatureFromDraftDocument';
import { petitionsClerkNavigatesBackAfterViewSignDraftDocument } from './journey/petitionsClerkNavigatesBackAfterViewSignDraftDocument';
import { petitionsClerkRemovesSignatureFromDraftDocument } from './journey/petitionsClerkRemovesSignatureFromDraftDocument';
import { petitionsClerkSavesSignatureForDraftDocument } from './journey/petitionsClerkSavesSignatureForDraftDocument';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingOrder } from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { petitionsClerkViewsSignDraftDocument } from './journey/petitionsClerkViewsSignDraftDocument';

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
  petitionsClerkViewsSignDraftDocument(integrationTest);
  petitionsClerkAppliesSignatureToDraftDocument(integrationTest);
  petitionsClerkClearsSignatureFromDraftDocument(integrationTest);
  petitionsClerkAppliesSignatureToDraftDocument(integrationTest);
  petitionsClerkSavesSignatureForDraftDocument(
    integrationTest,
    'Order of Dismissal and Decision updated.',
  );
  petitionsClerkNavigatesBackAfterViewSignDraftDocument(integrationTest);
  petitionsClerkRemovesSignatureFromDraftDocument(integrationTest);
});
