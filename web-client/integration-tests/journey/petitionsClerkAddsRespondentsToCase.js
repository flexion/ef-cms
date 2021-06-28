import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsRespondentsToCase = integrationTest => {
  return it('Petitions clerk manually adds multiple irsPractitioners to case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.irsPractitioners')).toEqual([]);

    await integrationTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      integrationTest.getState('validationErrors.respondentSearchError'),
    ).toBeDefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT6789',
    });

    await integrationTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      integrationTest.getState('validationErrors.respondentSearchError'),
    ).toBeUndefined();
    expect(integrationTest.getState('modal.respondentMatches.length')).toEqual(
      1,
    );

    //default selected because there was only 1 match
    let respondentMatch = integrationTest.getState('modal.respondentMatches.0');
    expect(integrationTest.getState('modal.user.userId')).toEqual(
      respondentMatch.userId,
    );

    await integrationTest.runSequence(
      'associateIrsPractitionerWithCaseSequence',
    );

    expect(
      integrationTest.getState('caseDetail.irsPractitioners.length'),
    ).toEqual(1);
    expect(
      integrationTest.getState('caseDetail.irsPractitioners.0.name'),
    ).toEqual(respondentMatch.name);

    let formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(1);
    expect(formatted.irsPractitioners[0].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );

    //add a second respondent
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT0987',
    });
    await integrationTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(integrationTest.getState('modal.respondentMatches.length')).toEqual(
      1,
    );
    respondentMatch = integrationTest.getState('modal.respondentMatches.0');
    expect(integrationTest.getState('modal.user.userId')).toEqual(
      respondentMatch.userId,
    );

    await integrationTest.runSequence(
      'associateIrsPractitionerWithCaseSequence',
    );
    expect(
      integrationTest.getState('caseDetail.irsPractitioners.length'),
    ).toEqual(2);
    expect(
      integrationTest.getState('caseDetail.irsPractitioners.1.name'),
    ).toEqual(respondentMatch.name);

    formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(2);
    expect(formatted.irsPractitioners[1].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );
  });
};
