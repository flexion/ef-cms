const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Message } = require('./Message');

/**
 * NewCaseMessage entity - used for validating
 * the Create Case Message modal form
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function NewCaseMessage(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'NewCaseMessage';

  this.message = rawMessage.message;
  this.subject = rawMessage.subject;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
}

NewCaseMessage.validationName = 'NewCaseMessage';

NewCaseMessage.VALIDATION_ERROR_MESSAGES = {
  message: 'Enter a message',
  subject: 'Enter a subject line',
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

joiValidationDecorator(
  NewCaseMessage,
  joi.object().keys({
    entityName: joi.string().valid('NewCaseMessage').required(),
    message: Message.VALIDATION_RULES.message,
    subject: Message.VALIDATION_RULES.subject,
    toSection: Message.VALIDATION_RULES.toSection,
    toUserId: Message.VALIDATION_RULES.toUserId,
  }),
  NewCaseMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewCaseMessage };
