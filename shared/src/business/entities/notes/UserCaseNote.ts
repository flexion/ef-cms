import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class UserCaseNote extends JoiValidationEntity {
  public docketNumber: string;
  public userId: string;
  public notes: string;

  constructor(rawProps) {
    super('UserCaseNote');

    this.docketNumber = rawProps.docketNumber;
    this.userId = rawProps.userId;
    this.notes = rawProps.notes;
  }

  static VALIDATION_RULES = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    notes: JoiValidationConstants.STRING.required().messages({
      '*': 'Add note',
    }),
    userId: JoiValidationConstants.UUID.required(),
  };

  getValidationRules() {
    return UserCaseNote.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  static VALIDATION_RULES_NEW = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    notes: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Add note'),
    ),
    userId: JoiValidationConstants.UUID.required(),
  };

  getValidationRules_NEW() {
    return UserCaseNote.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return UserCaseNote.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

export type RawUserCaseNote = ExcludeMethods<UserCaseNote>;
