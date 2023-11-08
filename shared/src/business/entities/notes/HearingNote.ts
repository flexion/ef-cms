import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class HearingNote extends JoiValidationEntity {
  public note: string;

  constructor(rawProps) {
    super('HearingNote');

    this.note = rawProps.note;
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.max(200).required().messages({
      '*': 'Add a note',
      'string.max': 'Limit is 200 characters. Enter 200 or fewer characters.',
    }),
  } as const;
  getValidationRules() {
    return HearingNote.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  static VALIDATION_RULES_NEW = {
    note: JoiValidationConstants.STRING.max(200)
      .required()
      .messages({
        ...setDefaultErrorMessage('Add a note'),
        'string.max': 'Limit is 200 characters. Enter 200 or fewer characters.',
      }),
  } as const;

  getValidationRules_NEW() {
    return HearingNote.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return HearingNote.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

export type RawHearingNote = ExcludeMethods<HearingNote>;
