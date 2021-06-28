import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';

import { docketClerkAddEditsCalendarNote } from './journey/docketClerkAddEditsCalendarNote';
import { docketClerkDeletesCalendarNote } from './journey/docketClerkDeletesCalendarNote';
import { docketClerkViewsTrialSessionWithNote } from './journey/docketClerkViewsTrialSessionWithNote';
import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();

describe('case trial calendar notes journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation1 = `Boulder, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };

  integrationTest.createdTrialSessions = [];

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, overrides1);
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkViewsNewTrialSession(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  it('creates a case', async () => {
    const caseDetail = await uploadPetition(integrationTest, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithoutNote(integrationTest);
  docketClerkViewsTrialSessionWithNote(integrationTest);

  docketClerkAddEditsCalendarNote(integrationTest, 'adds');
  docketClerkViewsTrialSessionWithNote(integrationTest);
  docketClerkAddEditsCalendarNote(integrationTest, 'edits');
  docketClerkDeletesCalendarNote(integrationTest);

  docketClerkViewsTrialSessionWithNote(integrationTest);
});
