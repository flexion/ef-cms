const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function ForwardMessage(rawMessage) {
  this.assigneeId = rawMessage.assigneeId;
  this.forwardMessage = rawMessage.forwardMessage;
  this.section = rawMessage.section;
}

joiValidationDecorator(
  ForwardMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    forwardMessage: joi.string().required(),
    section: joi.string().required(),
  }),
  undefined,
  {
    assigneeId: 'Recipient is required.',
    forwardMessage: 'Message is required.',
    section: 'Section is required',
  },
);

module.exports = { ForwardMessage };
