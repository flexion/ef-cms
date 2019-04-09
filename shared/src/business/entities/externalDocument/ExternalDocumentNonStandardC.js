const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/getDocumentTitle');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardC(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardC.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentType,
    this.freeText,
    this.previousDocument,
  );
};

ExternalDocumentNonStandardC.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  freeText: 'You must provide a value.',
  previousDocument: 'You must select a document.',
};

ExternalDocumentNonStandardC.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  previousDocument: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardC,
  ExternalDocumentNonStandardC.schema,
  undefined,
  ExternalDocumentNonStandardC.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardC };
