import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { MAX_FILE_SIZE_MB } from '../EntityConstants';
import joi from 'joi';

export class PDF extends JoiValidationEntity {
  public file: object;
  public size: number;

  constructor(rawProps) {
    super('PDF');

    this.file = rawProps.file;
    this.size = rawProps.size;
  }

  static VALIDATION_RULES = {
    file: joi.object().required().description('The PDF file'),
    size: JoiValidationConstants.MAX_FILE_SIZE_BYTES.required().description(
      'The size of the file in bytes.',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
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
