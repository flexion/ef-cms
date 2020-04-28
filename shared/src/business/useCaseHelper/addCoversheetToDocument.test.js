const fs = require('fs');
const path = require('path');
const { addCoversheetToDocument } = require('./addCoversheetToDocument.js');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { getChromiumBrowser } = require('../utilities/getChromiumBrowser');
const { PDFDocument } = require('pdf-lib');

describe('addCoversheetToDocument', () => {
  const testAssetsPath = path.join(__dirname, '../../../test-assets/');
  const testOutputPath = path.join(__dirname, '../../../test-output/');

  const testPdfDocBytes = () => {
    // sample.pdf is a 1 page document
    return fs.readFileSync(testAssetsPath + 'sample.pdf');
  };

  const testPdfDoc = testPdfDocBytes();

  const testingCaseData = {
    caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    contactPrimary: {
      name:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
    },
    createdAt: '2019-04-19T14:45:15.595Z',
    docketNumber: '101-19',
    documents: [
      {
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: 'pending',
        userId: 'petitionsclerk',
      },
    ],
    partyType: ContactFactory.PARTY_TYPES.petitioner,
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    contactPrimary: {
      name: 'Janie Petitioner',
    },
    contactSecondary: {
      name: 'Janie Petitioner',
    },
    docketNumber: '102-19',
    documents: [
      {
        ...testingCaseData.documents[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
      },
    ],
    irsSendDate: '2019-04-19T14:45:15.595Z',
    partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
  };

  beforeAll(() => {
    jest.setTimeout(60000);

    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(testPdfDoc);

    applicationContext.getChromiumBrowser.mockImplementation(
      async () => await getChromiumBrowser(),
    );
  });

  it('adds a cover page to a pdf document', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(testingCaseData);

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    const newPdfData = await addCoversheetToDocument(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(newPdfDocPages.length).toEqual(2);
    expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(optionalTestingCaseData);
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(({ document: newPdfData }) => {
        fs.writeFileSync(
          testOutputPath + 'addCoverToPDFDocument_2.pdf',
          newPdfData,
        );
      });

    const params = {
      applicationContext,
      caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
    };

    const newPdfData = await addCoversheetToDocument(params);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
