const moment = require('moment');
const {
  CaseAssociationRequestFactory,
} = require('./CaseAssociationRequestFactory');

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

describe('CaseAssociationRequestFactory', () => {
  let rawEntity;

  const errors = () =>
    CaseAssociationRequestFactory(rawEntity).getFormattedValidationErrors();

  describe('Base', () => {
    beforeEach(() => {
      rawEntity = {};
    });

    it('should require a file', () => {
      expect(errors().primaryDocumentFile).toEqual(
        VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      );
      rawEntity.primaryDocumentFile = {};
      expect(errors().primaryDocumentFile).toEqual(undefined);
    });

    it('should require a certificate Of Service selection', () => {
      expect(errors().certificateOfService).toEqual(
        VALIDATION_ERROR_MESSAGES.certificateOfService,
      );
      rawEntity.certificateOfService = false;
      expect(errors().certificateOfService).toEqual(undefined);
    });

    it('should require document type', () => {
      expect(errors().documentType).toEqual(
        VALIDATION_ERROR_MESSAGES.documentType,
      );
      rawEntity.documentType = 'Entry of Appearance';
      expect(errors().documentType).toEqual(undefined);
    });

    it('should require document title template', () => {
      expect(errors().documentTitleTemplate).toEqual(
        VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      );
      rawEntity.documentTitleTemplate =
        'Entry of Appearance for [Petitioner Names]';
      expect(errors().documentTitleTemplate).toEqual(undefined);
    });

    it('should require event code', () => {
      expect(errors().eventCode).toEqual(VALIDATION_ERROR_MESSAGES.eventCode);
      rawEntity.eventCode = '345';
      expect(errors().eventCode).toEqual(undefined);
    });

    it('should require scenario title', () => {
      expect(errors().scenario).toEqual(VALIDATION_ERROR_MESSAGES.scenario);
      rawEntity.scenario = 'Standard';
      expect(errors().scenario).toEqual(undefined);
    });

    describe('Has Certificate of Service', () => {
      beforeEach(() => {
        rawEntity.certificateOfService = true;
      });

      it('should require certificate of service date to be entered', () => {
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        );
        rawEntity.certificateOfServiceDate = moment().format();
        expect(errors().certificateOfServiceDate).toEqual(undefined);
      });

      it('should not allow certificate of service date to be in the future', () => {
        rawEntity.certificateOfServiceDate = moment()
          .add(1, 'days')
          .format();
        expect(errors().certificateOfServiceDate).toEqual(
          VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
        );
      });
    });

    describe('Substitution of Counsel', () => {
      beforeEach(() => {
        rawEntity.documentTitleTemplate =
          'Substitution of Counsel for [Petitioner Names]';
        rawEntity.documentType = 'Substitution of Counsel';
      });

      it('should require objections be selected', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = 'No';
        expect(errors().objections).toEqual(undefined);
      });
    });

    describe('Motion to Substitute Parties and Change Caption', () => {
      beforeEach(() => {
        rawEntity.documentTitleTemplate =
          'Motion to Substitute Parties and Change Caption';
        rawEntity.documentType =
          'Motion to Substitute Parties and Change Caption';
      });

      it('should require exhibits be selected', () => {
        expect(errors().exhibits).toEqual(VALIDATION_ERROR_MESSAGES.exhibits);
        rawEntity.exhibits = false;
        expect(errors().exhibits).toEqual(undefined);
      });

      it('should require attachments be selected', () => {
        expect(errors().attachments).toEqual(
          VALIDATION_ERROR_MESSAGES.attachments,
        );
        rawEntity.attachments = false;
        expect(errors().attachments).toEqual(undefined);
      });

      it('should require objections be selected', () => {
        expect(errors().objections).toEqual(
          VALIDATION_ERROR_MESSAGES.objections,
        );
        rawEntity.objections = 'No';
        expect(errors().objections).toEqual(undefined);
      });

      it('should require has supporting documents be selected', () => {
        expect(errors().hasSupportingDocuments).toEqual(
          VALIDATION_ERROR_MESSAGES.hasSupportingDocuments,
        );
        rawEntity.hasSupportingDocuments = false;
        expect(errors().hasSupportingDocuments).toEqual(undefined);
      });

      describe('Has supporting documents', () => {
        beforeEach(() => {
          rawEntity.hasSupportingDocuments = true;
        });

        it('should require supporting document', () => {
          expect(errors().supportingDocument).toEqual(
            VALIDATION_ERROR_MESSAGES.supportingDocument,
          );
          rawEntity.supportingDocument = 'Declaration in Support';
          expect(errors().supportingDocument).toEqual(undefined);
        });

        describe('Has file and free text', () => {
          beforeEach(() => {
            rawEntity.supportingDocument = 'Declaration in Support';
          });

          it('should require file', () => {
            expect(errors().supportingDocumentFile).toEqual(
              VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
            );
            rawEntity.supportingDocumentFile = {};
            expect(errors().supportingDocumentFile).toEqual(undefined);
          });

          it('should require free text', () => {
            expect(errors().supportingDocumentFreeText).toEqual(
              VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText,
            );
            rawEntity.supportingDocumentFreeText = 'Lori';
            expect(errors().supportingDocumentFreeText).toEqual(undefined);
          });
        });
      });
    });

    it('should require one of [representingPrimary, representingSecondary] to be selected', () => {
      expect(errors().representingPrimary).toEqual(
        VALIDATION_ERROR_MESSAGES.representingPrimary,
      );
      rawEntity.representingSecondary = true;
      expect(errors().representingPrimary).toEqual(undefined);
    });

    describe('title generation', () => {
      it('should generate valid title for representingPrimary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingPrimary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual('Substitution of Counsel for Petr. Test Petitioner');
      });

      it('should generate valid title for representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingSecondary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual('Substitution of Counsel for Petr. Another Petitioner');
      });

      it('should generate valid title for representingPrimary and representingSecondary', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          representingPrimary: true,
          representingSecondary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual(
          'Substitution of Counsel for Petrs. Test Petitioner & Another Petitioner',
        );
      });

      it('should generate valid title and ignore parties for item without concatenation', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Motion to Substitute Parties and Change Caption',
          documentType: 'Motion to Substitute Parties and Change Caption',
          representingPrimary: true,
          representingSecondary: true,
        });
        expect(
          caseAssoc.getDocumentTitle('Test Petitioner', 'Another Petitioner'),
        ).toEqual('Motion to Substitute Parties and Change Caption');
      });

      it('should generate valid title when party is respondent', () => {
        const caseAssoc = CaseAssociationRequestFactory({
          documentTitleTemplate:
            'Substitution of Counsel for [Petitioner Names]',
          documentType: 'Substitution of Counsel',
          partyRespondent: true,
        });
        expect(caseAssoc.getDocumentTitle()).toEqual(
          'Substitution of Counsel for Respondent',
        );
      });
    });
  });
});
