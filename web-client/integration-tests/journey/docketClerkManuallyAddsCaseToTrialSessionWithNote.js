export const docketClerkManuallyAddsCaseToTrialSessionWithNote =
  integrationTest => {
    return it('docket clerk manually adds case to trial session with a note', async () => {
      const mockTestNote = 'test note';

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

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'calendarNotes',
        value: mockTestNote,
      });

      await integrationTest.runSequence('addCaseToTrialSessionSequence');

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.createdTrialSessions[0],
      });

      const caseOrder = integrationTest.getState('trialSession.caseOrder');

      const caseFromCaseOrder = caseOrder.find(
        c => c.docketNumber === integrationTest.docketNumber,
      );

      expect(caseFromCaseOrder.calendarNotes).toEqual(mockTestNote);
      integrationTest.calendarNote = mockTestNote;
    });
  };
