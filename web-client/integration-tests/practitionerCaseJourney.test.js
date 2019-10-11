import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { fakeFile, setupTest } from './helpers';
import { uploadPetition } from './helpers';
import practitionerCreatesNewCase from './journey/practitionerCreatesNewCase';
import practitionerFilesDocumentForOwnedCase from './journey/practitionerFilesDocumentForOwnedCase';
import practitionerLogin from './journey/practitionerLogIn';
import practitionerNavigatesToCreateCase from './journey/practitionerNavigatesToCreateCase';
import practitionerRequestsAccessToCase from './journey/practitionerRequestsAccessToCase';
import practitionerRequestsPendingAccessToCase from './journey/practitionerRequestsPendingAccessToCase';
import practitionerSearchesForCase from './journey/practitionerSearchesForCase';
import practitionerSearchesForNonexistentCase from './journey/practitionerSearchesForNonexistentCase';
import practitionerSignsOut from './journey/practitionerSignsOut';
import practitionerViewsCaseDetail from './journey/practitionerViewsCaseDetail';
import practitionerViewsCaseDetailOfOwnedCase from './journey/practitionerViewsCaseDetailOfOwnedCase';
import practitionerViewsCaseDetailOfPendingCase from './journey/practitionerViewsCaseDetailOfPendingCase';
import practitionerViewsDashboard from './journey/practitionerViewsDashboard';
import practitionerViewsDashboardBeforeAddingCase from './journey/practitionerViewsDashboardBeforeAddingCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('Practitioner requests access to case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  //tests for practitioner starting a new case
  practitionerLogin(test);
  practitionerNavigatesToCreateCase(test);
  practitionerCreatesNewCase(test, fakeFile);
  practitionerViewsCaseDetailOfOwnedCase(test);
  practitionerSignsOut(test);

  //tests for practitioner requesting access to existing case
  //taxpayer must first create a case for practitioner to request access to
  taxpayerLogin(test);
  it('Create test case #1', async () => {
    await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: 'domestic',
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
  });
  taxpayerViewsDashboard(test);
  taxpayerSignsOut(test);

  practitionerLogin(test);
  practitionerSearchesForNonexistentCase(test);
  practitionerViewsDashboardBeforeAddingCase(test);
  practitionerSearchesForCase(test);
  practitionerViewsCaseDetail(test);
  practitionerRequestsAccessToCase(test, fakeFile);
  practitionerViewsDashboard(test);
  practitionerViewsCaseDetailOfOwnedCase(test);
  practitionerFilesDocumentForOwnedCase(test, fakeFile);
  practitionerSignsOut(test);

  //tests for practitioner requesting access to existing case
  //taxpayer must first create a case for practitioner to request access to
  taxpayerLogin(test);
  taxpayerViewsDashboard(test);
  it('Create test case #2', async () => {
    await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: 'domestic',
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
  });
  taxpayerViewsDashboard(test);
  taxpayerSignsOut(test);

  practitionerLogin(test);
  practitionerSearchesForCase(test);
  practitionerViewsCaseDetail(test);
  practitionerRequestsPendingAccessToCase(test, fakeFile);
  practitionerViewsCaseDetailOfPendingCase(test);
  practitionerSignsOut(test);
});
