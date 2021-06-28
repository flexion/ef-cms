import { fakeFile } from '../helpers';

export const respondentUploadsProposedStipulatedDecision = integrationTest => {
  return it('respondent uploads a proposed stipulated decision', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    integrationTest.setState('form', {
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
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 115022,
      privatePractitioners: [],
      scenario: 'Standard',
      searchError: false,
    });
    await integrationTest.runSequence('submitExternalDocumentSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
  });
};
