const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();
const {
  CASE_STATUS_TYPES,
  CHAMBERS_SECTIONS,
  DOCKET_NUMBER_MATCHER,
  SECTIONS,
} = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function CaseMessage(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.attachments = rawMessage.attachments || [];
  this.caseId = rawMessage.caseId;
  this.caseStatus = rawMessage.caseStatus;
  this.caseTitle = rawMessage.caseTitle;
  this.completedAt = rawMessage.completedAt;
  this.completedBy = rawMessage.completedBy;
  this.completedBySection = rawMessage.completedBySection;
  this.completedByUserId = rawMessage.completedByUserId;
  this.completedMessage = rawMessage.completedMessage;
  this.createdAt = rawMessage.createdAt || createISODateString();
  this.docketNumber = rawMessage.docketNumber;
  this.docketNumberWithSuffix = rawMessage.docketNumberWithSuffix;
  this.entityName = 'CaseMessage';
  this.from = rawMessage.from;
  this.fromSection = rawMessage.fromSection;
  this.fromUserId = rawMessage.fromUserId;
  this.isCompleted = rawMessage.isCompleted || false;
  this.isRepliedTo = rawMessage.isRepliedTo || false;
  this.message = rawMessage.message;
  this.messageId = rawMessage.messageId || applicationContext.getUniqueId();
  this.parentMessageId = rawMessage.parentMessageId || this.messageId;
  this.subject = rawMessage.subject;
  this.to = rawMessage.to;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
}

CaseMessage.validationName = 'CaseMessage';

CaseMessage.VALIDATION_ERROR_MESSAGES = {
  message: 'Enter a message',
  subject: 'Enter a subject line',
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

CaseMessage.VALIDATION_RULES = {
  attachments: joi
    .array()
    .optional()
    .description('Array of document metadata objects attached to the message.'),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('ID of the case the message is attached to.'),
  caseStatus: joi
    .string()
    .valid(...Object.values(CASE_STATUS_TYPES))
    .required()
    .description('The status of the associated case.'),
  caseTitle: joi
    .string()
    .required()
    .description('The case title for the associated cases.'),
  completedAt: joiStrictTimestamp
    .when('isCompleted', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('When the message was marked as completed.'),
  completedBy: joi
    .string()
    .max(500)
    .when('isCompleted', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('The name of the user who completed the message thread'),
  completedBySection: joi
    .string()
    .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
    .when('isCompleted', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('The section of the user who completed the message thread'),
  completedByUserId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .when('isCompleted', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('The ID of the user who completed the message thread'),
  completedMessage: joi
    .string()
    .max(500)
    .allow(null)
    .optional()
    .description('The message entered when completing the message thread.'),
  createdAt: joiStrictTimestamp
    .required()
    .description('When the message was created.'),
  docketNumber: joi.string().regex(DOCKET_NUMBER_MATCHER).required(),
  docketNumberWithSuffix: joi
    .string()
    .max(500)
    .allow(null)
    .optional()
    .description('The docket number and suffix for the associated case.'),
  entityName: joi.string().valid('CaseMessage').required(),
  from: joi
    .string()
    .max(100)
    .required()
    .description('The name of the user who sent the message.'),
  fromSection: joi
    .string()
    .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
    .required()
    .description('The section of the user who sent the message.'),
  fromUserId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('The ID of the user who sent the message.'),
  isCompleted: joi
    .boolean()
    .required()
    .description('Whether the message thread has been completed.'),
  isRepliedTo: joi
    .boolean()
    .required()
    .description('Whether the message has been replied to or forwarded.'),
  message: joi.string().max(500).required().description('The message text.'),
  messageId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description(
      'A unique ID generated by the system to represent the message.',
    ),
  parentMessageId: joi
    .string()
    .uuid({ version: ['uuidv4'] })
    .required()
    .description('The ID of the initial message in the thread.'),
  subject: joi
    .string()
    .max(250)
    .required()
    .description('The subject line of the message.'),
  to: joi
    .string()
    .max(100)
    .required()
    .allow(null)
    .description('The name of the user who is the recipient of the message.'),
  toSection: joi
    .string()
    .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
    .required()
    .description(
      'The section of the user who is the recipient of the message.',
    ),
  toUserId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .allow(null)
    .description('The ID of the user who is the recipient of the message.'),
};

joiValidationDecorator(
  CaseMessage,
  joi.object().keys(CaseMessage.VALIDATION_RULES),
  CaseMessage.VALIDATION_ERROR_MESSAGES,
);

CaseMessage.prototype.markAsCompleted = function ({ message, user }) {
  this.isCompleted = true;
  this.completedAt = createISODateString();
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedBySection = user.section;
  this.completedMessage = message;

  return this;
};

module.exports = { CaseMessage };
