import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { contactPrimaryFromState } from '../helpers';
import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';
import { fileDocumentHelper } from '../../src/presenter/computeds/fileDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesAmendedMotion = cerebralTest => {
  return it('petitioner files amended motion', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { docketEntries } = cerebralTest.getState('caseDetail');
    const previousDocument = docketEntries.find(
      document =>
        document.documentTitle ===
        'Motion for Leave to File Out of Time Statement Anything',
    );

    const documentTypeToSelectToFile = {
      category: 'Miscellaneous',
      documentTitle: '[First, Second, etc.] Amended [Document Name]',
      documentType: 'Amended',
      eventCode: 'AMAT',
      ordinalValue: '1',
      previousDocument: previousDocument.docketEntryId,
      scenario: 'Nonstandard F',
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

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('wizardStep')).toEqual('FileDocument');

    const { contactId: contactPrimaryId } =
      contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimaryId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      locationOnForm: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
    });

    const helper = runCompute(withAppContextDecorator(fileDocumentHelper), {
      state: cerebralTest.getState(),
    });

    expect(helper.primaryDocument.showObjection).toEqual(true);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
