import { Case } from '../../../shared/src/business/entities/cases/Case';
import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PAYMENT_STATUS } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesPetitionPaymentFeeOptions = (
  integrationTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies petition payment fee options and required fields', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'StartCaseInternal',
    );

    expect(
      integrationTest.getState('form.petitionPaymentStatus'),
    ).toBeUndefined();

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.PAID,
      },
    );

    expect(integrationTest.getState('form.orderForFilingFee')).toEqual(false);

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(integrationTest.getState('validationErrors')).toMatchObject({
      petitionPaymentDate: Case.VALIDATION_ERROR_MESSAGES.petitionPaymentDate,
      petitionPaymentMethod:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentMethod,
    });

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateDay',
        value: '01',
      },
    );
    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateMonth',
        value: '01',
      },
    );
    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateYear',
        value: '2001',
      },
    );
    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'petitionPaymentMethod',
        value: 'check',
      },
    );

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.UNPAID,
      },
    );

    expect(integrationTest.getState('form.orderForFilingFee')).toEqual(true);

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.petitionPaymentDate'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('validationErrors.petitionPaymentMethod'),
    ).toBeUndefined();

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.WAIVED,
      },
    );

    expect(integrationTest.getState('form.orderForFilingFee')).toEqual(false);

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(integrationTest.getState('validationErrors')).toMatchObject({
      applicationForWaiverOfFilingFeeFile:
        CaseInternal.VALIDATION_ERROR_MESSAGES
          .applicationForWaiverOfFilingFeeFile,
      petitionPaymentWaivedDate:
        Case.VALIDATION_ERROR_MESSAGES.petitionPaymentWaivedDate,
    });

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateWaivedDay',
        value: '02',
      },
    );
    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateWaivedMonth',
        value: '02',
      },
    );
    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'paymentDateWaivedYear',
        value: '2002',
      },
    );
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    });

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.petitionPaymentWaivedDate'),
    ).toBeUndefined();
  });
};
