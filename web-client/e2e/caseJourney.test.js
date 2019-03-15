import { CASE_CAPTION_POSTFIX } from '../../shared/src/business/entities/Case';
import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';
import applicationContext from '../src/applicationContext';
import docketClerkAssignWorkItems from './journey/docketClerkAssignWorkItems';
import docketClerkDocketDashboard from './journey/docketClerkDocketDashboard';
import docketClerkForwardWorkItem from './journey/docketClerkForwardWorkItem';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSelectsAssignee from './journey/docketClerkSelectsAssignee';
import docketClerkStartsNewMessageThreadOnAnswer from './journey/docketClerkStartsNewMessageThreadOnAnswer';
import docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney from './journey/docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney';
import docketClerkSelectsWorkItems from './journey/docketClerkSelectsWorkItems';
import docketClerkViewsCaseDetail from './journey/docketClerkViewsCaseDetail';
import docketClerkViewsDashboard from './journey/docketClerkViewsDashboard';
import docketClerkViewsDashboardAfterForward from './journey/docketClerkViewsDashboardAfterForward';
import docketClerkViewsOutboxAfterForward from './journey/docketClerkViewsOutboxAfterForward';
import docketClerkViewsDashboardWithoutWorkItem from './journey/docketClerkViewsDashboardWithoutWorkItem';
import docketClerkViewsDecisionDocument from './journey/docketClerkViewsDecisionDocument';
import docketClerkViewsDocument from './journey/docketClerkViewsDocument';
import petitionsClerkAssignsWorkItemToOther from './journey/petitionsClerkAssignsWorkItemToOther';
import petitionsClerkAssignsWorkItemToSelf from './journey/petitionsClerkAssignsWorkItemToSelf';
import petitionsClerkCaseSearch from './journey/petitionsClerkCaseSearch';
import petitionsClerkIrsHoldingQueue from './journey/petitionsClerkIrsHoldingQueue';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkUpdatesCaseCaption from './journey/petitionsClerkUpdatesCaseCaption';
import petitionsClerkUpdatesCaseDetail from './journey/petitionsClerkUpdatesCaseDetail';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsDashboard from './journey/petitionsClerkViewsDashboard';
import petitionsClerkViewsDashboardAfterReassign from './journey/petitionsClerkViewsDashboardAfterReassign';
import presenter from '../src/presenter';
import respondentAddsAnswer from './journey/respondentAddsAnswer';
import respondentAddsStipulatedDecisions from './journey/respondentAddsStipulatedDecisions';
import respondentLogIn from './journey/respondentLogIn';
import respondentViewsCaseDetail from './journey/respondentViewsCaseDetail';
import respondentViewsDashboard from './journey/respondentViewsDashboard';
import seniorAttorneyLogIn from './journey/seniorAttorneyLogIn';
import seniorAttorneyMarksStipulatedWorkItemAsCompleted from './journey/seniorAttorneyMarksStipulatedWorkItemAsCompleted';
import seniorAttorneyViewsCaseDetail from './journey/seniorAttorneyViewsCaseDetail';
import seniorAttorneyViewsCaseDetailAfterComplete from './journey/seniorAttorneyViewsCaseDetailAfterComplete';
import seniorAttorneyViewsDashboard from './journey/seniorAttorneyViewsDashboard';
import seniorAttorneyViewsDashboardAfterComplete from './journey/seniorAttorneyViewsDashboardAfterComplete';
import seniorAttorneyViewsDocumentDetail from './journey/seniorAttorneyViewsDocumentDetail';
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerCancelsCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerViewsCaseDetail from './journey/taxpayerViewsCaseDetail';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
const {
  PARTY_TYPES,
  COUNTRY_TYPES,
} = require('../../shared/src/business/entities/contacts/PetitionContact');

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = new Buffer(fakeData, 'base64', {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Case journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX,
      COUNTRY_TYPES,
      PARTY_TYPES,
      TRIAL_CITIES,
    });
  });

  taxpayerLogin(test);
  taxpayerCancelsCreateCase(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerViewsCaseDetail(test);
  taxPayerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkCaseSearch(test);
  petitionsClerkViewsDashboard(test);
  petitionsClerkAssignsWorkItemToSelf(test);
  petitionsClerkAssignsWorkItemToOther(test);
  petitionsClerkLogIn(test, 'petitionsclerk1');
  petitionsClerkViewsDashboardAfterReassign(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkUpdatesCaseDetail(test);
  petitionsClerkUpdatesCaseCaption(test);
  petitionsClerkSubmitsCaseToIrs(test);
  petitionsClerkIrsHoldingQueue(test);

  respondentLogIn(test);
  respondentViewsDashboard(test);
  respondentViewsCaseDetail(test);
  respondentAddsAnswer(test, fakeFile);
  respondentAddsStipulatedDecisions(test, fakeFile);

  docketClerkLogIn(test);
  docketClerkViewsDashboardWithoutWorkItem(test);
  docketClerkViewsCaseDetail(test);
  docketClerkViewsDecisionDocument(test);
  docketClerkStartsNewMessageThreadOnAnswer(test);
  docketClerkStartsNewMessageThreadOnStipulatedDecisionToSeniorAttorney(test);

  docketClerkLogIn(test, 'docketclerk1');
  docketClerkDocketDashboard(test);
  docketClerkSelectsAssignee(test);
  docketClerkSelectsWorkItems(test);
  docketClerkAssignWorkItems(test);
  docketClerkLogIn(test);
  docketClerkViewsDashboard(test);
  docketClerkViewsDocument(test);
  docketClerkForwardWorkItem(test);
  docketClerkViewsDashboardAfterForward(test);
  docketClerkViewsOutboxAfterForward(test);

  seniorAttorneyLogIn(test);
  seniorAttorneyViewsDashboard(test);
  seniorAttorneyViewsCaseDetail(test);
  seniorAttorneyViewsDocumentDetail(test);
  seniorAttorneyMarksStipulatedWorkItemAsCompleted(test);
  seniorAttorneyViewsCaseDetailAfterComplete(test);
  seniorAttorneyViewsDashboardAfterComplete(test);
});
