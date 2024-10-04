import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';

export const petitionerCancelsCreateCase = cerebralTest => {
  it('petitioner navigates to create case and cancels', async () => {
    await cerebralTest.runSequence('gotoPetitionFlowSequence');
    expect(cerebralTest.getState('modal.showModal')).toBeFalsy();
    expect(cerebralTest.getState('stepIndicatorInfo')).toEqual({
      currentStep: 1,
      steps: {
        1: 'Petitioner Information',
        2: 'Petition',
        3: 'IRS Notice',
        4: 'Case Procedure & Trial Location',
        5: 'Statement of Taxpayer Identification Number',
        6: 'Review & Submit Case',
        7: 'Pay Filing Fee',
      },
    });
    expect(cerebralTest.getState('form')).toEqual({
      filingType: undefined,
      petitionFacts: [''],
      petitionReasons: [''],
      petitionType: PETITION_TYPES.autoGenerated,
      procedureType: 'Regular',
    });

    await cerebralTest.runSequence('updateFilingTypeSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    await cerebralTest.runSequence('formCancelToggleCancelSequence'); // someone clicks cancel
    expect(cerebralTest.getState('modal.showModal')).toBeTruthy();
    await cerebralTest.runSequence('formCancelToggleCancelSequence'); // someone aborts cancellation
    expect(cerebralTest.getState('currentPage')).toEqual('FilePetition');

    await cerebralTest.runSequence('formCancelToggleCancelSequence');
    await cerebralTest.runSequence('closeModalAndReturnToDashboardSequence');
    expect(cerebralTest.getState('modal.showModal')).toBeFalsy();
    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardExternalUser',
    );
  });
};
