import { Contact } from './Contact';

export class PetitionerSpouseContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerSpouseContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return super.getValidationRules();
  }
<<<<<<< HEAD
=======

  getValidationRules_NEW() {
    return super.getValidationRules_NEW();
  }

  getErrorToMessageMap() {
    return super.getErrorToMessageMap();
  }
>>>>>>> d4451d8c8e3590b293b1a4e8ae197a694f937a05
}
