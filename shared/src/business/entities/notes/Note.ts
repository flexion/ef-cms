import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class Note extends JoiValidationEntity {
  public notes: string;

  constructor(rawNote: { notes: string }) {
    super('Note');
    this.notes = rawNote.notes?.trim();
  }

  static VALIDATION_RULES = {
    notes: JoiValidationConstants.STRING.required().messages({
      '*': 'Add note',
    }),
  };

  getValidationRules() {
    return Note.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  static VALIDATION_RULES_NEW = {
    notes: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Add note'),
    ),
  };

  getValidationRules_NEW() {
    return Note.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return Note.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

declare global {
  type RawNote = ExcludeMethods<Note>;
}
