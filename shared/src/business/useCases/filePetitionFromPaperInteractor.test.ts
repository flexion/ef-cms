import { PDF } from '../entities/documents/PDF';
import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { filePetitionFromPaperInteractor } from './filePetitionFromPaperInteractor';

describe('filePetitionFromPaperInteractor', () => {
  const file: Blob = new Blob(['abc']);
  const pdf: PDF = new PDF(file);

  applicationContext
    .getUseCases()
    .uploadDocumentAndMakeSafeInteractor.mockResolvedValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

  it('should throw an error when a null user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(null);

    await expect(
      filePetitionFromPaperInteractor(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('should throw an error when an unauthorized user tries to access the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsPractitioner,
      userId: 'irsPractitioner',
    });

    await expect(
      filePetitionFromPaperInteractor(applicationContext, {
        petitionFile: null,
        petitionMetadata: null,
      } as any),
    ).rejects.toThrow();
  });

  it('calls upload on a Petition file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: pdf,
      petitionMetadata: null,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(pdf.file);
  });

  it('calls upload on an Application for Waiver of Filing Fee file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFile: pdf,
      petitionFile: pdf,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[0][1].document,
    ).toEqual(pdf.file);
  });

  it('calls upload on an CDS file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      corporateDisclosureFile: pdf,
      petitionFile: pdf,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(pdf.file);
  });

  it('calls upload on a STIN file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: pdf,
      stinFile: pdf,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(pdf.file);
  });

  it('calls upload on a Request for Place of Trial file', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });

    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: pdf,
      requestForPlaceOfTrialFile: pdf,
    } as any);

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafeInteractor.mock
        .calls[1][1].document,
    ).toEqual(pdf.file);
  });

  it('uploads a Petition file and a STIN file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: pdf,
      petitionMetadata: 'something2',
      stinFile: pdf,
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: undefined,
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Corporate Disclosure Statement file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      corporateDisclosureFile: pdf,
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      corporateDisclosureFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads an Application for Waiver of Filing Fee file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      applicationForWaiverOfFilingFeeFile: pdf,
      petitionFile: 'something1',
      petitionMetadata: 'something2',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      applicationForWaiverOfFilingFeeFileId:
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('uploads a Request for Place of Trial file', async () => {
    await filePetitionFromPaperInteractor(applicationContext, {
      petitionFile: pdf,
      petitionMetadata: 'something2',
      requestForPlaceOfTrialFile: 'something',
      stinFile: 'something3',
    } as any);

    expect(
      applicationContext.getUseCases().createCaseFromPaperInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      petitionFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      requestForPlaceOfTrialFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      stinFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
