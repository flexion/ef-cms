const joi = require('@hapi/joi');
const {
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_INTERNAL_CATEGORY_MAP,
  DOCUMENT_RELATIONSHIPS,
  INITIAL_DOCUMENT_TYPES,
  NOTICE_OF_DOCKET_CHANGE,
  NOTICE_OF_TRIAL,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
  TRACKED_DOCUMENT_TYPES,
} = require('./EntityConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { flatten } = require('lodash');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const { Order } = require('./orders/Order');
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

const practitionerAssociationDocumentTypes = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

Document.SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: NOTICE_OF_DOCKET_CHANGE,
  noticeOfTrial: NOTICE_OF_TRIAL,
  standingPretrialNotice: STANDING_PRETRIAL_NOTICE,
  standingPretrialOrder: STANDING_PRETRIAL_ORDER,
};

Document.SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

Document.isPendingOnCreation = rawDocument => {
  const isPending = Object.values(TRACKED_DOCUMENT_TYPES).some(trackedType => {
    return (
      (rawDocument.category && trackedType.category === rawDocument.category) ||
      (rawDocument.eventCode && trackedType.eventCode === rawDocument.eventCode)
    );
  });
  return isPending;
};

Document.getDocumentTypes = () => {
  const allFilingEvents = flatten([
    ...Object.values(DOCUMENT_CATEGORY_MAP),
    ...Object.values(DOCUMENT_INTERNAL_CATEGORY_MAP),
  ]);
  const filingEventTypes = allFilingEvents.map(t => t.documentType);
  const orderDocTypes = Order.ORDER_TYPES.map(t => t.documentType);
  const courtIssuedDocTypes = COURT_ISSUED_EVENT_CODES.map(t => t.documentType);
  const initialTypes = Object.keys(INITIAL_DOCUMENT_TYPES).map(
    t => INITIAL_DOCUMENT_TYPES[t].documentType,
  );
  const signedTypes = Object.keys(Document.SIGNED_DOCUMENT_TYPES).map(
    t => Document.SIGNED_DOCUMENT_TYPES[t].documentType,
  );
  const systemGeneratedTypes = Object.keys(
    Document.SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(t => Document.SYSTEM_GENERATED_DOCUMENT_TYPES[t].documentType);

  const documentTypes = [
    ...initialTypes,
    ...practitionerAssociationDocumentTypes,
    ...filingEventTypes,
    ...orderDocTypes,
    ...courtIssuedDocTypes,
    ...signedTypes,
    ...systemGeneratedTypes,
  ];

  return documentTypes;
};

/**
 *
 * @returns {Array} event codes defined in the Document entity
 */
Document.eventCodes = [
  INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
  INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  INITIAL_DOCUMENT_TYPES.petition.eventCode,
  INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
  INITIAL_DOCUMENT_TYPES.stin.eventCode,
  NOTICE_OF_DOCKET_CHANGE.eventCode,
  NOTICE_OF_TRIAL.eventCode,
  STANDING_PRETRIAL_NOTICE.eventCode,
  STANDING_PRETRIAL_ORDER.eventCode,
  // TODO: Move these constants
  'MISL',
  'FEE',
  'FEEW',
  'MGRTED',
  'MIND',
  'MINC',
];

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
    certificateOfServiceDate: joi.when('certificateOfService', {
      is: true,
      otherwise: joi.optional(),
      then: joiStrictTimestamp.required(),
    }),
    createdAt: joiStrictTimestamp
      .required()
      .description('When the Document was added to the system.'),
    date: joi
      .date()
      .iso()
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
      .valid(...Document.getDocumentTypes())
      .required()
      .description('The type of this document.'),
    draftState: joi.object().allow(null).optional(),
    entityName: joi.string().valid('Document').required(),
    eventCode: joi.string().optional(),
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
      .optional()
      .description('The judge associated with the document.'),
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
    servedAt: joiStrictTimestamp
      .optional()
      .description('When the document is served on the parties.'),
    servedParties: joi
      .array()
      .items({ name: joi.string().max(500).required() })
      .optional(),
    serviceDate: joiStrictTimestamp
      .max('now')
      .optional()
      .allow(null)
      .description('Certificate of service date.'),
    serviceStamp: joi.string().optional(),
    signedAt: joiStrictTimestamp.optional().allow(null),
    signedByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
    signedJudgeName: joi.string().optional().allow(null),
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
    Object.values(DOCUMENT_CATEGORY_MAP),
  ).map(t => t.documentType);

  const isExternalDocumentType = externalDocumentTypes.includes(
    this.documentType,
  );
  const isPractitionerAssociationDocumentType = practitionerAssociationDocumentTypes.includes(
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
