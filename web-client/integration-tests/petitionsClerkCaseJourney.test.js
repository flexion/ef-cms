import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsDeficiencyStatisticToCase } from './journey/petitionsClerkAddsDeficiencyStatisticToCase';
import { petitionsClerkAddsOtherStatisticsToCase } from './journey/petitionsClerkAddsOtherStatisticsToCase';
import { petitionsClerkCancelsAddingDeficiencyStatisticToCase } from './journey/petitionsClerkCancelsAddingDeficiencyStatisticToCase';
import { petitionsClerkChangesCaseCaptionDuringQC } from './journey/petitionsClerkChangesCaseCaptionDuringQC';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkDeleteDeficiencyStatistic } from './journey/petitionsClerkDeleteDeficiencyStatistic';
import { petitionsClerkDeletesOtherStatisticToCase } from './journey/petitionsClerkDeletesOtherStatisticToCase';
import { petitionsClerkEditOtherStatisticToCase } from './journey/petitionsClerkEditOtherStatisticToCase';
import { petitionsClerkEditsDeficiencyStatistic } from './journey/petitionsClerkEditsDeficiencyStatistic';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox } from './journey/petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox';
import { petitionsClerkVerifiesOrderForOdsCheckbox } from './journey/petitionsClerkVerifiesOrderForOdsCheckbox';
import { petitionsClerkVerifiesPetitionPaymentFeeOptions } from './journey/petitionsClerkVerifiesPetitionPaymentFeeOptions';

const integrationTest = setupTest();

describe('Petitions clerk case journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(integrationTest, fakeFile);
  petitionsClerkVerifiesOrderForOdsCheckbox(integrationTest, fakeFile);
  petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox(
    integrationTest,
    fakeFile,
  );
  petitionsClerkVerifiesPetitionPaymentFeeOptions(integrationTest, fakeFile);

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case #1', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkEditsPetitionInQCIRSNotice(integrationTest);
  petitionsClerkChangesCaseCaptionDuringQC(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case #2', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsDeficiencyStatisticToCase(integrationTest);
  petitionsClerkCancelsAddingDeficiencyStatisticToCase(integrationTest);
  petitionsClerkEditsDeficiencyStatistic(integrationTest);
  petitionsClerkDeleteDeficiencyStatistic(integrationTest);

  petitionsClerkAddsOtherStatisticsToCase(integrationTest);
  petitionsClerkEditOtherStatisticToCase(integrationTest);
  petitionsClerkDeletesOtherStatisticToCase(integrationTest);
});
