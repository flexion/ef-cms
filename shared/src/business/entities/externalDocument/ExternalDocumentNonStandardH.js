const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @param ExternalDocumentFactory
 * @constructor
 */
function ExternalDocumentNonStandardH(rawProps, ExternalDocumentFactory) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
  });
  const { secondaryDocument } = rawProps;
  this.secondaryDocument = ExternalDocumentFactory.get(secondaryDocument || {});
}

ExternalDocumentNonStandardH.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.secondaryDocument.getDocumentTitle(),
  );
};

ExternalDocumentNonStandardH.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  secondaryDocument: 'You must select a document.',
};

ExternalDocumentNonStandardH.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  secondaryDocument: joi.object().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardH,
  ExternalDocumentNonStandardH.schema,
  function() {
    return !this.getFormattedValidationErrors();
  },
  ExternalDocumentNonStandardH.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardH };
