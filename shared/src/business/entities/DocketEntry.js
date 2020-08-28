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
  SERVED_PARTIES_CODES,
  TRACKED_DOCUMENT_TYPES,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { User } = require('./User');
const { WorkItem } = require('./WorkItem');

/**
 * constructor
 *
 * @param {object} rawDocketEntry the raw document data
 * @constructor
 */
function DocketEntry() {
  this.entityName = 'DocketEntry';
}

DocketEntry.prototype.init = function init(
  rawDocketEntry,
  { applicationContext, filtered = false },
) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    this.draftState = rawDocketEntry.draftState;
    this.isDraft = rawDocketEntry.isDraft || false;
    this.judge = rawDocketEntry.judge;
    this.pending =
      rawDocketEntry.pending === undefined
        ? DocketEntry.isPendingOnCreation(rawDocketEntry)
        : rawDocketEntry.pending;
    if (rawDocketEntry.previousDocument) {
      this.previousDocument = {
        docketEntryId: rawDocketEntry.previousDocument.docketEntryId,
        documentTitle: rawDocketEntry.previousDocument.documentTitle,
        documentType: rawDocketEntry.previousDocument.documentType,
      };
    }
    this.processingStatus = rawDocketEntry.processingStatus || 'pending';
    this.qcAt = rawDocketEntry.qcAt;
    this.qcByUserId = rawDocketEntry.qcByUserId;
    this.signedAt = rawDocketEntry.signedAt;
    this.signedByUserId = rawDocketEntry.signedByUserId;
    this.signedJudgeName = rawDocketEntry.signedJudgeName;
    this.userId = rawDocketEntry.userId;
    this.workItem = rawDocketEntry.workItem
      ? new WorkItem(rawDocketEntry.workItem, { applicationContext })
      : undefined;
  }

  this.action = rawDocketEntry.action;
  this.additionalInfo = rawDocketEntry.additionalInfo;
  this.additionalInfo2 = rawDocketEntry.additionalInfo2;
  this.addToCoversheet = rawDocketEntry.addToCoversheet;
  this.archived = rawDocketEntry.archived;
  this.attachments = rawDocketEntry.attachments;
  this.certificateOfService = rawDocketEntry.certificateOfService;
  this.certificateOfServiceDate = rawDocketEntry.certificateOfServiceDate;
  this.createdAt = rawDocketEntry.createdAt || createISODateString();
  this.date = rawDocketEntry.date;
  this.description = rawDocketEntry.description;
  this.docketEntryId =
    rawDocketEntry.docketEntryId || applicationContext.getUniqueId();
  this.docketEntryIdBeforeSignature =
    rawDocketEntry.docketEntryIdBeforeSignature;
  this.docketNumber = rawDocketEntry.docketNumber;
  this.docketNumbers = rawDocketEntry.docketNumbers;
  this.documentContentsId = rawDocketEntry.documentContentsId;
  this.documentTitle = rawDocketEntry.documentTitle;
  this.documentType = rawDocketEntry.documentType;
  this.editState = rawDocketEntry.editState;
  this.eventCode = rawDocketEntry.eventCode;
  this.filedBy = rawDocketEntry.filedBy;
  this.filingDate = rawDocketEntry.filingDate || createISODateString();
  this.freeText = rawDocketEntry.freeText;
  this.freeText2 = rawDocketEntry.freeText2;
  this.hasOtherFilingParty = rawDocketEntry.hasOtherFilingParty;
  this.hasSupportingDocuments = rawDocketEntry.hasSupportingDocuments;
  this.index = rawDocketEntry.index;
  this.isAutoGenerated = rawDocketEntry.isAutoGenerated;
  this.isFileAttached = rawDocketEntry.isFileAttached;
  this.isLegacy = rawDocketEntry.isLegacy;
  this.isLegacySealed = rawDocketEntry.isLegacySealed;
  this.isLegacyServed = rawDocketEntry.isLegacyServed;
  this.isPaper = rawDocketEntry.isPaper;
  this.isSealed = rawDocketEntry.isSealed;
  this.isStricken = rawDocketEntry.isStricken || false;
  this.lodged = rawDocketEntry.lodged;
  this.mailingDate = rawDocketEntry.mailingDate;
  this.numberOfPages = rawDocketEntry.numberOfPages;
  this.objections = rawDocketEntry.objections;
  this.ordinalValue = rawDocketEntry.ordinalValue;
  this.otherFilingParty = rawDocketEntry.otherFilingParty;
  this.partyIrsPractitioner = rawDocketEntry.partyIrsPractitioner;
  this.partyPrimary = rawDocketEntry.partyPrimary;
  this.partySecondary = rawDocketEntry.partySecondary;
  this.receivedAt = rawDocketEntry.receivedAt || createISODateString();
  this.relationship = rawDocketEntry.relationship;
  this.scenario = rawDocketEntry.scenario;
  this.secondaryDate = rawDocketEntry.secondaryDate;
  this.secondaryDocument = rawDocketEntry.secondaryDocument;
  this.servedAt = rawDocketEntry.servedAt;
  this.servedPartiesCode = rawDocketEntry.servedPartiesCode;
  this.serviceDate = rawDocketEntry.serviceDate;
  this.serviceStamp = rawDocketEntry.serviceStamp;
  this.strickenAt = rawDocketEntry.strickenAt;
  this.strickenBy = rawDocketEntry.strickenBy;
  this.strickenByUserId = rawDocketEntry.strickenByUserId;
  this.supportingDocument = rawDocketEntry.supportingDocument;
  this.trialLocation = rawDocketEntry.trialLocation;

  // only share the userId with an external user if it is the logged in user
  if (applicationContext.getCurrentUser().userId === rawDocketEntry.userId) {
    this.userId = rawDocketEntry.userId;
  }

  // only use the privatePractitioner name
  if (Array.isArray(rawDocketEntry.privatePractitioners)) {
    this.privatePractitioners = rawDocketEntry.privatePractitioners.map(
      item => {
        return {
          name: item.name,
          partyPrivatePractitioner: item.partyPrivatePractitioner,
        };
      },
    );
  }

  if (Array.isArray(rawDocketEntry.servedParties)) {
    this.servedParties = rawDocketEntry.servedParties.map(item => {
      return {
        email: item.email,
        name: item.name,
        role: item.role,
      };
    });
  } else {
    this.servedParties = rawDocketEntry.servedParties;
  }

  if (DOCUMENT_NOTICE_EVENT_CODES.includes(rawDocketEntry.eventCode)) {
    this.signedAt = createISODateString();
  }

  this.generateFiledBy(rawDocketEntry);
};

DocketEntry.isPendingOnCreation = rawDocketEntry => {
  const isPending = Object.values(TRACKED_DOCUMENT_TYPES).some(trackedType => {
    return (
      (rawDocketEntry.category &&
        trackedType.category === rawDocketEntry.category) ||
      (rawDocketEntry.eventCode &&
        trackedType.eventCode === rawDocketEntry.eventCode)
    );
  });
  return isPending;
};

DocketEntry.validationName = 'DocketEntry';

DocketEntry.VALIDATION_RULES = joi.object().keys({
  action: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('Action taken in response to this Docket Record item.'),
  addToCoversheet: joi.boolean().optional(),
  additionalInfo: JoiValidationConstants.STRING.max(500).optional(),
  additionalInfo2: JoiValidationConstants.STRING.max(500).optional(),
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
  description: JoiValidationConstants.STRING.max(500)
    .required()
    .description(
      'Text that describes this Docket Record item, which may be part of the Filings and Proceedings value.',
    ),
  docketEntryId: JoiValidationConstants.UUID.required().description(
    'ID of the associated PDF document in the S3 bucket.',
  ),
  docketEntryIdBeforeSignature: JoiValidationConstants.UUID.optional().description(
    'The id for the original document that was uploaded.',
  ),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.optional().description(
    'Docket Number of the associated Case in XXXXX-YY format.',
  ),
  docketNumbers: JoiValidationConstants.STRING.max(500)
    .optional()
    .description(
      'Optional Docket Number text used when generating a fully concatenated document title.',
    ),
  documentContentsId: JoiValidationConstants.UUID.optional().description(
    'The S3 ID containing the text contents of the document.',
  ),
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional().description(
    'The title of this document.',
  ),
  documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
    .required()
    .description('The type of this document.'),
  draftState: joi.object().allow(null).optional(),
  editState: JoiValidationConstants.STRING.max(4000)
    .allow(null)
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('JSON representation of the in-progress edit of this item.'),
  entityName: JoiValidationConstants.STRING.valid('DocketEntry').required(),
  eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES).required(),
  filedBy: JoiValidationConstants.STRING.max(500)
    .when('documentType', {
      is: JoiValidationConstants.STRING.valid(
        ...EXTERNAL_DOCUMENT_TYPES,
        ...INTERNAL_DOCUMENT_TYPES,
      ),
      otherwise: joi.allow('').optional(),
      then: joi.when('documentType', {
        is: JoiValidationConstants.STRING.valid(
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
    .meta({ tags: ['Restricted'] })
    .description(
      'The party who filed the document, either the petitioner or respondent on the case.',
    ),
  filingDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description('Date that this Document was filed.'),
  freeText: JoiValidationConstants.STRING.max(500).optional(),
  freeText2: JoiValidationConstants.STRING.max(500).optional(),
  hasOtherFilingParty: joi
    .boolean()
    .optional()
    .description('Whether the document has other filing party.'),
  hasSupportingDocuments: joi.boolean().optional(),
  index: joi
    .number()
    .integer()
    .optional()
    .description('Index of this item in the Docket Record list.'),
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
  isLegacyServed: joi
    .boolean()
    .optional()
    .description(
      'Indicates whether or not the legacy document was served prior to being migrated to the new system.',
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
  isStricken: joi
    .boolean()
    .required()
    .description('Indicates the item has been removed from the docket record.'),
  judge: JoiValidationConstants.STRING.max(100)
    .allow(null)
    .description('The judge associated with the document.')
    .when('documentType', {
      is: JoiValidationConstants.STRING.valid(
        ...OPINION_DOCUMENT_TYPES.map(t => t.documentType),
      ),
      otherwise: joi.optional(),
      then: joi.required(),
    }),
  lodged: joi
    .boolean()
    .optional()
    .description(
      'A lodged document is awaiting action by the judge to enact or refuse.',
    ),
  mailingDate: JoiValidationConstants.STRING.max(100).optional(),
  numberOfPages: joi.number().optional().allow(null),
  objections: JoiValidationConstants.STRING.valid(
    ...OBJECTIONS_OPTIONS,
  ).optional(),
  ordinalValue: JoiValidationConstants.STRING.optional(),
  otherFilingParty: JoiValidationConstants.STRING.max(100)
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
  previousDocument: joi
    .object()
    .keys({
      docketEntryId: JoiValidationConstants.UUID.optional().description(
        'The ID of the previous document.',
      ),
      documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional().description(
        'The title of the previous document.',
      ),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .optional()
        .description('The type of the previous document.'),
    })
    .optional(),
  privatePractitioners: joi // TODO: limit keys
    .array()
    .items({ name: JoiValidationConstants.STRING.max(100).required() })
    .optional()
    .description('Practitioner names to be used to compose the filedBy text.'),
  processingStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCUMENT_PROCESSING_STATUS_OPTIONS),
  ).optional(),
  qcAt: JoiValidationConstants.ISO_DATE.optional(),
  qcByUserId: JoiValidationConstants.UUID.optional().allow(null),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
  relationship: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCUMENT_RELATIONSHIPS),
  ).optional(),
  scenario: JoiValidationConstants.STRING.valid(...SCENARIOS).optional(),
  secondaryDate: JoiValidationConstants.ISO_DATE.optional().description(
    'A secondary date associated with the document, typically related to time-restricted availability. Used to build the document title for TRAN documents.',
  ),
  secondaryDocument: joi // TODO: limit keys
    .object()
    .keys({
      documentTitle: JoiValidationConstants.STRING.max(500)
        .optional()
        .description('The title of the secondary document.'),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .required()
        .description('The type of the secondary document.'),
      eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
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
      name: JoiValidationConstants.STRING.max(100)
        .required()
        .description('The name of a party from a contact, or "IRS"'),
      role: JoiValidationConstants.STRING.valid(...Object.values(ROLES))
        .optional()
        .description('Currently only required for the IRS'),
    })
    .when('servedAt', {
      is: joi.exist().not(null),
      otherwise: joi.optional(),
      then: joi.required(),
    })
    .description('The parties to whom the document has been served.'),
  servedPartiesCode: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVED_PARTIES_CODES),
  )
    .allow(null)
    .optional()
    .description('Served parties code to override system-computed code.'),
  serviceDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .allow(null)
    .description(
      'Used by certificate of service documents to construct the document title.',
    ),
  serviceStamp: JoiValidationConstants.STRING.optional(),
  signedAt: JoiValidationConstants.STRING.max(100)
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
  signedJudgeName: JoiValidationConstants.STRING.max(100)
    .when('isDraft', {
      is: false,
      otherwise: joi.optional().allow(null),
      then: joi.when('eventCode', {
        is: JoiValidationConstants.STRING.valid(
          ...EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
        ),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    })
    .description('The judge who signed the document.'),
  strickenAt: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .description('Date that this Docket Record item was stricken.'),
  strickenBy: JoiValidationConstants.STRING.optional(),
  strickenByUserId: JoiValidationConstants.STRING.optional(),
  supportingDocument: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null),
  trialLocation: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description(
      'An optional trial location used when generating a fully concatenated document title.',
    ),
  userId: JoiValidationConstants.UUID.required(),
  workItem: WorkItem.VALIDATION_RULES.optional(),
});

DocketEntry.VALIDATION_ERROR_MESSAGES = {
  description: 'Enter a description',
  eventCode: 'Enter an event code',
  filingDate: 'Enter a valid filing date',
};

joiValidationDecorator(
  DocketEntry,
  DocketEntry.VALIDATION_RULES,
  DocketEntry.VALIDATION_ERROR_MESSAGES,
);

/**
 *
 * @param {WorkItem} workItem the work item to add to the document
 */
DocketEntry.prototype.setWorkItem = function (workItem) {
  this.workItem = workItem;
};

/**
 * sets the document as archived (used to hide from the ui)
 *
 */
DocketEntry.prototype.archive = function () {
  this.archived = true;
};

DocketEntry.prototype.setAsServed = function (servedParties = null) {
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
DocketEntry.prototype.generateFiledBy = function (caseDetail) {
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
DocketEntry.prototype.setSigned = function (signByUserId, signedJudgeName) {
  this.signedByUserId = signByUserId;
  this.signedJudgeName = signedJudgeName;
  this.signedAt = createISODateString();
};

/**
 * attaches a qc date and a user to the document
 *
 * @param {object} user the user completing QC process
 */
DocketEntry.prototype.setQCed = function (user) {
  this.qcByUserId = user.userId;
  this.qcAt = createISODateString();
};

DocketEntry.prototype.unsignDocument = function () {
  this.signedAt = null;
  this.signedJudgeName = null;
  this.signedByUserId = null;
};

DocketEntry.prototype.setAsProcessingStatusAsCompleted = function () {
  this.processingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
};

DocketEntry.prototype.isAutoServed = function () {
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

DocketEntry.prototype.isCourtIssued = function () {
  return COURT_ISSUED_DOCUMENT_TYPES.includes(this.documentType);
};

DocketEntry.prototype.setNumberOfPages = function (numberOfPages) {
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
DocketEntry.getFormattedType = function (documentType) {
  return documentType.split('-').slice(-1).join('').trim();
};

/**
 * sets the number of pages for the docket entry
 *
 * @param {Number} numberOfPages the number of pages
 */
DocketEntry.prototype.setNumberOfPages = function (numberOfPages) {
  this.numberOfPages = numberOfPages;
};

/**
 * strikes this docket record
 *
 * @param {object} obj param
 * @param {string} obj.name user name
 * @param {string} obj.userId user id
 */
DocketEntry.prototype.strikeEntry = function ({ name, userId }) {
  this.isStricken = true;
  this.strickenBy = name;
  this.strickenByUserId = userId;
  this.strickenAt = createISODateString();
};

exports.DocketEntry = validEntityDecorator(DocketEntry);
