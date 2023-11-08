import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class PetitionerDeceasedSpouseContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerDeceasedSpouseContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages({ '*': 'Enter name for in care of' }),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }
<<<<<<< HEAD
=======

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages(setDefaultErrorMessage('Enter name for in care of')),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      inCareOf: 'Enter name for in care of',
    };
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}
