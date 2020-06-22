const joi = require('@hapi/joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_RELATIONSHIPS,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  SCENARIOS,
  TRACKED_DOCUMENT_TYPES,
} = require('./EntityConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { flatten } = require('lodash');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const { User } = require('./User');
const { WorkItem } = require('./WorkItem');
const joiStrictTimestamp = getTimestampSchema();

Document.validationName = 'Document';

/**
 * constructor
 *
 * @param {object} rawDocument the raw document data
 * @constructor
 */
function Document(rawDocument, { applicationContext, filtered = false }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.entityName = 'Document';

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    this.draftState = rawDocument.draftState;
    this.judge = rawDocument.judge;
    this.pending =
      rawDocument.pending === undefined
        ? Document.isPendingOnCreation(rawDocument)
        : rawDocument.pending;
    this.previousDocument = rawDocument.previousDocument;
    this.processingStatus = rawDocument.processingStatus || 'pending';
    this.qcAt = rawDocument.qcAt;
    this.qcByUserId = rawDocument.qcByUserId;
    this.signedAt = rawDocument.signedAt;
    this.signedByUserId = rawDocument.signedByUserId;
    this.signedJudgeName = rawDocument.signedJudgeName;
    this.userId = rawDocument.userId;
    this.workItems = (rawDocument.workItems || []).map(
      workItem => new WorkItem(workItem, { applicationContext }),
    );
  }

  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.addToCoversheet = rawDocument.addToCoversheet;
  this.archived = rawDocument.archived;
  this.attachments = rawDocument.attachments;
  this.certificateOfService = rawDocument.certificateOfService;
  this.certificateOfServiceDate = rawDocument.certificateOfServiceDate;
  this.createdAt = rawDocument.createdAt || createISODateString();
  this.date = rawDocument.date;
  this.docketNumber = rawDocument.docketNumber;
  this.docketNumbers = rawDocument.docketNumbers;
  this.documentId = rawDocument.documentId;
  this.documentContentsId = rawDocument.documentContentsId;
  this.documentTitle = rawDocument.documentTitle;
  this.documentType = rawDocument.documentType;
  this.eventCode = rawDocument.eventCode;
  this.filedBy = rawDocument.filedBy;
  this.filingDate = rawDocument.filingDate || createISODateString();
  this.freeText = rawDocument.freeText;
  this.freeText2 = rawDocument.freeText2;
  this.hasSupportingDocuments = rawDocument.hasSupportingDocuments;
  this.isFileAttached = rawDocument.isFileAttached;
  this.isPaper = rawDocument.isPaper;
  this.lodged = rawDocument.lodged;
  this.mailingDate = rawDocument.mailingDate;
  this.objections = rawDocument.objections;
  this.ordinalValue = rawDocument.ordinalValue;
  this.partyPrimary = rawDocument.partyPrimary;
  this.partyIrsPractitioner = rawDocument.partyIrsPractitioner;
  this.partySecondary = rawDocument.partySecondary;
  this.receivedAt = rawDocument.receivedAt || createISODateString();
  this.relationship = rawDocument.relationship;
  this.scenario = rawDocument.scenario;
  this.secondaryDate = rawDocument.secondaryDate;
  this.servedAt = rawDocument.servedAt;
  this.numberOfPages = rawDocument.numberOfPages;
  this.servedParties = rawDocument.servedParties;
  this.serviceDate = rawDocument.serviceDate;
  this.serviceStamp = rawDocument.serviceStamp;
  this.supportingDocument = rawDocument.supportingDocument;
  this.trialLocation = rawDocument.trialLocation;

  // only share the userId with an external user if it is the logged in user
  if (applicationContext.getCurrentUser().userId === rawDocument.userId) {
    this.userId = rawDocument.userId;
  }

  // only use the privatePractitioner name
  if (Array.isArray(rawDocument.privatePractitioners)) {
    this.privatePractitioners = rawDocument.privatePractitioners.map(item => {
      return {
        name: item.name,
        partyPrivatePractitioner: item.partyPrivatePractitioner,
      };
    });
  }

  this.generateFiledBy(rawDocument);
}

Document.isPendingOnCreation = rawDocument => {
  const isPending = Object.values(TRACKED_DOCUMENT_TYPES).some(trackedType => {
    return (
      (rawDocument.category && trackedType.category === rawDocument.category) ||
      (rawDocument.eventCode && trackedType.eventCode === rawDocument.eventCode)
    );
  });
  return isPending;
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    addToCoversheet: joi.boolean().optional(),
    additionalInfo: joi.string().max(500).optional(),
    additionalInfo2: joi.string().max(500).optional(),
    archived: joi
      .boolean()
      .optional()
      .description(
        'A document that was archived instead of added to the Docket Record.',
      ),
    certificateOfService: joi.boolean().optional(),
    certificateOfServiceDate: joiStrictTimestamp.when('certificateOfService', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    createdAt: joiStrictTimestamp
      .required()
      .description('When the Document was added to the system.'),
    date: joiStrictTimestamp
      .optional()
      .allow(null)
      .description(
        'An optional date used when generating a fully concatenated document title.',
      ),
    docketNumber: joi
      .string()
      .regex(DOCKET_NUMBER_MATCHER)
      .optional()
      .description('Docket Number of the associated Case in XXXXX-YY format.'),
    docketNumbers: joi
      .string()
      .max(500)
      .optional()
      .description(
        'Optional Docket Number text used when generating a fully concatenated document title.',
      ),
    documentContentsId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .description('The S3 ID containing the text contents of the document.'),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required()
      .description('ID of the associated PDF document in the S3 bucket.'),
    documentTitle: joi
      .string()
      .max(500)
      .optional()
      .description('The title of this document.'),
    documentType: joi
      .string()
      .valid(...ALL_DOCUMENT_TYPES)
      .required()
      .description('The type of this document.'),
    // TODO - figure out if draft state being null/ not null relies on signature being present
    draftState: joi.object().allow(null).optional(),
    entityName: joi.string().valid('Document').required(),
    eventCode: joi
      .string()
      .valid(...ALL_EVENT_CODES)
      .allow(null)
      .optional(),
    filedBy: joi.string().max(500).allow('').optional(),
    filingDate: joiStrictTimestamp
      .max('now')
      .required()
      .description('Date that this Document was filed.'),
    freeText: joi.string().max(500).optional(),
    freeText2: joi.string().max(500).optional(),
    hasSupportingDocuments: joi.boolean().optional(),
    isFileAttached: joi.boolean().optional(),
    isPaper: joi.boolean().optional(),
    judge: joi
      .string()
      .allow(null)
      .description('The judge associated with the document.')
      .when('documentType', {
        is: joi
          .string()
          .valid(...OPINION_DOCUMENT_TYPES.map(t => t.documentType)),
        otherwise: joi.optional(),
        then: joi.required(),
      }),
    lodged: joi
      .boolean()
      .optional()
      .description(
        'A lodged document is awaiting action by the judge to enact or refuse.',
      ),
    numberOfPages: joi.number().optional().allow(null),
    objections: joi
      .string()
      .valid(...OBJECTIONS_OPTIONS)
      .optional(),
    ordinalValue: joi.string().optional(),
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrimary: joi
      .boolean()
      .optional()
      .description('Use the primary contact to compose the filedBy text.'),
    partySecondary: joi
      .boolean()
      .optional()
      .description('Use the secondary contact to compose the filedBy text.'),
    pending: joi.boolean().optional(),
    previousDocument: joi.object().optional(),
    privatePractitioners: joi
      .array()
      .items({ name: joi.string().max(500).required() })
      .optional()
      .description(
        'Practitioner names to be used to compose the filedBy text.',
      ),
    processingStatus: joi.string().optional(),
    qcAt: joiStrictTimestamp.optional(),
    qcByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
    receivedAt: joiStrictTimestamp.optional(),
    relationship: joi
      .string()
      .valid(...DOCUMENT_RELATIONSHIPS)
      .optional(),
    scenario: joi
      .string()
      .valid(...SCENARIOS)
      .optional(),
    secondaryDate: joiStrictTimestamp
      .optional()
      .description(
        'A secondary date associated with the document, typically related to time-restricted availability.',
      ),
    servedAt: joi
      .alternatives()
      .conditional('servedParties', {
        is: joi.exist().not(null),
        otherwise: joiStrictTimestamp.optional(),
        then: joiStrictTimestamp.required(),
      })
      .description('When the document is served on the parties.'),
    servedParties: joi
      .array()
      .items({ name: joi.string().max(500).required() })
      .when('servedAt', {
        is: joi.exist().not(null),
        otherwise: joi.optional(),
        then: joi.required(),
      })
      .description('The parties to whom the document has been served.'),
    serviceDate: joiStrictTimestamp
      .max('now')
      .optional()
      .allow(null)
      .description('Certificate of service date.'),
    serviceStamp: joi.string().optional(),
    signedAt: joi
      .string()
      .when('draftState', {
        is: joi.exist().not(null),
        otherwise: joi.when('documentType', {
          is: joi.valid(...ORDER_TYPES.map(t => t.documentType)),
          otherwise: joi.optional().allow(null),
          then: joi.required(),
        }),
        then: joi.optional().allow(null),
      })
      .description('The time at which the document was signed.'),
    signedByUserId: joi
      .when('signedJudgeName', {
        is: joi.exist().not(null),
        otherwise: joi
          .string()
          .uuid({
            version: ['uuidv4'],
          })
          .optional()
          .allow(null),
        then: joi
          .string()
          .uuid({
            version: ['uuidv4'],
          })
          .required(),
      })
      .description('The id of the user who applied the signature.'),
    signedJudgeName: joi
      .when('draftState', {
        is: joi.exist().not(null),
        otherwise: joi.when('documentType', {
          is: joi.string().valid(...ORDER_TYPES.map(t => t.documentType)),
          otherwise: joi.string().optional().allow(null),
          then: joi.string().required(),
        }),
        then: joi.string().optional().allow(null),
      })
      .description('The judge who signed the document.'),
    supportingDocument: joi.string().optional().allow(null),
    trialLocation: joi
      .string()
      .optional()
      .allow(null)
      .description(
        'An optional trial location used when generating a fully concatenated document title.',
      ),
    userId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    workItems: joi.array().optional(),
  }),
);

/**
 *
 * @param {WorkItem} workItem the work item to add to the document
 */
Document.prototype.addWorkItem = function (workItem) {
  this.workItems = [...this.workItems, workItem];
};

/**
 * sets the document as archived (used to hide from the ui)
 *
 */
Document.prototype.archive = function () {
  this.archived = true;
};

Document.prototype.setAsServed = function (servedParties = null) {
  this.servedAt = createISODateString();
  this.draftState = null;

  if (servedParties) {
    this.servedParties = servedParties;
  }
};

/**
 * generates the filedBy string from parties selected for the document
and contact info from the case detail
 *
 * @param {object} caseDetail the case detail
 * @param {boolean} force flag to force filedBy's generation
 */
Document.prototype.generateFiledBy = function (caseDetail, force = false) {
  if (force || !this.filedBy) {
    let filedByArray = [];
    this.partyIrsPractitioner && filedByArray.push('Resp.');

    Array.isArray(this.privatePractitioners) &&
      this.privatePractitioners.forEach(practitioner => {
        practitioner.partyPrivatePractitioner &&
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
 * @param {string} signByUserId the user id of the user who signed the document
 * @param {string} signedJudgeName the judge's signature for the document
 *
 */
Document.prototype.setSigned = function (signByUserId, signedJudgeName) {
  this.signedByUserId = signByUserId;
  this.signedJudgeName = signedJudgeName;
  this.signedAt = createISODateString();
  this.draftState = null;
};

/**
 * attaches a qc date and a user to the document
 *
 * @param {object} user the user completing QC process
 */
Document.prototype.setQCed = function (user) {
  this.qcByUser = user;
  this.qcAt = createISODateString();
};

Document.prototype.unsignDocument = function () {
  this.signedAt = null;
  this.signedJudgeName = null;
  this.signedByUserId = null;
};

Document.prototype.setAsProcessingStatusAsCompleted = function () {
  this.processingStatus = 'complete';
};

Document.prototype.getQCWorkItem = function () {
  return this.workItems.find(workItem => workItem.isQC === true);
};

Document.prototype.isAutoServed = function () {
  const externalDocumentTypes = flatten(
    Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
  ).map(t => t.documentType);

  const isExternalDocumentType = externalDocumentTypes.includes(
    this.documentType,
  );
  const isPractitionerAssociationDocumentType = PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES.includes(
    this.documentType,
  );
  //if fully concatenated document title includes the word Simultaneous, do not auto-serve
  const isSimultaneous = (this.documentTitle || this.documentType).includes(
    'Simultaneous',
  );

  return (
    (isExternalDocumentType || isPractitionerAssociationDocumentType) &&
    !isSimultaneous
  );
};

Document.prototype.setNumberOfPages = function (numberOfPages) {
  this.numberOfPages = numberOfPages;
};

/**
 * retrieves formatted document type (stripped eventCode, without the dash).
 * if it's TCOP - TC Opinion, it retrieves TC Opinion.
 * if it's Summary Opinion, then it returns Summary Opinion
 *
 * @param {string} documentType document type to strip the event code
 * @returns {string} formatted document type
 */
Document.getFormattedType = function (documentType) {
  return documentType.split('-').slice(-1).join('').trim();
};

exports.Document = Document;
