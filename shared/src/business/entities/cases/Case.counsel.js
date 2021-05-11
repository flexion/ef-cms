const joi = require('joi');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

const { IrsPractitioner } = require('../IrsPractitioner');
const { PrivatePractitioner } = require('../PrivatePractitioner');

const isUserIdRepresentedByPrivatePractitioner = (rawCase, userId) => {
  return !!rawCase.privatePractitioners?.find(practitioner =>
    practitioner.representing.find(id => id === userId),
  );
};

const getPractitionersRepresenting = (rawCase, petitionerContactId) => {
  return rawCase.privatePractitioners.filter(practitioner =>
    practitioner.representing.includes(petitionerContactId),
  );
};

const CaseCounsel = {
  prototypes: {
    assignPractitioners({ rawCase }) {
      if (Array.isArray(rawCase.privatePractitioners)) {
        this.privatePractitioners = rawCase.privatePractitioners.map(
          practitioner => new PrivatePractitioner(practitioner),
        );
      } else {
        this.privatePractitioners = [];
      }

      if (Array.isArray(rawCase.irsPractitioners)) {
        this.irsPractitioners = rawCase.irsPractitioners.map(
          practitioner => new IrsPractitioner(practitioner),
        );
      } else {
        this.irsPractitioners = [];
      }
    },
    attachIrsPractitioner(practitioner) {
      this.irsPractitioners.push(practitioner);
    },
    attachPrivatePractitioner(practitioner) {
      this.privatePractitioners.push(practitioner);
    },
    getPractitionersRepresenting(petitionerContactId) {
      return getPractitionersRepresenting(this, petitionerContactId);
    },
    hasPartyWithPaperService() {
      const contactSecondary = this.getContactSecondary();
      return (
        this.getContactPrimary().serviceIndicator ===
          SERVICE_INDICATOR_TYPES.SI_PAPER ||
        (contactSecondary &&
          contactSecondary.serviceIndicator ===
            SERVICE_INDICATOR_TYPES.SI_PAPER) ||
        (this.privatePractitioners &&
          this.privatePractitioners.find(
            pp => pp.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
          )) ||
        (this.irsPractitioners &&
          this.irsPractitioners.find(
            ip => ip.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
          ))
      );
    },
    hasPrivatePractitioners() {
      return this.privatePractitioners.length > 0;
    },
    isUserIdRepresentedByPrivatePractitioner(userId) {
      return isUserIdRepresentedByPrivatePractitioner(this, userId);
    },
    removeIrsPractitioner(practitionerToRemove) {
      const index = this.irsPractitioners.findIndex(
        practitioner => practitioner.userId === practitionerToRemove.userId,
      );
      if (index > -1) this.irsPractitioners.splice(index, 1);
      return this;
    },
    removePrivatePractitioner(practitionerToRemove) {
      const index = this.privatePractitioners.findIndex(
        practitioner => practitioner.userId === practitionerToRemove.userId,
      );
      if (index > -1) this.privatePractitioners.splice(index, 1);
    },
    updateIrsPractitioner(practitionerToUpdate) {
      const foundPractitioner = this.irsPractitioners.find(
        practitioner => practitioner.userId === practitionerToUpdate.userId,
      );
      if (foundPractitioner)
        Object.assign(foundPractitioner, practitionerToUpdate);
    },
    updatePrivatePractitioner(practitionerToUpdate) {
      const foundPractitioner = this.privatePractitioners.find(
        practitioner => practitioner.userId === practitionerToUpdate.userId,
      );
      if (foundPractitioner)
        Object.assign(foundPractitioner, practitionerToUpdate);
    },
  },
  validation: {
    irsPractitioners: joi
      .array()
      .items(IrsPractitioner.VALIDATION_RULES)
      .optional()
      .description(
        'List of IRS practitioners (also known as respondents) associated with the case.',
      ),
    privatePractitioners: joi
      .array()
      .items(PrivatePractitioner.VALIDATION_RULES)
      .optional()
      .description('List of private practitioners associated with the case.'),
  },
};

module.exports = {
  CaseCounsel,
  getPractitionersRepresenting,
  isUserIdRepresentedByPrivatePractitioner,
};
