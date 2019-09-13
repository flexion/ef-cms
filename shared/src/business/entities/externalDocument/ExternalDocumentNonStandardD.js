const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { formatDateString } = require('../../utilities/DateHandler');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardD(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.previousDocument = rawProps.previousDocument;
  this.serviceDate = rawProps.serviceDate;
}

ExternalDocumentNonStandardD.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.previousDocument,
    formatDateString(this.serviceDate, 'MM-DD-YYYY'),
  );
};

ExternalDocumentNonStandardD.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  previousDocument: 'Select a document',
  serviceDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Service date is in the future. Please enter a valid date.',
    },
    'Provide a service date',
  ],
};

ExternalDocumentNonStandardD.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  previousDocument: joi.string().required(),
  serviceDate: joi
    .date()
    .iso()
    .max('now')
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  undefined,
  ExternalDocumentNonStandardD.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardD };
