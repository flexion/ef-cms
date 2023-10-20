import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardG', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentG = ExternalDocumentFactory({
        scenario: 'Nonstandard G',
      });
      const customMessages = extractCustomMessages(
        externalDocumentG.getValidationRules(),
      );
      expect(externalDocumentG.getFormattedValidationErrors()).toEqual({
        category: customMessages.category[0],
        documentType: customMessages.documentType[0],
        ordinalValue: customMessages.ordinalValue[0],
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: getTextByCount(3001),
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      const customMessages = extractCustomMessages(
        externalDocumentG.getValidationRules(),
      );
      expect(externalDocumentG.getFormattedValidationErrors()).toEqual({
        documentTitle: customMessages.documentTitle[0],
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: '1',
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getDocumentTitle()).toEqual(
        'First Amendment to Answer',
      );
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'Other',
        otherIteration: 50,
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getDocumentTitle()).toEqual(
        'Fiftieth Amendment to Answer',
      );
    });
  });
});
