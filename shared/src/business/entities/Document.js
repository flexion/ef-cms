const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
  AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  ROLES,
  SCENARIOS,
  TRACKED_DOCUMENT_TYPES,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { User } = require('./User');
const { WorkItem } = require('./WorkItem');

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
    this.isDraft = rawDocument.isDraft || false;
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
  this.hasOtherFilingParty = rawDocument.hasOtherFilingParty;
  this.hasSupportingDocuments = rawDocument.hasSupportingDocuments;
  this.isAutoGenerated = rawDocument.isAutoGenerated;
  this.isFileAttached = rawDocument.isFileAttached;
  this.isPaper = rawDocument.isPaper;
  this.isLegacy = rawDocument.isLegacy;
  this.isSealed = rawDocument.isSealed;
  this.isLegacySealed = rawDocument.isLegacySealed;
  this.lodged = rawDocument.lodged;
  this.mailingDate = rawDocument.mailingDate;
  this.objections = rawDocument.objections;
  this.documentIdBeforeSignature = rawDocument.documentIdBeforeSignature;
  this.ordinalValue = rawDocument.ordinalValue;
  this.otherFilingParty = rawDocument.otherFilingParty;
  this.partyPrimary = rawDocument.partyPrimary;
  this.partyIrsPractitioner = rawDocument.partyIrsPractitioner;
  this.partySecondary = rawDocument.partySecondary;
  this.receivedAt = rawDocument.receivedAt || createISODateString();
  this.relationship = rawDocument.relationship;
  this.scenario = rawDocument.scenario;
  this.secondaryDate = rawDocument.secondaryDate;
  this.secondaryDocument = rawDocument.secondaryDocument;
  this.servedAt = rawDocument.servedAt;
  this.numberOfPages = rawDocument.numberOfPages;
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

  if (Array.isArray(rawDocument.servedParties)) {
    this.servedParties = rawDocument.servedParties.map(item => {
      return {
        email: item.email,
        name: item.name,
        role: item.role,
      };
    });
  } else {
    this.servedParties = rawDocument.servedParties;
  }

  if (DOCUMENT_NOTICE_EVENT_CODES.includes(rawDocument.eventCode)) {
    this.signedAt = createISODateString();
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

Document.VALIDATION_RULES = joi.object().keys({
  addToCoversheet: joi.boolean().optional(),
  additionalInfo: joi.string().max(500).optional(),
  additionalInfo2: joi.string().max(500).optional(),
  archived: joi
    .boolean()
    .optional()
    .description(
      'A document that was archived instead of added to the Docket Record.',
    ),
  attachments: joi.boolean().optional(),
  certificateOfService: joi.boolean().optional(),
  certificateOfServiceDate: JoiValidationConstants.ISO_DATE.when(
    'certificateOfService',
    {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    },
  ),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the Document was added to the system.',
  ),
  date: JoiValidationConstants.ISO_DATE.optional()
    .allow(null)
    .description(
      'An optional date used when generating a fully concatenated document title.',
    ),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.optional().description(
    'Docket Number of the associated Case in XXXXX-YY format.',
  ),
  docketNumbers: joi
    .string()
    .max(500)
    .optional()
    .description(
      'Optional Docket Number text used when generating a fully concatenated document title.',
    ),
  documentContentsId: JoiValidationConstants.UUID.optional().description(
    'The S3 ID containing the text contents of the document.',
  ),
  documentId: JoiValidationConstants.UUID.required().description(
    'ID of the associated PDF document in the S3 bucket.',
  ),
  documentIdBeforeSignature: JoiValidationConstants.UUID.optional().description(
    'The id for the original document that was uploaded.',
  ),
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional().description(
    'The title of this document.',
  ),
  documentType: joi
    .string()
    .valid(...ALL_DOCUMENT_TYPES)
    .required()
    .description('The type of this document.'),
  draftState: joi.object().allow(null).optional(),
  entityName: joi.string().valid('Document').required(),
  eventCode: joi
    .string()
    .valid(...ALL_EVENT_CODES)
    .required(),
  filedBy: joi
    .string()
    .max(500)
    .when('documentType', {
      is: joi
        .string()
        .valid(...EXTERNAL_DOCUMENT_TYPES, ...INTERNAL_DOCUMENT_TYPES),
      otherwise: joi.allow('').optional(),
      then: joi.when('documentType', {
        is: joi
          .string()
          .valid(
            ...AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
            ...AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
          ),
        otherwise: joi.required(),
        then: joi.when('isAutoGenerated', {
          is: false,
          otherwise: joi.allow('').optional(),
          then: joi.required(),
        }),
      }),
    })
    .description(
      'The party who filed the document, either the petitioner or respondent on the case.',
    ),
  filingDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description('Date that this Document was filed.'),
  freeText: joi.string().max(500).optional(),
  freeText2: joi.string().max(500).optional(),
  hasOtherFilingParty: joi
    .boolean()
    .optional()
    .description('Whether the document has other filing party.'),
  hasSupportingDocuments: joi.boolean().optional(),
  isAutoGenerated: joi
    .boolean()
    .optional()
    .description(
      'A flag that indicates when a document was generated by the system as opposed to being uploaded by a user.',
    ),
  isDraft: joi
    .boolean()
    .required()
    .description('Whether the document is a draft (not on the docket record).'),
  isFileAttached: joi
    .boolean()
    .optional()
    .description('Has an associated PDF in S3.'),
  isLegacy: joi
    .boolean()
    .when('isLegacySealed', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required().valid(true),
    })
    .description(
      'Indicates whether or not the document belongs to a legacy case that has been migrated to the new system.',
    ),
  isLegacySealed: joi
    .boolean()
    .optional()
    .description(
      'Indicates whether or not the legacy document was sealed prior to being migrated to the new system.',
    ),
  isPaper: joi.boolean().optional(),
  isSealed: joi
    .boolean()
    .when('isLegacySealed', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required().valid(true),
    })
    .description('Indicates whether or not the document is sealed.'),
  judge: joi
    .string()
    .max(100)
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
  mailingDate: joi.string().max(100).optional(),
  numberOfPages: joi.number().optional().allow(null),
  objections: joi
    .string()
    .valid(...OBJECTIONS_OPTIONS)
    .optional(),
  ordinalValue: joi.string().optional(),
  otherFilingParty: joi
    .string()
    .max(100)
    .when('hasOtherFilingParty', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required(),
    })
    .description(
      'When someone other than the petitioner or respondent files a document, this is the name of the person who filed that document',
    ),
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
  privatePractitioners: joi // TODO: limit keys
    .array()
    .items({ name: joi.string().max(100).required() })
    .optional()
    .description('Practitioner names to be used to compose the filedBy text.'),
  processingStatus: joi
    .string()
    .valid(...Object.values(DOCUMENT_PROCESSING_STATUS_OPTIONS))
    .optional(),
  qcAt: JoiValidationConstants.ISO_DATE.optional(),
  qcByUserId: JoiValidationConstants.UUID.optional().allow(null),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
  relationship: joi
    .string()
    .valid(...Object.values(DOCUMENT_RELATIONSHIPS))
    .optional(),
  scenario: joi
    .string()
    .valid(...SCENARIOS)
    .optional(),
  secondaryDate: JoiValidationConstants.ISO_DATE.optional().description(
    'A secondary date associated with the document, typically related to time-restricted availability. Used to build the document title for TRAN documents.',
  ),
  secondaryDocument: joi // TODO: limit keys
    .object()
    .keys({
      documentTitle: joi
        .string()
        .max(500)
        .optional()
        .description('The title of the secondary document.'),
      documentType: joi
        .string()
        .valid(...ALL_DOCUMENT_TYPES)
        .required()
        .description('The type of the secondary document.'),
      eventCode: joi
        .string()
        .valid(...ALL_EVENT_CODES)
        .required()
        .description('The event code of the secondary document.'),
    })
    .when('scenario', {
      is: 'Nonstandard H',
      otherwise: joi.forbidden(),
      then: joi.optional(),
    })
    .description('The secondary document.'),
  servedAt: joi
    .alternatives()
    .conditional('servedParties', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.optional(),
      then: JoiValidationConstants.ISO_DATE.required(),
    })
    .description('When the document is served on the parties.'),
  servedParties: joi
    .array()
    .items({
      email: JoiValidationConstants.EMAIL.optional(),
      name: joi
        .string()
        .max(100)
        .required()
        .description('The name of a party from a contact, or "IRS"'),
      role: joi
        .string()
        .valid(...Object.values(ROLES))
        .optional()
        .description('Currently only required for the IRS'),
    })
    .when('servedAt', {
      is: joi.exist().not(null),
      otherwise: joi.optional(),
      then: joi.required(),
    })
    .description('The parties to whom the document has been served.'),
  serviceDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .allow(null)
    .description(
      'Used by certificate of service documents to construct the document title.',
    ),
  serviceStamp: joi.string().optional(),
  signedAt: joi
    .string()
    .max(100)
    .when('isDraft', {
      is: false,
      otherwise: joi.optional().allow(null),
      then: joi.when('eventCode', {
        is: joi.valid(...EVENT_CODES_REQUIRING_SIGNATURE),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    })
    .description('The time at which the document was signed.'),
  signedByUserId: joi
    .when('signedJudgeName', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.UUID.optional().allow(null),
      then: JoiValidationConstants.UUID.required(),
    })
    .description('The id of the user who applied the signature.'),
  signedJudgeName: joi // TODO: limit string size
    .when('isDraft', {
      is: false,
      otherwise: joi.string().optional().allow(null),
      then: joi.when('eventCode', {
        is: joi.string().valid(...EVENT_CODES_REQUIRING_JUDGE_SIGNATURE),
        otherwise: joi.string().optional().allow(null),
        then: joi.string().required(),
      }),
    })
    .description('The judge who signed the document.'),
  supportingDocument: joi.string().optional().allow(null), // TODO: limit string size
  trialLocation: joi // TODO: limit string size
    .string()
    .optional()
    .allow(null)
    .description(
      'An optional trial location used when generating a fully concatenated document title.',
    ),
  userId: JoiValidationConstants.UUID.required(),
  workItems: joi.array().optional(),
});

joiValidationDecorator(Document, Document.VALIDATION_RULES);

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
 */
Document.prototype.generateFiledBy = function (caseDetail) {
  if (!this.filedBy) {
    let partiesArray = [];
    this.partyIrsPractitioner && partiesArray.push('Resp.');

    Array.isArray(this.privatePractitioners) &&
      this.privatePractitioners.forEach(practitioner => {
        practitioner.partyPrivatePractitioner &&
          partiesArray.push(`Counsel ${practitioner.name}`);
      });

    if (
      this.partyPrimary &&
      !this.partySecondary &&
      caseDetail.contactPrimary
    ) {
      partiesArray.push(`Petr. ${caseDetail.contactPrimary.name}`);
    } else if (
      this.partySecondary &&
      !this.partyPrimary &&
      caseDetail.contactSecondary
    ) {
      partiesArray.push(`Petr. ${caseDetail.contactSecondary.name}`);
    } else if (
      this.partyPrimary &&
      this.partySecondary &&
      caseDetail.contactPrimary &&
      caseDetail.contactSecondary
    ) {
      partiesArray.push(
        `Petrs. ${caseDetail.contactPrimary.name} & ${caseDetail.contactSecondary.name}`,
      );
    }

    const filedByArray = [];
    if (partiesArray.length) {
      filedByArray.push(partiesArray.join(' & '));
    }
    if (this.otherFilingParty) {
      filedByArray.push(this.otherFilingParty);
    }

    const filedByString = filedByArray.join(', ');
    if (filedByString) {
      this.filedBy = filedByString;
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
  this.processingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
};

Document.prototype.getQCWorkItem = function () {
  return this.workItems[0];
};

Document.prototype.isAutoServed = function () {
  const isExternalDocumentType = EXTERNAL_DOCUMENT_TYPES.includes(
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

Document.prototype.isCourtIssued = function () {
  return COURT_ISSUED_DOCUMENT_TYPES.includes(this.documentType);
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
