const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  JURISDICTIONAL_OPTIONS,
  MOTION_DISPOSITIONS,
  PARTY_TYPES,
} = require('../../entities/EntityConstants');
const { coverSheet } = require('./coverSheet');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { Stamp } = require('../../entities/Stamp');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('coverSheet', () => {
    it('Generates a CoverSheet document', async () => {
      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          certificateOfService: true,
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          dateReceived: '01/02/20',
          dateServed: '01/03/20',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
          electronicallyFiled: true,
          index: 10,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('CoverSheet', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });

    it('Generates a CoverSheet document for court issued documents that require a coversheet', async () => {
      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('CourtIssuedDocumentCoverSheet', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });

    it('Generates a CoverSheet document for a docket entry that is part of a consolidated case group', async () => {
      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          consolidatedCases: new Array(38).fill(null).map((v, i) => ({
            docketNumber: `${24929 + i}-17`,
            documentNumber: i + 101,
          })),
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Cover_Sheet_For_Consolidated_Cases', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('stamped coverSheet', () => {
    it('Generates a stamped CoverSheet document', async () => {
      const stamp = new Stamp({
        customText: 'Custom stamp data text',
        date: '2022-07-27T04:00:00.000Z',
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: MOTION_DISPOSITIONS.DENIED,
        dueDateMessage: 'The parties shall file a status report by',
        jurisdictionalOption: JURISDICTIONAL_OPTIONS.restoredToDocket,
        nameForSigning: 'Buch',
        nameForSigningLine2: 'Judge',
        strickenFromTrialSession: true,
      });

      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          certificateOfService: true,
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          dateReceived: '01/02/20',
          dateServed: '01/03/20',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
          electronicallyFiled: true,
          index: 10,
          stamp,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('StampedCoverSheet', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
