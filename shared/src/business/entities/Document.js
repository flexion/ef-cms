const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');
const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { flatten } = require('lodash');
const { Order } = require('./orders/Order');
const { WorkItem } = require('./WorkItem');

Document.PETITION_DOCUMENT_TYPES = ['Petition'];
Document.CATEGORIES = Object.keys(documentMapExternal);
Document.CATEGORY_MAP = documentMapExternal;
Document.INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
Document.INTERNAL_CATEGORY_MAP = documentMapInternal;

/**
 * constructor
 * @param rawDocument
 * @constructor
 */
function Document(rawDocument) {
  Object.assign(this, {
    attachments: rawDocument.attachments,
    caseId: rawDocument.caseId,
    category: rawDocument.category,
    certificateOfService: rawDocument.certificateOfService,
    certificateOfServiceDate: rawDocument.certificateOfServiceDate,
    createdAt: rawDocument.createdAt || new Date().toISOString(),
    docketNumber: rawDocument.docketNumber,
    documentId: rawDocument.documentId,
    documentTitle: rawDocument.documentTitle,
    documentType: rawDocument.documentType,
    eventCode: rawDocument.eventCode,
    exhibits: rawDocument.exhibits,
    filedBy: rawDocument.filedBy,
    hasSupportingDocuments: rawDocument.hasSupportingDocuments,
    isPaper: rawDocument.isPaper,
    lodged: rawDocument.lodged,
    objections: rawDocument.objections,
    partyPrimary: rawDocument.partyPrimary,
    partyRespondent: rawDocument.partyRespondent,
    partySecondary: rawDocument.partySecondary,
    practitioner: rawDocument.practitioner,
    previousDocument: rawDocument.previousDocument,
    processingStatus: rawDocument.processingStatus,
    receivedAt: rawDocument.receivedAt || new Date().toISOString(),
    relationship: rawDocument.relationship,
    scenario: rawDocument.scenario,
    servedAt: rawDocument.servedAt,
    servedParties: rawDocument.servedParties,
    serviceDate: rawDocument.serviceDate,
    signedAt: rawDocument.signedAt,
    signedByUserId: rawDocument.signedByUserId,
    status: rawDocument.status,
    supportingDocument: rawDocument.supportingDocument,
    userId: rawDocument.userId,
    workItems: rawDocument.workItems,
  });

  this.processingStatus = this.processingStatus || 'pending';
  this.workItems = (this.workItems || []).map(
    workItem => new WorkItem(workItem),
  );
}

Document.name = 'Document';

const practitionerAssociationDocumentTypes = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

/**
 * documentTypes
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, stin: string}}
 */
Document.INITIAL_DOCUMENT_TYPES = {
  ownershipDisclosure: {
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'ODS',
  },
  petition: {
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
  },
};

Document.SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

Document.getDocumentTypes = () => {
  const allFilingEvents = flatten([
    ...Object.values(documentMapExternal),
    ...Object.values(documentMapInternal),
  ]);
  const filingEventTypes = allFilingEvents.map(t => t.documentType);
  const orderDocTypes = Order.ORDER_TYPES.map(t => t.documentType);
  const initialTypes = Object.keys(Document.INITIAL_DOCUMENT_TYPES).map(
    t => Document.INITIAL_DOCUMENT_TYPES[t].documentType,
  );
  const signedTypes = Object.keys(Document.SIGNED_DOCUMENT_TYPES).map(
    t => Document.SIGNED_DOCUMENT_TYPES[t].documentType,
  );
  const documentTypes = [
    ...initialTypes,
    ...practitionerAssociationDocumentTypes,
    ...filingEventTypes,
    ...orderDocTypes,
    ...signedTypes,
  ];

  return documentTypes;
};

/**
 *
 * @returns {boolean}
 */
Document.prototype.isPetitionDocument = function() {
  return Document.PETITION_DOCUMENT_TYPES.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    createdAt: joi
      .date()
      .iso()
      .optional(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    documentType: joi
      .string()
      .valid(Document.getDocumentTypes())
      .required(),
    eventCode: joi.string().optional(),
    filedBy: joi
      .string()
      .allow('')
      .optional(),
    isPaper: joi.boolean().optional(),
    lodged: joi.boolean().optional(),
    processingStatus: joi.string().optional(),
    receivedAt: joi
      .date()
      .iso()
      .optional(),
    servedAt: joi
      .date()
      .iso()
      .optional(),
    servedParties: joi.array().optional(),
    signedAt: joi
      .date()
      .iso()
      .optional(),
    signedByUserId: joi.string().optional(),
    status: joi.string().optional(),
    userId: joi.string().required(),
  }),
  function() {
    return WorkItem.validateCollection(this.workItems);
  },
);

/**
 *
 * @param workItem
 */
Document.prototype.addWorkItem = function(workItem) {
  this.workItems = [...this.workItems, workItem];
};

Document.prototype.setAsServed = function(servedParties = null) {
  this.status = 'served';
  this.servedAt = new Date().toISOString();
  if (servedParties) {
    this.servedParties = servedParties;
  }
};

/**
 * generates the filedBy string from parties selected for the document
 * and contact info from the case detail
 *
 * @param caseDetail
 */
Document.prototype.generateFiledBy = function(caseDetail) {
  if (!this.filedBy) {
    let filedByArray = [];
    this.partyRespondent && filedByArray.push('Resp.');

    Array.isArray(this.practitioner) &&
      this.practitioner.forEach(practitioner => {
        practitioner.partyPractitioner &&
          filedByArray.push(`Counsel ${practitioner.name}`);
      });

    if (
      this.partyPrimary &&
      !this.partySecondary &&
      caseDetail.contactPrimary
    ) {
      filedByArray.push(`Petr. ${caseDetail.contactPrimary.name}`);
    } else if (
      this.partySecondary &&
      !this.partyPrimary &&
      caseDetail.contactSecondary
    ) {
      filedByArray.push(`Petr. ${caseDetail.contactSecondary.name}`);
    } else if (
      this.partyPrimary &&
      this.partySecondary &&
      caseDetail.contactPrimary &&
      caseDetail.contactSecondary
    ) {
      filedByArray.push(
        `Petrs. ${caseDetail.contactPrimary.name} & ${caseDetail.contactSecondary.name}`,
      );
    }

    if (filedByArray.length) {
      this.filedBy = filedByArray.join(' & ');
    }
  }
};
/**
 * attaches a signedAt date to the document
 *
 * @param signByUserId
 *
 */
Document.prototype.setSigned = function(signByUserId) {
  this.signedByUserId = signByUserId;
  this.signedAt = new Date().toISOString();
};

exports.Document = Document;
