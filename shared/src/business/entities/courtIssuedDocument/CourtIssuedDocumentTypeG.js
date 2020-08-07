const joi = require('joi');
const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

const tomorrowMoment = calculateISODate({ howMuch: +1, unit: 'days' });
const tomorrowFormatted = formatDateString(
  createISODateString(tomorrowMoment),
  FORMATS.MMDDYYYY,
);
/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeG(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.date = rawProps.date;
  this.trialLocation = rawProps.trialLocation;
}

CourtIssuedDocumentTypeG.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
    this.trialLocation,
  );
};

CourtIssuedDocumentTypeG.schema = {
  attachments: joi.boolean().required(),
  date: JoiValidationConstants.ISO_DATE.min(tomorrowFormatted).required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  trialLocation: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeG,
  CourtIssuedDocumentTypeG.schema,
  {
    ...VALIDATION_ERROR_MESSAGES,
    date: 'Enter a valid future date.',
  },
);

module.exports = { CourtIssuedDocumentTypeG };
