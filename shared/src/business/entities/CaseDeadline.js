const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Case } = require('./cases/Case');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * Case Deadline entity
 *
 * @param {object} rawProps the raw case deadline data
 * @constructor
 */
function CaseDeadline(rawProps, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.associatedJudge = rawProps.associatedJudge || Case.CHIEF_JUDGE;
  this.caseDeadlineId =
    rawProps.caseDeadlineId || applicationContext.getUniqueId();
  this.caseId = rawProps.caseId;
  this.createdAt = rawProps.createdAt || createISODateString();
  this.deadlineDate = rawProps.deadlineDate;
  this.description = rawProps.description;
}

CaseDeadline.validationName = 'CaseDeadline';

CaseDeadline.VALIDATION_ERROR_MESSAGES = {
  caseId: 'You must have a case id.',
  deadlineDate: 'Enter a valid deadline date',
  description: [
    {
      contains: 'length must be less than or equal to',
      message: 'The description is too long. Please enter a valid description.',
    },
    'Enter a description of this deadline',
  ],
};

CaseDeadline.schema = joi.object().keys({
  associatedJudge: joi
    .string()
    .required()
    .description('Judge assigned to this Case. Defaults to Chief Judge.'),
  caseDeadlineId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('Unique Case Deadline ID only used by the system.'),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('Unique Case ID only used by the system.'),
  createdAt: joi
    .date()
    .iso()
    .required()
    .description('When the Case Deadline was added to the system.'),
  deadlineDate: joi
    .date()
    .iso()
    .required()
    .description('When the Case Deadline expires.'),
  description: joi
    .string()
    .max(120)
    .min(1)
    .required()
    .description('User provided dscription of the Case Deadline.'),
});

joiValidationDecorator(
  CaseDeadline,
  CaseDeadline.schema,
  undefined,
  CaseDeadline.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseDeadline };
