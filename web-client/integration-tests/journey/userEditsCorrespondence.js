import { fakeFile1 } from '../helpers';
import axios from 'axios';

export const userEditsCorrespondence = (integrationTest, user) =>
  it(`${user} edits the documentTitle for a correspondence`, async () => {
    const { docketNumber } = integrationTest.getState('caseDetail');
    let docketEntryId = integrationTest.getState('docketEntryId');

    await integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId,
      docketNumber,
      isForIFrame: true,
    });

    let iframeSrc = integrationTest.getState('iframeSrc');
    let response = await axios.get(iframeSrc, { contentType: 'blob' });

    const initialDocumentLength = response.data.length;

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My edited correspondence',
    });

    await integrationTest.runSequence('clearExistingDocumentSequence');
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile1,
    });

    await integrationTest.runSequence('editCorrespondenceDocumentSequence');

    response = await axios.get(iframeSrc, { contentType: 'blob' });
    const updatedDocumentLength = response.data.length;

    expect(initialDocumentLength).not.toEqual(updatedDocumentLength);

    expect(integrationTest.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          correspondenceId:
            integrationTest.correspondenceDocument.correspondenceId,
          documentTitle: 'My edited correspondence',
        }),
      ]),
    );
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
  });
