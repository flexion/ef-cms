import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class PetitionerEstateWithExecutorPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerEstateWithExecutorPrimaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
<<<<<<< HEAD
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of executor/personal representative' }),
      title: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages({ '*': 'Enter title' }),
=======
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
      title: JoiValidationConstants.STRING.max(100).optional(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(
          setDefaultErrorMessage(
            'Enter name of executor/personal representative',
          ),
        ),
      title: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages(setDefaultErrorMessage('Enter title')),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      secondaryName: 'Enter name of executor/personal representative',
      title: 'Enter title',
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
    };
  }
}
