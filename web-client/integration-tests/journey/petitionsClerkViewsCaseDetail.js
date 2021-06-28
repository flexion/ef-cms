import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';
import { contactPrimaryFromState } from '../helpers';

export const petitionsClerkViewsCaseDetail = (
  integrationTest,
  expectedDocumentCount = 3,
) => {
  return it('Petitions clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.new,
    );
    expect(integrationTest.getState('caseDetail.docketEntries').length).toEqual(
      expectedDocumentCount,
    );
    expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );

    const caseDetail = integrationTest.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(integrationTest).contactId).toBeDefined();
  });
};
