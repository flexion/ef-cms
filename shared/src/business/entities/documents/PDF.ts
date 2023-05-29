import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { MAX_FILE_SIZE_MB } from '../EntityConstants';
import joi from 'joi';

export class PDF extends JoiValidationEntity {
  public file: File;
  public name: string;
  public size: number;
  public isEncrypted: boolean;

  constructor(rawProps) {
    super('PDF');

    this.file = rawProps;
    this.name = rawProps.name;
    this.size = rawProps.size;
    this.isEncrypted = rawProps.isEncrypted || false;
  }

  static VALIDATION_RULES = {
    file: joi.object().required().description('The PDF file'),
    isEncrypted: joi.boolean().invalid(true).required().messages({
      'any.invalid':
        'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
    }),
    size: JoiValidationConstants.MAX_FILE_SIZE_BYTES.required().description(
      'The size of the file in bytes.',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
    isEncrypted:
      'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
    size: [
      {
        contains: 'must be less than or equal to',
        message: `File size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'The file you uploaded is empty.',
    ],
  };

  getValidationRules() {
    return PDF.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PDF.VALIDATION_ERROR_MESSAGES;
  }
}
