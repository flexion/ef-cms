import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  getSectionInboxCount,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkManuallyAddsCaseToCalendaredTrialSession } from './journey/petitionsClerkManuallyAddsCaseToCalendaredTrialSession';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const integrationTest = setupTest();

describe('JUDGE and ADC DOC QC: Work Item Filtering', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  integrationTest.createdCases = [];
  let judgeDocketSectionQCInboxCountBefore;
  let adcDocketSectionQCInboxCountBefore;

  loginAs(integrationTest, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(integrationTest);
    judgeDocketSectionQCInboxCountBefore =
      getSectionInboxCount(integrationTest);
  });

  loginAs(integrationTest, 'adc@example.com');
  it("Get adc's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(integrationTest);
    adcDocketSectionQCInboxCountBefore = getSectionInboxCount(integrationTest);
  });

  loginAs(integrationTest, 'petitioner@example.com');
  for (let index = 0; index <= 2; index++) {
    it(`Create case ${index}`, async () => {
      const caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.createdCases.push(caseDetail.docketNumber);
      integrationTest.docketNumber = caseDetail.docketNumber;
    });
    petitionerFilesADocumentForCase(integrationTest, fakeFile);
  }

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest);
  docketClerkViewsTrialSessionList(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(integrationTest, 0);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(integrationTest, 1);

  loginAs(integrationTest, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(integrationTest);
    const judgeDocketSectionQCInboxCountAfter =
      getSectionInboxCount(integrationTest);
    expect(judgeDocketSectionQCInboxCountAfter).toBe(
      judgeDocketSectionQCInboxCountBefore + 2,
    );
  });

  loginAs(integrationTest, 'adc@example.com');
  it("Get adc's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(integrationTest);
    const adcDocketSectionQCInboxCountAfter =
      getSectionInboxCount(integrationTest);
    expect(adcDocketSectionQCInboxCountAfter).toBe(
      adcDocketSectionQCInboxCountBefore + 1,
    );
  });
});
