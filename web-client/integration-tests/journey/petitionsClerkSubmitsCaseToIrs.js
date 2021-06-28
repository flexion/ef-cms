import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export const petitionsClerkSubmitsCaseToIrs = integrationTest => {
  return it('Petitions clerk submits case to IRS', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDay',
      value: '24',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsMonth',
      value: '12',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
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

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      irsNoticeDate: VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});
    await integrationTest.runSequence('serveCaseToIrsSequence');

    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    // check that save occurred
    expect(integrationTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T05:00:00.000Z',
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    //check that documents were served
    const documents = integrationTest.getState('caseDetail.docketEntries');
    for (const document of documents) {
      if (!document.isMinuteEntry) {
        expect(document.servedAt).toBeDefined();
      }
    }
  });
};
