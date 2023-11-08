import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class EditPetitionerCounsel extends JoiValidationEntity {
  public representing: string[];

  constructor(rawProps) {
    super('EditPetitionerCounsel');
    this.representing = rawProps.representing;
  }

  static VALIDATION_RULES = {
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required()
      .messages({ '*': 'Select a representing party' }),
  } as const;

  getValidationRules() {
    return EditPetitionerCounsel.VALIDATION_RULES;
  }
<<<<<<< HEAD
=======

  static VALIDATION_RULES_NEW = {
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required()
      .messages(setDefaultErrorMessage('Select a representing party')),
  } as const;

  getValidationRules_NEW() {
    return EditPetitionerCounsel.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return EditPetitionerCounsel.VALIDATION_ERROR_MESSAGES;
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}

export type RawEditPetitionerCounsel = ExcludeMethods<EditPetitionerCounsel>;
