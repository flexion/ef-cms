import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUpdatesCaseStatusToReadyForTrial = integrationTest => {
  return it('Docket clerk updates case status to General Docket - At Issue (Ready for Trial)', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber:
        integrationTest.docketNumberDifferentPlaceOfTrial ||
        integrationTest.docketNumber,
    });

    const currentStatus = integrationTest.getState('caseDetail.status');

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(integrationTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocket,
    });

    await integrationTest.runSequence('clearModalSequence');

    expect(integrationTest.getState('caseDetail.status')).toEqual(
      currentStatus,
    );
    expect(integrationTest.getState('modal')).toEqual({});

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(integrationTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    await integrationTest.runSequence('submitUpdateCaseModalSequence');

    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );
    expect(integrationTest.getState('modal')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
