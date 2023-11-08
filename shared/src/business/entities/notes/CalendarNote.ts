import { JoiValidationConstants } from '../JoiValidationConstants';
<<<<<<< HEAD
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
=======
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05

export class CalendarNote extends JoiValidationEntity {
  public note?: string;

  constructor(rawProps) {
    super('CalendarNote');

    this.note = rawProps.note?.trim();
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.allow('', null).optional(),
  };

  getValidationRules() {
    return CalendarNote.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  static VALIDATION_RULES_NEW = {
    note: JoiValidationConstants.STRING.max(200)
      .allow('', null)
      .optional()
      .messages(
        setDefaultErrorMessage(
          'Limit is 200 characters. Enter 200 or fewer characters.',
        ),
      ),
  };

  getValidationRules_NEW() {
    return CalendarNote.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CalendarNote.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

export type RawCalendarNote = ExcludeMethods<CalendarNote>;
