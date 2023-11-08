import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class NextFriendForIncompetentPersonContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'NextFriendForIncompetentPersonContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
<<<<<<< HEAD
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of next friend' }),
=======
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(setDefaultErrorMessage('Enter name of next friend')),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      secondaryName: 'Enter name of next friend',
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
    };
  }
}
