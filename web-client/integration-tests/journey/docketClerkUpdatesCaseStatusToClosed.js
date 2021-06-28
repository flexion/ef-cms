import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUpdatesCaseStatusToClosed = integrationTest => {
  return it('Docket clerk updates case status to closed', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const currentStatus = integrationTest.getState('caseDetail.status');

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(integrationTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.closed,
    });

    await integrationTest.runSequence('submitUpdateCaseModalSequence');

    await refreshElasticsearchIndex();

    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.closed,
    );

    expect(integrationTest.getState('modal')).toEqual({});
  });
};
