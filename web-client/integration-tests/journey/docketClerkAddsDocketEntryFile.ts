import { getFakeBlob } from '../../../shared/src/business/test/getFakeFile';

export const docketClerkAddsDocketEntryFile = cerebralTest => {
  return it('Adds a file to the current docket record form', async () => {
    await cerebralTest.runSequence('validateFileInputSequence', {
      file: getFakeBlob(),
      theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
    });
  });
};
