import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';

export const respondentUploadsProposedStipulatedDecision = cerebralTest => {
  return it('respondent uploads a proposed stipulated decision', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    cerebralTest.setState('form', {
      attachments: false,
      category: 'Decision',
      certificateOfService: false,
      certificateOfServiceDate: null,
      documentTitle: 'Proposed Stipulated Decision',
      documentType: 'Proposed Stipulated Decision',
      eventCode: 'PSDE',
      hasSecondarySupportingDocuments: false,
      hasSupportingDocuments: false,
      partyIrsPractitioner: true,
      privatePractitioners: [],
      scenario: 'Standard',
      searchError: false,
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
