import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class NextFriendForMinorContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'NextFriendForMinorContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(setDefaultErrorMessage('Enter name of next friend')),
    };
  }
}
