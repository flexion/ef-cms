import { docketClerkUpdatesCaseCaption } from './journey/docketClerkUpdatesCaseCaption';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCancelsCreateCase } from './journey/petitionerCancelsCreateCase';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCaseTestAllOptions } from './journey/petitionerCreatesNewCaseTestAllOptions';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkAssignsWorkItemToOther } from './journey/petitionsClerkAssignsWorkItemToOther';
import { petitionsClerkAssignsWorkItemToSelf } from './journey/petitionsClerkAssignsWorkItemToSelf';
import { petitionsClerkCaseSearch } from './journey/petitionsClerkCaseSearch';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkUpdatesCaseDetail } from './journey/petitionsClerkUpdatesCaseDetail';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsWorkQueue } from './journey/petitionsClerkViewsWorkQueue';
import { petitionsClerkViewsWorkQueueAfterReassign } from './journey/petitionsClerkViewsWorkQueueAfterReassign';
import { respondentAddsAnswer } from './journey/respondentAddsAnswer';
import { respondentAddsMotion } from './journey/respondentAddsMotion';
import { respondentAddsStipulatedDecision } from './journey/respondentAddsStipulatedDecision';
import { respondentViewsDashboard } from './journey/respondentViewsDashboard';

const integrationTest = setupTest();

describe('Case journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerCancelsCreateCase(integrationTest);
  petitionerChoosesProcedureType(integrationTest);
  petitionerChoosesCaseType(integrationTest);
  petitionerCreatesNewCaseTestAllOptions(integrationTest, fakeFile);
  petitionerViewsDashboard(integrationTest);
  petitionerViewsCaseDetail(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCaseSearch(integrationTest);
  petitionsClerkViewsWorkQueue(integrationTest);
  petitionsClerkAssignsWorkItemToSelf(integrationTest);
  petitionsClerkAssignsWorkItemToOther(integrationTest);
  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerkViewsWorkQueueAfterReassign(integrationTest);
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkUpdatesCaseDetail(integrationTest);
  petitionsClerkSubmitsCaseToIrs(integrationTest);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  respondentViewsDashboard(integrationTest);
  respondentAddsAnswer(integrationTest, fakeFile);
  respondentAddsStipulatedDecision(integrationTest, fakeFile);
  respondentAddsMotion(integrationTest, fakeFile);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsCaseDetail(integrationTest);
  docketClerkUpdatesCaseCaption(integrationTest);
});
