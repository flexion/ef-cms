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
    notes: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Add note'),
    ),
  };

  getValidationRules() {
    return Note.VALIDATION_RULES;
  }
}

declare global {
  type RawNote = ExcludeMethods<Note>;
}
