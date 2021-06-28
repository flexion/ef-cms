import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const judgeViewsTrialSessionWorkingCopy = (
  integrationTest,
  checkCase,
  calendarNote,
) => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('Judge views trial session working copy', async () => {
    await integrationTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: integrationTest.getState(),
      },
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
    expect(
      integrationTest.getState('trialSessionWorkingCopy.trialSessionId'),
    ).toEqual(integrationTest.trialSessionId);
    expect(
      integrationTest.getState('trialSessionWorkingCopy.filters.showAll'),
    ).toEqual(true);
    expect(integrationTest.getState('trialSessionWorkingCopy.sort')).toEqual(
      DOCKET_SECTION,
    );
    expect(
      integrationTest.getState('trialSessionWorkingCopy.sortOrder'),
    ).toEqual('asc');
    expect(integrationTest.getState('trialSession.caseOrder').length).toEqual(
      1,
    );

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == integrationTest.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
