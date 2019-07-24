const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardE(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    trialLocation: rawProps.trialLocation,
  });
}

ExternalDocumentNonStandardE.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.trialLocation);
};

ExternalDocumentNonStandardE.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  trialLocation: 'You must select a trial location.',
};

ExternalDocumentNonStandardE.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  trialLocation: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardE,
  ExternalDocumentNonStandardE.schema,
  undefined,
  ExternalDocumentNonStandardE.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardE };
