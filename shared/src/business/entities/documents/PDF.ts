import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { MAX_FILE_SIZE_MB } from '../EntityConstants';
import joi from 'joi';

export class PDF extends JoiValidationEntity {
  public file: File;
  public size: number;
  public isEncrypted: boolean;

  constructor(rawProps) {
    super('PDF');

    this.file = rawProps.file;
    this.size = rawProps.size;

    let files = new Blob([this.file], { type: 'application/pdf' });

    files.text().then(x => {
      console.log('isEncrypted', x.includes('Encrypt')); // true, if Encrypted
      console.log(
        'isEncrypted',
        x
          .substring(x.lastIndexOf('<<'), x.lastIndexOf('>>'))
          .includes('/Encrypt'),
      );
      console.log(this.file.name);

      this.isEncrypted = x.includes('Encrypt');

      console.log('&&&& MAKING A PDF', this.isEncrypted);
    });
  }

  static VALIDATION_RULES = {
    file: joi.object().required().description('The PDF file'),
    isEncrypted: joi.boolean().invalid(true),
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
