import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';
import { petitionsClerkUnprioritizesCase } from './journey/petitionsClerkUnprioritizesCase';
import { petitionsClerkVerifyEligibleCase } from './journey/petitionsClerkVerifyEligibleCase';
import { petitionsClerkVerifyNotEligibleCase } from './journey/petitionsClerkVerifyNotEligibleCase';

const integrationTest = setupTest();
let caseDetail;

describe('Docket clerk verifies high priority case is not blocked', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(integrationTest, {
      preferredTrialCity: 'Lubbock, Texas',
    });
    integrationTest.docketNumber = caseDetail.docketNumber;
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsPaperFiledPendingDocketEntryAndServes(
    integrationTest,
    fakeFile,
  );

  it('verify that the high-priority case is not automaticBlocked', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail.automaticBlocked')).toBeFalsy();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkVerifyEligibleCase(integrationTest);
  petitionsClerkUnprioritizesCase(integrationTest);

  it('verify that the non-high-priority case is set to automaticBlocked', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(
      integrationTest.getState('caseDetail.automaticBlocked'),
    ).toBeTruthy();
    expect(integrationTest.getState('caseDetail.automaticBlockedReason')).toBe(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
  });

  petitionsClerkVerifyNotEligibleCase(integrationTest);
});
