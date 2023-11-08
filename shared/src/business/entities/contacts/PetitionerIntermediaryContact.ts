import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class PetitionerIntermediaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerIntermediaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
<<<<<<< HEAD
      inCareOf: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages({ '*': 'In care of has errors.' }),
=======
      inCareOf: JoiValidationConstants.STRING.max(100).optional(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages(setDefaultErrorMessage('In care of has errors.')),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      inCareOf: 'In care of has errors.',
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
    };
  }
}
