import { contactPrimaryFromState, waitForCondition } from '../helpers';
import { getFakeBlob } from '../../../shared/src/business/test/getFakeFile';

export const docketClerkFilesRQTBeforePetitionIsServed = cerebralTest => {
  return it('docket clerk files an initial filing type document AFTER a paper petition is added but not served', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: getFakeBlob(),
      theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });
  });
};
