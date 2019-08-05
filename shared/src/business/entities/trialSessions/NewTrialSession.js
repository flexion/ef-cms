const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { TrialSession } = require('./TrialSession');

NewTrialSession.validationName = 'TrialSession';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function NewTrialSession(rawSession) {
  TrialSession.prototype.init.call(this, rawSession);
}

NewTrialSession.errorToMessageMap = { ...TrialSession.errorToMessageMap };

joiValidationDecorator(
  NewTrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    startDate: joi
      .date()
      .iso()
      .min('now')
      .required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  NewTrialSession.errorToMessageMap,
);

module.exports = { NewTrialSession };
