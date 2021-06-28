export const docketClerkManuallyAddsCaseToTrialSessionWithoutNote =
  integrationTest => {
    return it('Docket Clerk manually adds case to trial session without a note', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      await integrationTest.runSequence('openAddToTrialModalSequence');

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'showAllLocations',
        value: true,
      });

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'trialSessionId',
        value: integrationTest.createdTrialSessions[0],
      });

      await integrationTest.runSequence('addCaseToTrialSessionSequence');

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.createdTrialSessions[0],
      });

      const caseOrder = integrationTest.getState('trialSession.caseOrder');

      const caseFromCaseOrder = caseOrder.find(
        c => c.docketNumber === integrationTest.docketNumber,
      );

      expect(caseFromCaseOrder.calendarNotes).toBe(undefined);
      integrationTest.calendarNote = undefined;
    });
  };
