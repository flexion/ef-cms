import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { MAX_FILE_SIZE_MB } from '../EntityConstants';
import { PDFDocument } from 'pdf-lib';
import joi from 'joi';

const isPDFEncrypted = async (value: Blob) => {
  try {
    const pdfText = await value.text();

    await PDFDocument.load(pdfText);
  } catch (e) {
    console.log('an error!@', e);
    if (
      e.message.includes('Input document to `PDFDocument.load` is encrypted')
    ) {
      throw new joi.ValidationError(
        'file',
        [
          {
            message:
              'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
            path: ['file'],
            type: 'any.invalid',
          },
        ],
        value,
      );
    }
  }
};

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
    file: joi
      .object()
      .required()
      .description('The PDF file')
      .external(isPDFEncrypted),
    isEncrypted: joi.boolean().invalid(true).required(),
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
