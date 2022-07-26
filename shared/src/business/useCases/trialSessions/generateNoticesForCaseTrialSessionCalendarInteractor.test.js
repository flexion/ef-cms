const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  generateNoticesForCaseTrialSessionCalendarInteractor,
} = require('./generateNoticesForCaseTrialSessionCalendarInteractor');
const {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} = require('../../../test/mockCase');
const {
  SERVICE_INDICATOR_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  shouldAppendClinicLetter,
} = require('../../utilities/shouldAppendClinicLetter');
const { copyPagesFromPdf } = require('../../utilities/copyPagesFromPdf');
const { fakeData, getFakeFile } = require('../../test/getFakeFile');
const { MOCK_TRIAL_REGULAR } = require('../../../test/mockTrial');
const { PDFDocument } = require('pdf-lib');

jest.mock('../../utilities/shouldAppendClinicLetter');

describe('generateNoticesForCaseTrialSessionCalendarInteractor', () => {
  let docketNumber,
    trialSession,
    interactorParamObject,
    mockCase,
    servedParties;
  const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
  const clinicLetterPdf = async () => await PDFDocument.load(testPdfDoc);
  const noticeDocumentWithClinicLetter = async () =>
    await PDFDocument.load(testPdfDoc).addPage(clinicLetterPdf);
  const standingPretrialPdf = async () => await PDFDocument.load(testPdfDoc);
  const addressPageDoc = async () => await PDFDocument.load(testPdfDoc);

  const clinicLetterKey = 'I am a key';

  // const noticeDocketEntryEntity = {
  //   docketEntryId: 'noticeDocketEntryId',
  // };

  // const standingPretrialDocketEntryEntity = {
  //   docketEntryId: 'standingPretrialDocketEntryId',
  // };

  beforeAll(() => {
    docketNumber = '101-20';
    // aggregatePartiesForService.mockResolvedValue([]);

    shouldAppendClinicLetter.mockResolvedValue({
      appendClinicLetter: true,
      clinicLetterKey,
    });
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockResolvedValue(noticeDocumentWithClinicLetter);
    const pdfDocumentcreateMock = async () => await PDFDocument.create();
    trialSession = {
      ...MOCK_TRIAL_REGULAR,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    };
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(testPdfDoc);
    applicationContext
      .getDocumentGenerators()
      .addressLabelCoverSheet.mockResolvedValue(testPdfDoc);
    applicationContext
      .getUseCases()
      .generateStandingPretrialOrderInteractor.mockResolvedValue(testPdfDoc);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        create: pdfDocumentcreateMock,
        load: pdfDocumentLoadMock,
      },
    });
    applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor.mockResolvedValue(testPdfDoc);
  });

  beforeEach(() => {
    interactorParamObject = {
      docketNumber,
      jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      trialSession,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };
    applicationContext
      .getPersistenceGateway()
      .getJobStatus.mockResolvedValue({});

    mockCase = MOCK_CASE;
  });

  it('should return and do nothing if the job is already processing', async () => {
    applicationContext.getPersistenceGateway().getJobStatus.mockResolvedValue({
      [docketNumber]: 'processing',
    });
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should track the job status when processing begins', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().setJobAsProcessing,
    ).toHaveBeenCalled();
  });

  it('should decrement the job counter when a worker has processed a pdf file', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getPersistenceGateway().decrementJobCounter,
    ).toHaveBeenCalled();
  });

  it('should combine the notice of trial issued letter to a clinic letter if a clinic letter is necessary', async () => {
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith(expect.objectContaining({ key: clinicLetterKey }));

    expect(applicationContext.getUtilities().combineTwoPdfs).toHaveBeenCalled();

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(2);
  });

  it('should not combine a clinic with a letter of notice of trial if a clinic letter is not needed', async () => {
    shouldAppendClinicLetter.mockResolvedValueOnce({
      appendClinicLetter: false,
    });
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUtilities().combineTwoPdfs,
    ).not.toHaveBeenCalled();

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(1);
  });

  it('should generate a standing pretrial for small cases if the procedure type is Small', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        procedureType: 'Small',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a standing pretrial order for proecedure types other than small', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        procedureType: 'Regular',
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCases().generateStandingPretrialOrderInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases()
        .generateStandingPretrialOrderForSmallCaseInteractor,
    ).not.toHaveBeenCalled();
  });

  // POSSIBLE TEST AREAS
  // A. confirmation of sending of emails for standing pretrial and notice of trial to electronic users

  // B. for parties with paper services,
  //  1. if you're a practitioner, remove the appended clinic letter that was generated
  // implementation: check for the number of pdfs
  //  2. confirm the "package" of combined pdfs === addressPdfPage + noticeDocumentPdfCopy + standingPretrialPdf
  //     // check for the length of the combined pdfs (3)??

  // C. Confirm the 3rd lambda call if there are multiple pages

  it('should send out notifications emails for the notice docket entry AND standing pretrial notice', async () => {
    //
    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        docketEntryId: expect.anything(),
      }),
    );

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        docketEntryId: expect.anything(),
      }),
    );
  });

  // B. for parties with paper services,
  //  1. if you're a practitioner, remove the appended clinic letter that was generated
  // implementation: check for the number of pdfs
  //  2. confirm the "package" of combined pdfs === addressPdfPage + noticeDocumentPdfCopy + standingPretrialPdf
  //     // check for the length of the combined pdfs (3)??

  // it('should not append clinic letter when creating notices for a case with practitioners', async () => {
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getCaseByDocketNumber.mockReturnValue({
  //       ...MOCK_CASE,
  //       petitioners: [
  //         {
  //           ...MOCK_CASE.petitioners[0],
  //           serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  //         },
  //       ],
  //       privatePractitioners: [
  //         {
  //           ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
  //           representing: [MOCK_CASE.petitioners[0].contactId],
  //         },
  //       ],
  //     });

  //   const combinedNoticeAndClinicLetter = await applicationContext
  //     .getUtilities()
  //     .combineTwoPdfs();

  //   console.log(
  //     'combinedNoticeAndClinicLetter length***',
  //     combinedNoticeAndClinicLetter.length,
  //   );

  //   // await copyPagesFromPdf({
  //   //   copyFrom: addressPageDoc,
  //   //   copyInto: combinedDocumentsPdf,
  //   // });

  //   // await copyPagesFromPdf({
  //   //   copyFrom: noticeDocumentPdf,
  //   //   copyInto: combinedDocumentsPdf,
  //   // });

  //   // await copyPagesFromPdf({
  //   //   copyFrom: standingPretrialPdf,
  //   //   copyInto: combinedDocumentsPdf,
  //   // });

  //   // await generateNoticesForCaseTrialSessionCalendarInteractor(
  //   //   applicationContext,
  //   //   interactorParamObject,
  //   // );

  //   // await copyPagesFromPdf({
  //   //   copyFrom: combinedDocumentsPdf,
  //   //   copyInto: newPdfDoc,
  //   // });

  //   // mock/create a notice (with an additional page (clinic letter))
  //   // mock appended letter

  //   // expect(
  //   //   applicationContext.getDocumentGenerators().addressLabelCoverSheet,
  //   // ).toHaveBeenCalledTimes(1);

  //   //   const pdfBlob =
  //   //     applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
  //   //       .calls[2][0].document;
  //   //   const pdf = await PDFDocument.load(pdfBlob);

  //   //   expect(pdf.getPages().length).toBe(2);
  // });

  // C. Confirm the 3rd lambda call if there are multiple pages

  it('should save the final pdf copy of notices, standing pretrial and the address page to S3', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      });

    await generateNoticesForCaseTrialSessionCalendarInteractor(
      applicationContext,
      interactorParamObject,
    );

    const noticeDocumentWithClinicLetterLength =
      noticeDocumentWithClinicLetter.length;

    console.log('page length ***', noticeDocumentWithClinicLetterLength);

    const pdfBlob =
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[2][0].document;
    const pdf = await PDFDocument.load(pdfBlob);

    expect(pdf.getPages().length).toBe(4);
  });

  // it('should append the clinic letter for pro se petitioners', async () => {
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getCaseByDocketNumber.mockReturnValue({
  //       ...MOCK_CASE,
  //       petitioners: [
  //         {
  //           ...MOCK_CASE.petitioners[0],
  //           serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  //         },
  //       ],
  //       privatePractitioners: [],
  //       procedureType: 'Small',
  //     });

  //   await generateNoticesForCaseTrialSessionCalendarInteractor(
  //     applicationContext,
  //     {
  //       docketNumber,
  //       jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //       trialSession,
  //       userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //     },
  //   );

  //   const pdfBlob =
  //     applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
  //       .calls[2][0].document;
  //   const pdf = await PDFDocument.load(pdfBlob);

  //   expect(pdf.getPages().length).toBe(3);
  // });

  // it('should not append clinic letter if the clinic letter is not in s3 for the trial location', async () => {
  //   shouldAppendClinicLetter.mockResolvedValue({ appendClinicLetter: false });
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getCaseByDocketNumber.mockReturnValue({
  //       ...MOCK_CASE,
  //       petitioners: [
  //         {
  //           ...MOCK_CASE.petitioners[0],
  //           serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  //         },
  //       ],
  //       privatePractitioners: [],
  //       procedureType: 'Small',
  //     });

  //   await generateNoticesForCaseTrialSessionCalendarInteractor(
  //     applicationContext,
  //     {
  //       docketNumber,
  //       jobId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //       trialSession,
  //       userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  //     },
  //   );

  //   const pdfBlob =
  //     applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
  //       .calls[2][0].document;
  //   const pdf = await PDFDocument.load(pdfBlob);

  //   expect(pdf.getPages().length).toBe(3);
  // });
});
