import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionersToCase = (
  integrationTest,
  skipSecondary,
) => {
  return it('Petitions clerk manually adds multiple privatePractitioners to case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const practitionerBarNumber = integrationTest.barNumber || 'PT1234';

    expect(integrationTest.getState('caseDetail.privatePractitioners')).toEqual(
      [],
    );

    await integrationTest.runSequence(
      'openAddPrivatePractitionerModalSequence',
    );

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await integrationTest.runSequence(
      'openAddPrivatePractitionerModalSequence',
    );

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('modal.practitionerMatches.length'),
    ).toEqual(1);

    //default selected because there was only 1 match
    let practitionerMatch = integrationTest.getState(
      'modal.practitionerMatches.0',
    );
    expect(integrationTest.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });
    const contactPrimary = formattedCase.petitioners[0];

    await integrationTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });

    if (integrationTest.intervenorContactId) {
      await integrationTest.runSequence('updateModalValueSequence', {
        key: `representingMap.${integrationTest.intervenorContactId}`,
        value: true,
      });
    }

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await integrationTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    expect(
      integrationTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(1);
    expect(
      integrationTest.getState(
        'caseDetail.privatePractitioners.0.representing',
      ),
    ).toContain(contactPrimary.contactId);

    if (integrationTest.intervenorContactId) {
      expect(
        integrationTest.getState(
          'caseDetail.privatePractitioners.0.representing',
        ),
      ).toContain(integrationTest.intervenorContactId);
    }

    expect(
      integrationTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual(practitionerMatch.name);

    let formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    integrationTest.privatePractitioners = formatted.privatePractitioners[0];

    //add a second practitioner
    if (!skipSecondary) {
      await integrationTest.runSequence('updateFormValueSequence', {
        key: 'practitionerSearch',
        value: 'PT5432',
      });
      await integrationTest.runSequence(
        'openAddPrivatePractitionerModalSequence',
      );

      expect(
        integrationTest.getState('modal.practitionerMatches.length'),
      ).toEqual(1);
      practitionerMatch = integrationTest.getState(
        'modal.practitionerMatches.0',
      );
      expect(integrationTest.getState('modal.user.userId')).toEqual(
        practitionerMatch.userId,
      );

      const contactSecondary = formattedCase.petitioners[1];
      await integrationTest.runSequence('updateModalValueSequence', {
        key: `representingMap.${contactSecondary.contactId}`,
        value: true,
      });

      await integrationTest.runSequence(
        'associatePrivatePractitionerWithCaseSequence',
      );
      expect(
        integrationTest.getState('caseDetail.privatePractitioners.length'),
      ).toEqual(2);
      expect(
        integrationTest.getState(
          'caseDetail.privatePractitioners.1.representing',
        ),
      ).toEqual([contactSecondary.contactId]);
      expect(
        integrationTest.getState('caseDetail.privatePractitioners.1.name'),
      ).toEqual(practitionerMatch.name);

      formatted = runCompute(formattedCaseDetail, {
        state: integrationTest.getState(),
      });

      expect(formatted.privatePractitioners.length).toEqual(2);
      expect(formatted.privatePractitioners[1].formattedName).toEqual(
        `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
      );

      await refreshElasticsearchIndex();
    }
  });
};
