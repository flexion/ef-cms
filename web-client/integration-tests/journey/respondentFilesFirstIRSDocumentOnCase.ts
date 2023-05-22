import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactSecondaryFromState } from '../helpers';
import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';
import { fileDocumentHelper as fileDocumentHelperComputed } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const respondentFilesFirstIRSDocumentOnCase = cerebralTest => {
  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderHelperComputed,
  );
  const fileDocumentHelper = withAppContextDecorator(
    fileDocumentHelperComputed,
  );

  return it('Respondent files first IRS document on a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showFileFirstDocumentButton).toBeTruthy();

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const fileDocHelper = runCompute(fileDocumentHelper, {
      state: cerebralTest.getState(),
    });

    expect(fileDocHelper.showSecondaryParty).toBeTruthy();
    expect(contactSecondaryFromState(cerebralTest).name).toEqual(
      'Jimothy Schultz',
    );

    const documentTypeToSelectToFile = {
      category: 'Answer (filed by respondent only)',
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      scenario: 'Standard',
    };

    for (const [key, value] of Object.entries(documentTypeToSelectToFile)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual('Answer');
    expect(cerebralTest.getState('form.partyPrimary')).toEqual(undefined);

    const documentToFileDetails = {
      attachments: false,
      certificateOfService: true,
      certificateOfServiceDay: '12',
      certificateOfServiceMonth: '12',
      certificateOfServiceYear: '2000',
      hasSupportingDocuments: false,
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      partyIrsPractitioner: true,
    };

    for (const [key, value] of Object.entries(documentToFileDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      locationOnForm: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
