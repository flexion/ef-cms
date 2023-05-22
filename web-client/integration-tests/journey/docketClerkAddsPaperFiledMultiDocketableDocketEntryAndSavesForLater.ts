import { contactPrimaryFromState, waitForCondition } from '../helpers';
import { getFakeBlob } from '../../../shared/src/business/test/getFakeFile';

export const docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater =
  (cerebralTest, eventCode) => {
    const answerFilingOptions = [
      {
        key: 'dateReceivedMonth',
        value: 4,
      },
      {
        key: 'dateReceivedDay',
        value: 30,
      },
      {
        key: 'dateReceivedYear',
        value: 2001,
      },
      {
        key: 'eventCode',
        value: eventCode,
      },
    ];

    return it('Docket clerk adds paper filed multi-docketable document and saves for later', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      for (const option of answerFilingOptions) {
        await cerebralTest.runSequence(
          'updateDocketEntryFormValueSequence',
          option,
        );
      }

      await cerebralTest.runSequence('validateFileInputSequence', {
        file: getFakeBlob(),
        theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
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

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'CaseDetailInternal',
      });

      cerebralTest.multiDocketedDocketEntryId = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(doc => doc.eventCode === eventCode).docketEntryId;
    });
  };
