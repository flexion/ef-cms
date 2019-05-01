const joi = require('joi-browser');
const {
  ExternalDocumentFactory,
} = require('../externalDocument/ExternalDocumentFactory');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes, omit } = require('lodash');

/**
 * @param rawProps
 * @constructor
 */
function DocketEntryFactory(rawProps) {
  let entityConstructor = function(rawProps) {
    Object.assign(this, rawProps);
  };

  let schema = {
    addToCoverSheet: joi.boolean(),
    additionalInfo1: joi.string(),
    additionalInfo2: joi.string(),
    attachments: joi.boolean(), // could be boolean
    certificateOfService: joi.boolean(),
    dateReceived: joi
      .date()
      .iso()
      .max('now')
      .required(),
    eventCode: joi.string(),
    exhibits: joi.boolean(),
    filingStatus: joi.string().required(),
    hasSupportingDocuments: joi.boolean(),
    primaryDocumentFile: joi.object().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    objections: joi.string(),
    partyPractitioner: joi.boolean().required(),
    partyPrimary: joi.boolean().required(),
    partyRespondent: joi.boolean().required(),
    partySecondary: joi.boolean().required(),
  };

  let errorToMessageMap = {
    attachments: 'Enter selection for Attachments.',
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date is in the future. Please enter a valid date.',
      },
      'Enter a Certificate of Service Date.',
    ],
    dateReceived: [
      {
        contains: 'must be less than or equal to',
        message: 'Received date is in the future. Please enter a valid date.',
      },
      'Enter date received.',
    ],
    eventCode: 'Select a document.',
    exhibits: 'Enter selection for Exhibits.',
    filingStatus: 'Enter selection for Filing Status.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    partyPractitioner: 'Select a filing party.',
    partyPrimary: 'Select a filing party.',
    partyRespondent: 'Select a filing party.',
    partySecondary: 'Select a filing party.',
    primaryDocumentFile: 'A file was not selected.',
  };

  let customValidate;

  const addToSchema = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  const exDoc = ExternalDocumentFactory.get(rawProps);

  const externalDocumentOmit = ['category'];

  const docketEntryExternalDocumentSchema = omit(
    exDoc.getSchema(),
    externalDocumentOmit,
  );
  const docketEntryExternalDocumentErrorToMessageMap = omit(
    exDoc.getErrorToMessageMap(),
    externalDocumentOmit,
  );

  // console.log(JSON.stringify(Object.keys(schema), null, 2));
  // console.log(
  //   JSON.stringify(Object.keys(docketEntryExternalDocumentSchema), null, 2),
  // );
  schema = { ...schema, ...docketEntryExternalDocumentSchema };
  errorToMessageMap = {
    ...errorToMessageMap,
    ...docketEntryExternalDocumentErrorToMessageMap,
  };

  if (rawProps.certificateOfService === true) {
    addToSchema('certificateOfServiceDate');
  }

  if (
    rawProps.category === 'Motion' ||
    includes(
      [
        'Motion to Withdraw Counsel',
        'Motion to Withdraw As Counsel',
        'Application to Take Deposition',
      ],
      rawProps.documentType,
    )
  ) {
    addToSchema('objections');
  }
  if (
    rawProps.partyPrimary !== true &&
    rawProps.partySecondary !== true &&
    rawProps.partyRespondent !== true &&
    rawProps.partyPractitioner !== true
  ) {
    addToSchema('partyPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(rawProps);
}

module.exports = { DocketEntryFactory };
