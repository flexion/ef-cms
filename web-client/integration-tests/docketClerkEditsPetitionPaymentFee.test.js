import { CaseQC } from '../../shared/src/business/entities/cases/CaseQC';
import {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();

describe('docket clerk edits a petition payment fee', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;

  loginAs(integrationTest, 'petitioner@example.com');

  it('login as a taxpayer and create a case', async () => {
    caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(integrationTest, 'docketclerk@example.com');

  it('login as the docketclerk and edit the case petition payment fee', async () => {
    await integrationTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    expect(
      integrationTest.getState('caseDetail.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('caseDetail.petitionPaymentStatus'),
    ).toEqual(PAYMENT_STATUS.UNPAID);
    expect(
      integrationTest.getState('caseDetail.docketEntries'),
    ).not.toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await integrationTest.runSequence('updateCaseDetailsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      hasVerifiedIrsNotice:
        CaseQC.VALIDATION_ERROR_MESSAGES.hasVerifiedIrsNotice,
      petitionPaymentDate: CaseQC.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        CaseQC.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await integrationTest.runSequence('updateCaseDetailsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState('caseDetail.petitionPaymentStatus'),
    ).toEqual(PAYMENT_STATUS.PAID);
    expect(integrationTest.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2001-01-01T05:00:00.000Z',
    );

    expect(
      integrationTest
        .getState('caseDetail.docketEntries')
        .find(
          r => r.documentType === MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
        ),
    ).toMatchObject({
      documentTitle: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
      eventCode: 'FEE',
      filingDate: '2001-01-01T05:00:00.000Z',
      index: 3,
    });
  });
});
