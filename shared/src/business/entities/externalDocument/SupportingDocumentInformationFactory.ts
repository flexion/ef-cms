import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

import { JoiValidationConstants } from '../JoiValidationConstants';
import { MAX_FILE_SIZE_BYTES } from '../EntityConstants';
import { includes } from 'lodash';
import { makeRequiredHelper } from './externalDocumentHelpers';
import joi from 'joi';

export class SupportingDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public certificateOfService: boolean;
  public certificateOfServiceDate: string;
  public supportingDocument: any;
  public supportingDocumentFile: object;
  public supportingDocumentFileSize?: number;
  public supportingDocumentFreeText: string;

  private supportingDocumentValidationRules: object;

  constructor(rawProps, validationRules) {
    super('SupportingDocumentInformationFactory');
    this.attachments = rawProps.attachments || false;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.supportingDocument = rawProps.supportingDocument;
    this.supportingDocumentFile = rawProps.supportingDocumentFile;
    this.supportingDocumentFileSize = rawProps.supportingDocumentFileSize;
    this.supportingDocumentFreeText = rawProps.supportingDocumentFreeText;

    this.supportingDocumentValidationRules = validationRules;
  }

  getValidationRules() {
    let schema = {
      attachments: joi.boolean().required(),
      certificateOfService: joi.boolean().required(),
      supportingDocument: JoiValidationConstants.STRING.required(),
    };

    let schemaOptionalItems = {
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
      supportingDocumentFile: joi.object(),
      supportingDocumentFileSize: joi
        .number()
        .optional()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer(),
      supportingDocumentFreeText: JoiValidationConstants.STRING,
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    if (this.certificateOfService === true) {
      makeRequired('certificateOfServiceDate');
    }

    const supportingDocumentFreeTextCategories = [
      'Affidavit in Support',
      'Declaration in Support',
      'Unsworn Declaration under Penalty of Perjury in Support',
    ];
    const supportingDocumentFileCategories = [
      'Memorandum in Support',
      'Brief in Support',
      'Affidavit in Support',
      'Declaration in Support',
      'Unsworn Declaration under Penalty of Perjury in Support',
    ];

    if (
      includes(supportingDocumentFreeTextCategories, this.supportingDocument)
    ) {
      makeRequired('supportingDocumentFreeText');
    }

    if (includes(supportingDocumentFileCategories, this.supportingDocument)) {
      makeRequired('supportingDocumentFile');
    }

    return schema;
  }

  getErrorToMessageMap() {
    return this.supportingDocumentValidationRules;
  }
}
