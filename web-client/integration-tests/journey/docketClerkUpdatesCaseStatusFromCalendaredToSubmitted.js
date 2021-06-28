import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkUpdatesCaseStatusFromCalendaredToSubmitted =
  integrationTest => {
    return it('Docket clerk updates case status from Calendared to Submitted with an associated judge', async () => {
      integrationTest.setState('caseDetail', {});

      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.calendared,
      );

      await integrationTest.runSequence('openUpdateCaseModalSequence');

      expect(integrationTest.getState('modal.showModal')).toEqual(
        'UpdateCaseModalDialog',
      );

      expect(integrationTest.getState('modal.caseStatus')).toEqual(
        CASE_STATUS_TYPES.calendared,
      );

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'caseStatus',
        value: CASE_STATUS_TYPES.submitted,
      });

      expect(integrationTest.getState('modal.caseStatus')).toEqual(
        CASE_STATUS_TYPES.submitted,
      );

      // the current judge on the case is selected by default.
      // set to empty string to test validation
      expect(integrationTest.getState('modal.associatedJudge')).toEqual(
        'Cohen',
      );
      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: '',
      });

      await integrationTest.runSequence('submitUpdateCaseModalSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({
        associatedJudge: 'Select an associated judge',
      });

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'associatedJudge',
        value: 'Judge Buch',
      });

      await integrationTest.runSequence('submitUpdateCaseModalSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      expect(integrationTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.submitted,
      );
      expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
        'Judge Buch',
      );
      expect(integrationTest.getState('modal')).toEqual({});
    });
  };
