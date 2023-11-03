import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class CourtIssuedDocumentTypeC extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public docketNumbers?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeC');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.docketNumbers = rawProps.docketNumbers;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    docketNumbers: JoiValidationConstants.STRING.max(500).required(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return replaceBracketed(this.documentTitle, this.docketNumbers);
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeC.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES_NEW,
    docketNumbers: JoiValidationConstants.STRING.max(500).required().messages({
      'any.required': 'Enter docket number(s)',
      'string.max': 'Limit is 500 characters. Enter 500 or fewer characters.',
    }),
  };

  getValidationRules_NEW() {
    return CourtIssuedDocumentTypeC.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeC.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeC =
  ExcludeMethods<CourtIssuedDocumentTypeC>;
