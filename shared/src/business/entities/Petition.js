const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function Petition(rawPetition) {
  Object.assign(this, rawPetition);
}

Petition.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  irsNoticeDate: 'IRS Notice Date is a required field.',
  irsNoticeFile: 'The IRS Notice file was not selected.',
  petitionFile: 'The Petition file was not selected.',
  procedureType: 'Procedure Type is a required field.',
  preferredTrialCity: 'Preferred Trial City is a required field.',
};

joiValidationDecorator(
  Petition,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi
      .date()
      .iso()
      .required(),
    irsNoticeFile: joi.object().required(),
    petitionFile: joi.object().required(),
    procedureType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
  }),
);

const original = Petition.prototype.getValidationErrors;

Petition.prototype.getValidationErrors = function() {
  const errors = original.call(this);
  if (!errors) return null;
  for (let key of Object.keys(errors)) {
    errors[key] = Petition.errorToMessageMap[key];
  }
  return errors;
};

module.exports = Petition;
