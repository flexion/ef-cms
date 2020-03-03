import { fakeFile, loginAs, setupTest } from './helpers';
import chambersUserViewsDashboard from './journey/chambersUserViewsDashboard';

import petitionerAddNewCaseToTestObj from './journey/petitionerAddNewCaseToTestObj';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';
import petitionerViewsCaseDetailAfterFilingDocument from './journey/petitionerViewsCaseDetailAfterFilingDocument';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

import petitionsClerkCreatesMessageToChambers from './journey/petitionsClerkCreatesMessageToChambers';

const test = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerViewsCaseDetail(test);
  petitionerFilesDocumentForCase(test, fakeFile);
  petitionerViewsCaseDetailAfterFilingDocument(test);
  petitionerViewsDashboard(test);
  petitionerAddNewCaseToTestObj(test);

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesMessageToChambers(test, 'Yeah, chambers!!');

  loginAs(test, 'armensChambers');
  chambersUserViewsDashboard(test, 'Yeah, chambers!!');
});
