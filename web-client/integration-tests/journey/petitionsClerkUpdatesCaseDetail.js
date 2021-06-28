import { Case } from '../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = Case;

const { CASE_TYPES_MAP, PAYMENT_STATUS } = applicationContext.getConstants();

export const petitionsClerkUpdatesCaseDetail = integrationTest => {
  return it('Petitions clerk updates case detail', async () => {
    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    // irsNoticeDate - invalid
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: 'twentyoughteight',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[1],
    });

    // irsNoticeDate - valid
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await integrationTest.runSequence('validateCaseDetailSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    // irsNoticeDate - valid
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });

    await integrationTest.runSequence('validateCaseDetailSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.irsNoticeDate')).toEqual(null);

    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    // irsNoticeDate - valid
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2018',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await integrationTest.runSequence('validateCaseDetailSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    // petitionPaymentDate
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      petitionPaymentDate: VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod: VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2018',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '24',
    });
    await integrationTest.runSequence('validateCaseDetailSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    //error on save
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: '',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: '',
    });

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      caseType: VALIDATION_ERROR_MESSAGES.caseType,
      procedureType: VALIDATION_ERROR_MESSAGES.procedureType,
    });
    expect(integrationTest.getState('alertError')).toEqual({
      messages: [
        VALIDATION_ERROR_MESSAGES.caseType,
        VALIDATION_ERROR_MESSAGES.procedureType,
      ],
      title: 'Please correct the following errors on the page:',
    });

    //user changes value and hits save
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });
    //submit and route to case detail
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    await integrationTest.runSequence('navigateToPathSequence', {
      path: `/case-detail/${integrationTest.docketNumber}`,
    });
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
    expect(integrationTest.getState('caseDetail.petitionPaymentDate')).toEqual(
      '2018-12-24T05:00:00.000Z',
    );
  });
};
