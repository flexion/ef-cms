const joi = require('joi');
const {
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CONTACT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  MAX_FILE_SIZE_MB,
  MINUTE_ENTRIES_MAP,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES,
  ROLES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const { CaseDocketEntries } = require('./Case.docketEntries');

const {
  CaseCounsel,
  getPractitionersRepresenting,
  isUserIdRepresentedByPrivatePractitioner,
} = require('./Case.counsel');
const {
  DOCKET_ENTRY_VALIDATION_RULES,
} = require('../EntityValidationConstants');
const {
  getDocketNumberSuffix,
} = require('../../utilities/getDocketNumberSuffix');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { clone, compact } = require('lodash');
const { compareStrings } = require('../../utilities/sortFunctions');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Correspondence } = require('../Correspondence');
const { createISODateString } = require('../../utilities/DateHandler');
const { DocketEntry } = require('../DocketEntry');
const { isServed } = require('../DocketEntry');
const { Petitioner } = require('../contacts/Petitioner');
const { Statistic } = require('../Statistic');
const { TrialsAndHearings } = require('./Case.trialsAndHearings');
const { User } = require('../User');

Case.VALIDATION_ERROR_MESSAGES = {
  ...CaseDocketEntries.validationMessages,
  ...TrialsAndHearings.validationMessages,
  applicationForWaiverOfFilingFeeFile:
    'Upload an Application for Waiver of Filing Fee',
  applicationForWaiverOfFilingFeeFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Filing Fee Waiver file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Filing Fee Waiver file size is empty',
  ],
  caseCaption: 'Enter a case caption',
  caseType: 'Select a case type',
  docketNumber: 'Docket number is required',
  filingType: 'Select on whose behalf you are filing',
  hasIrsNotice: 'Indicate whether you received an IRS notice',
  hasVerifiedIrsNotice: 'Indicate whether you received an IRS notice',
  irsNoticeDate: [
    {
      contains: 'must be less than or equal to',
      message:
        'The IRS notice date cannot be in the future. Enter a valid date.',
    },
    'Please enter a valid IRS notice date',
  ],
  mailingDate: 'Enter a mailing date',
  ownershipDisclosureFile: 'Upload an Ownership Disclosure Statement',
  ownershipDisclosureFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Ownership Disclosure Statement file size is empty',
  ],
  partyType: 'Select a party type',
  petitionFile: 'Upload a Petition',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty',
  ],
  petitionPaymentDate: 'Enter a valid payment date',
  petitionPaymentMethod: 'Enter payment method',
  petitionPaymentStatus: 'Enter payment status',
  petitionPaymentWaivedDate: 'Enter a valid date waived',
  procedureType: 'Select a case procedure',
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'Date received cannot be in the future. Enter a valid date.',
    },
    'Enter a valid date received',
  ],
  requestForPlaceOfTrialFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Request for Place of Trial file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Request for Place of Trial file size is empty',
  ],
  sortableDocketNumber: 'Sortable docket number is required',
  stinFile: 'Upload a Statement of Taxpayer Identification Number (STIN)',
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty',
  ],
};

/**
 * Case Entity
 * Represents a Case that has already been accepted into the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function Case() {}

Object.assign(Case.prototype, CaseCounsel.prototypes);
Object.assign(Case.prototype, CaseDocketEntries.prototypes);
Object.assign(Case.prototype, TrialsAndHearings.prototypes);

Case.prototype.init = function init(
  rawCase,
  { applicationContext, filtered = false },
) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.entityName = 'Case';
  this.petitioners = [];

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    this.assignFieldsForInternalUsers({ applicationContext, rawCase });
  }

  this.assignDocketEntries({
    applicationContext,
    filtered,
    isSealedCase,
    rawCase,
  });
  this.assignHearings({ applicationContext, rawCase });
  this.assignPractitioners({ applicationContext, filtered, rawCase });
  this.assignFieldsForAllUsers({ applicationContext, filtered, rawCase });
  this.assignContacts({ applicationContext, filtered, rawCase });
};

Case.prototype.assignFieldsForInternalUsers = function assignFieldsForInternalUsers({
  applicationContext,
  rawCase,
}) {
  this.associatedJudge = rawCase.associatedJudge || CHIEF_JUDGE;
  this.automaticBlocked = rawCase.automaticBlocked;
  this.automaticBlockedDate = rawCase.automaticBlockedDate;
  this.automaticBlockedReason = rawCase.automaticBlockedReason;
  this.blocked = rawCase.blocked;
  this.blockedDate = rawCase.blockedDate;
  this.blockedReason = rawCase.blockedReason;
  this.caseNote = rawCase.caseNote;
  this.damages = rawCase.damages;
  this.highPriority = rawCase.highPriority;
  this.highPriorityReason = rawCase.highPriorityReason;
  this.judgeUserId = rawCase.judgeUserId;
  this.litigationCosts = rawCase.litigationCosts;
  this.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};
  this.status = rawCase.status || CASE_STATUS_TYPES.new;

  this.noticeOfAttachments = rawCase.noticeOfAttachments || false;
  this.orderDesignatingPlaceOfTrial =
    rawCase.orderDesignatingPlaceOfTrial || false;
  this.orderForAmendedPetition = rawCase.orderForAmendedPetition || false;
  this.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee || false;
  this.orderForFilingFee = rawCase.orderForFilingFee || false;
  this.orderForOds = rawCase.orderForOds || false;
  this.orderForRatification = rawCase.orderForRatification || false;
  this.orderToShowCause = rawCase.orderToShowCause || false;

  this.assignArchivedDocketEntries({ applicationContext, rawCase });
  this.assignStatistics({ applicationContext, rawCase });
  this.assignCorrespondences({ applicationContext, rawCase });
};

Case.prototype.assignFieldsForAllUsers = function assignFieldsForAllUsers({
  rawCase,
}) {
  this.caseCaption = rawCase.caseCaption;
  this.caseType = rawCase.caseType;
  this.closedDate = rawCase.closedDate;
  this.createdAt = rawCase.createdAt || createISODateString();
  if (rawCase.docketNumber) {
    this.docketNumber = Case.formatDocketNumber(rawCase.docketNumber);
  }
  this.docketNumberSuffix = getDocketNumberSuffix(rawCase);
  this.filingType = rawCase.filingType;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.isPaper = rawCase.isPaper;
  this.leadDocketNumber = rawCase.leadDocketNumber;
  this.mailingDate = rawCase.mailingDate;
  this.partyType = rawCase.partyType;
  this.petitionPaymentDate = rawCase.petitionPaymentDate;
  this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  this.petitionPaymentStatus =
    rawCase.petitionPaymentStatus || PAYMENT_STATUS.UNPAID;
  this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt || createISODateString();
  this.sealedDate = rawCase.sealedDate;
  this.sortableDocketNumber =
    rawCase.sortableDocketNumber || this.generateSortableDocketNumber();
  this.trialDate = rawCase.trialDate;
  this.trialLocation = rawCase.trialLocation;
  this.trialSessionId = rawCase.trialSessionId;
  this.trialTime = rawCase.trialTime;
  this.useSameAsPrimary = rawCase.useSameAsPrimary;

  this.initialDocketNumberSuffix =
    rawCase.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

  if (rawCase.caseCaption) {
    this.initialCaption = rawCase.initialCaption || this.caseCaption;
  }

  this.hasPendingItems = this.docketEntries.some(docketEntry =>
    DocketEntry.isPending(docketEntry),
  );

  this.noticeOfTrialDate = rawCase.noticeOfTrialDate || createISODateString();

  this.docketNumberWithSuffix =
    this.docketNumber + (this.docketNumberSuffix || '');
};

Case.prototype.assignArchivedDocketEntries = function assignArchivedDocketEntries({
  applicationContext,
  rawCase,
}) {
  if (Array.isArray(rawCase.archivedDocketEntries)) {
    this.archivedDocketEntries = rawCase.archivedDocketEntries.map(
      docketEntry => new DocketEntry(docketEntry, { applicationContext }),
    );
  } else {
    this.archivedDocketEntries = [];
  }
};

Case.prototype.assignContacts = function assignContacts({
  applicationContext,
  rawCase,
}) {
  if (!rawCase.status || rawCase.status === CASE_STATUS_TYPES.new) {
    const contacts = ContactFactory.createContacts({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });

    this.petitioners.push(contacts.primary);
    if (contacts.secondary) {
      this.petitioners.push(contacts.secondary);
    }
  } else {
    if (Array.isArray(rawCase.petitioners)) {
      this.petitioners = rawCase.petitioners.map(
        petitioner => new Petitioner(petitioner, { applicationContext }),
      );

      this.setAdditionalNameOnPetitioners();
    }
  }
};

Case.prototype.assignStatistics = function assignStatistics({
  applicationContext,
  rawCase,
}) {
  if (Array.isArray(rawCase.statistics)) {
    this.statistics = rawCase.statistics.map(
      statistic => new Statistic(statistic, { applicationContext }),
    );
  } else {
    this.statistics = [];
  }
};

Case.prototype.assignCorrespondences = function assignCorrespondences({
  applicationContext,
  rawCase,
}) {
  if (Array.isArray(rawCase.correspondence)) {
    this.correspondence = rawCase.correspondence
      .map(
        correspondence =>
          new Correspondence(correspondence, { applicationContext }),
      )
      .sort((a, b) => compareStrings(a.filingDate, b.filingDate));
  } else {
    this.correspondence = [];
  }

  if (Array.isArray(rawCase.archivedCorrespondences)) {
    this.archivedCorrespondences = rawCase.archivedCorrespondences.map(
      correspondence =>
        new Correspondence(correspondence, { applicationContext }),
    );
  } else {
    this.archivedCorrespondences = [];
  }
};

Case.VALIDATION_RULES = {
  ...CaseCounsel.validation,
  ...CaseDocketEntries.validation,
  ...TrialsAndHearings.validation,
  archivedCorrespondences: joi
    .array()
    .items(Correspondence.VALIDATION_RULES)
    .optional()
    .description('List of Correspondence Entities that were archived.'),
  archivedDocketEntries: joi
    .array()
    .items(DOCKET_ENTRY_VALIDATION_RULES)
    .optional()
    .description(
      'List of DocketEntry Entities that were archived instead of added to the docket record.',
    ),
  caseCaption: JoiValidationConstants.CASE_CAPTION.required().description(
    'The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.',
  ),
  caseNote: JoiValidationConstants.STRING.max(500)
    .optional()
    .meta({ tags: ['Restricted'] }),
  caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
  closedDate: JoiValidationConstants.ISO_DATE.when('status', {
    is: CASE_STATUS_TYPES.closed,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  correspondence: joi
    .array()
    .items(Correspondence.VALIDATION_RULES)
    .optional()
    .description('List of Correspondence documents for the case.'),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the paper or electronic case was added to the system. This value cannot be edited.',
  ),
  damages: joi
    .number()
    .optional()
    .allow(null)
    .description('Damages for the case.'),

  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  entityName: JoiValidationConstants.STRING.valid('Case').required(),
  filingType: JoiValidationConstants.STRING.valid(
    ...FILING_TYPES[ROLES.petitioner],
    ...FILING_TYPES[ROLES.privatePractitioner],
  ).optional(),
  hasPendingItems: joi.boolean().optional(),
  hasVerifiedIrsNotice: joi
    .boolean()
    .optional()
    .allow(null)
    .description(
      'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
    ),
  initialCaption: JoiValidationConstants.CASE_CAPTION.allow(null)
    .optional()
    .description('Case caption before modification.'),
  initialDocketNumberSuffix: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCKET_NUMBER_SUFFIXES),
    '_',
  )
    .allow(null)
    .optional()
    .description('Case docket number suffix before modification.'),
  irsNoticeDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .allow(null)
    .description('Last date that the petitioner is allowed to file before.'),
  isPaper: joi.boolean().optional(),
  isSealed: joi.boolean().optional(),

  leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional().description(
    'If this case is consolidated, this is the docket number of the lead case. It is the lowest docket number in the consolidated group.',
  ),
  litigationCosts: joi
    .number()
    .optional()
    .allow(null)
    .description('Litigation costs for the case.'),
  mailingDate: JoiValidationConstants.STRING.max(25)
    .when('isPaper', {
      is: true,
      otherwise: joi.allow(null).optional(),
      then: joi.required(),
    })
    .description('Date that petition was mailed to the court.'),
  noticeOfAttachments: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the notice of attachments.'),
  noticeOfTrialDate: JoiValidationConstants.ISO_DATE.optional().description(
    'Reminder for clerks to review the notice of trial date.',
  ),
  orderDesignatingPlaceOfTrial: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the Order Designating Place of Trial.',
    ),
  orderForAmendedPetition: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the order for amended Petition.',
    ),
  orderForAmendedPetitionAndFilingFee: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the order for amended Petition And filing fee.',
    ),
  orderForFilingFee: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the order for filing fee.'),
  orderForOds: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the order for ODS.'),
  orderForRatification: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the Order for Ratification.'),
  orderToShowCause: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the Order to Show Cause.'),
  partyType: JoiValidationConstants.STRING.valid(...Object.values(PARTY_TYPES))
    .required()
    .description('Party type of the case petitioner.'),
  petitionPaymentDate: JoiValidationConstants.ISO_DATE.when(
    'petitionPaymentStatus',
    {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: JoiValidationConstants.ISO_DATE.max('now').required(),
    },
  ).description('When the petitioner paid the case fee.'),
  petitionPaymentMethod: JoiValidationConstants.STRING.max(50)
    .when('petitionPaymentStatus', {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('How the petitioner paid the case fee.'),
  petitionPaymentStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(PAYMENT_STATUS),
  )
    .required()
    .description('Status of the case fee payment.'),
  petitionPaymentWaivedDate: JoiValidationConstants.ISO_DATE.when(
    'petitionPaymentStatus',
    {
      is: PAYMENT_STATUS.WAIVED,
      otherwise: joi.allow(null).optional(),
      then: JoiValidationConstants.ISO_DATE.max('now').required(),
    },
  ).description('When the case fee was waived.'),
  // Individual items are validated by the ContactFactory.
  petitioners: joi
    .array()
    .unique(
      (a, b) =>
        a.otherFilerType === UNIQUE_OTHER_FILER_TYPE &&
        b.otherFilerType === UNIQUE_OTHER_FILER_TYPE,
    )
    .required(),
  procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
    .required()
    .description('Procedure type of the case.'),
  receivedAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited.',
  ),
  sealedDate: JoiValidationConstants.ISO_DATE.optional()
    .allow(null)
    .description('When the case was sealed from the public.'),
  sortableDocketNumber: joi
    .number()
    .required()
    .description(
      'A sortable representation of the docket number (auto-generated by constructor).',
    ),
  statistics: joi
    .array()
    .items(Statistic.VALIDATION_RULES)
    .when('hasVerifiedIrsNotice', {
      is: true,
      otherwise: joi.optional(),
      then: joi.when('caseType', {
        is: CASE_TYPES_MAP.deficiency,
        otherwise: joi.optional(),
        then: joi.array().min(1).required(),
      }),
    })
    .description('List of Statistic Entities for the case.'),
  status: JoiValidationConstants.STRING.valid(
    ...Object.values(CASE_STATUS_TYPES),
  )
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('Status of the case.'),
  useSameAsPrimary: joi
    .boolean()
    .optional()
    .description(
      'Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process).',
    ),
};

joiValidationDecorator(
  Case,
  joi.object().keys(Case.VALIDATION_RULES),
  Case.VALIDATION_ERROR_MESSAGES,
);

/**
 * builds the case caption from case contact name(s) based on party type
 *
 * @param {object} rawCase the raw case data
 * @returns {string} the generated case caption
 */
Case.getCaseCaption = function (rawCase) {
  const primaryContact = clone(
    getContactPrimary(rawCase) || rawCase.contactPrimary,
  );
  const secondaryContact = clone(
    getContactSecondary(rawCase) || rawCase.contactSecondary,
  );

  // trim ALL white space from these non-validated strings
  if (primaryContact?.name) {
    primaryContact.name = primaryContact.name.trim();
  }
  if (primaryContact?.secondaryName) {
    primaryContact.secondaryName = primaryContact.secondaryName.trim();
  }
  if (primaryContact?.title) {
    primaryContact.title = primaryContact.title.trim();
  }
  if (secondaryContact?.name) {
    secondaryContact.name = secondaryContact.name.trim();
  }

  return generateCaptionFromContacts({
    partyType: rawCase.partyType,
    primaryContact,
    secondaryContact,
  });
};

const generateCaptionFromContacts = ({
  partyType,
  primaryContact,
  secondaryContact,
}) => {
  let caseCaption;
  switch (partyType) {
    case PARTY_TYPES.corporation:
    case PARTY_TYPES.petitioner:
      caseCaption = `${primaryContact.name}, Petitioner`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Petitioners`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Deceased, ${primaryContact.name}, Surviving Spouse, Petitioners`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, ${primaryContact.title}, Petitioner(s)`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, Petitioner`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Trustee, Petitioner(s)`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Partnership Representative, Petitioner(s)`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Conservator, Petitioner`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Guardian, Petitioner`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Custodian, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${primaryContact.name}, Minor, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${primaryContact.name}, Incompetent, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${primaryContact.name}, Donor, Petitioner`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${primaryContact.name}, Transferee, Petitioner`;
      break;
    case PARTY_TYPES.survivingSpouse:
      caseCaption = `${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, Surviving Spouse, Petitioner`;
      break;
  }
  return caseCaption;
};

Case.prototype.toRawObject = function (processPendingItems = true) {
  const result = this.toRawObjectFromJoi();

  if (processPendingItems) {
    result.hasPendingItems = this.doesHavePendingItems();
  }

  return result;
};

Case.prototype.doesHavePendingItems = function () {
  return this.docketEntries.some(docketEntry =>
    DocketEntry.isPending(docketEntry),
  );
};

/**
 * get the case caption without the ", Petitioner/s/(s)" postfix
 *
 * @param {string} caseCaption the original case caption
 * @returns {string} caseTitle the case caption with the postfix removed
 */
Case.getCaseTitle = function (caseCaption) {
  return caseCaption.replace(/\s*,\s*Petitioner(s|\(s\))?\s*$/, '').trim();
};

/**
 * archives a docket entry and adds it to the archivedDocketEntries array on the case
 *
 * @param {string} docketEntry the docketEntry to archive
 */
Case.prototype.archiveDocketEntry = function (
  docketEntry,
  { applicationContext },
) {
  const docketEntryToArchive = new DocketEntry(docketEntry, {
    applicationContext,
  });
  docketEntryToArchive.archive();
  this.archivedDocketEntries.push(docketEntryToArchive);
  this.deleteDocketEntryById({
    docketEntryId: docketEntryToArchive.docketEntryId,
  });
};

/**
 * archives a correspondence document and adds it to the archivedCorrespondences array on the case
 *
 * @param {string} correspondence the correspondence to archive
 */
Case.prototype.archiveCorrespondence = function (
  correspondence,
  { applicationContext },
) {
  const correspondenceToArchive = new Correspondence(correspondence, {
    applicationContext,
  });
  correspondenceToArchive.archived = true;
  this.archivedCorrespondences.push(correspondenceToArchive);
  this.deleteCorrespondenceById({
    correspondenceId: correspondenceToArchive.correspondenceId,
  });
};

Case.prototype.closeCase = function () {
  this.closedDate = createISODateString();
  this.status = CASE_STATUS_TYPES.closed;
  this.unsetAsBlocked();
  this.unsetAsHighPriority();
  return this;
};

/**
 *
 * @param {Date} sendDate the time stamp when the case was sent to the IRS
 * @returns {Case} the updated case entity
 */
Case.prototype.markAsSentToIRS = function () {
  this.status = CASE_STATUS_TYPES.generalDocket;

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocketNumberRecord = function ({ applicationContext }) {
  const docketNumberRegex = /^Docket Number is amended from '(.*)' to '(.*)'/;

  let lastDocketNumber =
    this.docketNumber +
    (this.initialDocketNumberSuffix !== '_'
      ? this.initialDocketNumberSuffix
      : '');

  const newDocketNumber = this.docketNumber + (this.docketNumberSuffix || '');

  this.docketEntries.forEach(docketEntry => {
    const result = docketNumberRegex.exec(docketEntry.documentTitle);
    if (result) {
      const [, , changedDocketNumber] = result;
      lastDocketNumber = changedDocketNumber;
    }
  });

  const needsDocketNumberChangeRecord =
    lastDocketNumber !== newDocketNumber && !this.isPaper;

  if (needsDocketNumberChangeRecord) {
    const { userId } = applicationContext.getCurrentUser();

    this.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: `Docket Number is amended from '${lastDocketNumber}' to '${newDocketNumber}'`,
          documentType: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.documentType,
          eventCode: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.eventCode,
          filingDate: createISODateString(),
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId,
        },
        { applicationContext },
      ),
    );
  }

  return this;
};

/**
 * Retrieves the petitioner with id contactId on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the contact object
 */
const getPetitionerById = function (rawCase, contactId) {
  return rawCase.petitioners.find(
    petitioner => petitioner.contactId === contactId,
  );
};

/**
 * gets the petitioner with id contactId from the petitioners array
 *
 * @params {object} params the params object
 * @params {string} params.contactId the id of the petitioner to retrieve
 * @returns {object} the retrieved petitioner
 */
Case.prototype.getPetitionerById = function (contactId) {
  return getPetitionerById(this, contactId);
};

/**
 * adds the petitioner to the petitioners array
 *
 * @params {object} petitioner the petitioner to add to the case
 * @returns {Case} the updated case
 */
Case.prototype.addPetitioner = function (petitioner) {
  this.petitioners.push(petitioner);
  return this;
};

/**
 * removes the petitioner from the petitioners array
 *
 * @params {object} contactId the contactId of the petitioner to remove from the case
 */
Case.prototype.removePetitioner = function (contactId) {
  this.petitioners = this.petitioners.filter(
    petitioner => petitioner.contactId !== contactId,
  );
};

/**
 * gets the correspondence with id correspondenceId from the correspondence array
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to retrieve
 * @returns {object} the retrieved correspondence
 */
Case.prototype.getCorrespondenceById = function ({ correspondenceId }) {
  return this.correspondence.find(
    correspondence => correspondence.correspondenceId === correspondenceId,
  );
};

/**
 * gets a document from docketEntries or correspondence arrays
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to retrieve
 * @returns {object} the retrieved correspondence
 */
Case.getAttachmentDocumentById = function ({
  caseDetail,
  documentId,
  useArchived = false,
}) {
  let allCaseDocuments = [
    ...caseDetail.correspondence,
    ...caseDetail.docketEntries,
  ];
  if (useArchived) {
    allCaseDocuments = [
      ...allCaseDocuments,
      ...caseDetail.archivedDocketEntries,
      ...caseDetail.archivedCorrespondences,
    ];
  }
  return allCaseDocuments.find(
    d =>
      d &&
      (d.docketEntryId === documentId || d.correspondenceId === documentId),
  );
};

/**
 * deletes the correspondence with id correspondenceId from the correspondence array
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to remove from the correspondence array
 * @returns {Case} the updated case entity
 */
Case.prototype.deleteCorrespondenceById = function ({ correspondenceId }) {
  this.correspondence = this.correspondence.filter(
    item => item.correspondenceId !== correspondenceId,
  );

  return this;
};

Case.prototype.getPetitionDocketEntry = function () {
  return getPetitionDocketEntry(this);
};

const getPetitionDocketEntry = function (rawCase) {
  return rawCase.docketEntries?.find(
    docketEntry =>
      docketEntry.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
};

Case.prototype.getIrsSendDate = function () {
  const petitionDocketEntry = this.getPetitionDocketEntry();
  if (petitionDocketEntry) {
    return petitionDocketEntry.servedAt;
  }
};

/**
 * returns a sortable docket number using this.docketNumber in ${year}${index} format
 *
 * @returns {string} the sortable docket number
 */
Case.prototype.generateSortableDocketNumber = function () {
  if (!this.docketNumber) {
    return;
  }
  return Case.getSortableDocketNumber(this.docketNumber);
};

/**
 * returns a sortable docket number in ${year}${index} format
 *
 * @param {string} docketNumber the docket number to use
 * @returns {string} the sortable docket number
 */
Case.getSortableDocketNumber = function (docketNumber) {
  // Note: This does not yet take into account pre-2000's years
  const docketNumberSplit = docketNumber.split('-');
  docketNumberSplit[0] = docketNumberSplit[0].padStart(6, '0');
  return parseInt(`${docketNumberSplit[1]}${docketNumberSplit[0]}`);
};

/**
 * returns true if the case is associated with the userId
 *
 * @param {object} arguments arguments
 * @param {object} arguments.caseRaw raw case details
 * @param {string} arguments.user the user account
 * @returns {boolean} if the case is associated
 */
const isAssociatedUser = function ({ caseRaw, user }) {
  const isIrsPractitioner =
    caseRaw.irsPractitioners &&
    caseRaw.irsPractitioners.find(r => r.userId === user.userId);
  const isPrivatePractitioner =
    caseRaw.privatePractitioners &&
    caseRaw.privatePractitioners.find(p => p.userId === user.userId);
  const isPrimaryContact =
    getContactPrimary(caseRaw)?.contactId === user.userId;
  const isSecondaryContact =
    getContactSecondary(caseRaw)?.contactId === user.userId;

  const isIrsSuperuser = user.role === ROLES.irsSuperuser;

  const petitionDocketEntry = (caseRaw.docketEntries || []).find(
    doc => doc.documentType === 'Petition',
  );

  const isPetitionServed = petitionDocketEntry && isServed(petitionDocketEntry);

  return (
    isIrsPractitioner ||
    isPrivatePractitioner ||
    isPrimaryContact ||
    isSecondaryContact ||
    (isIrsSuperuser && isPetitionServed)
  );
};

/**
 * Computes and sets additionalName for contactPrimary depending on partyType
 *
 */
Case.prototype.setAdditionalNameOnPetitioners = function () {
  const contactPrimary = this.getContactPrimary(this);

  if (contactPrimary && !contactPrimary.additionalName) {
    switch (this.partyType) {
      case PARTY_TYPES.conservator:
      case PARTY_TYPES.custodian:
      case PARTY_TYPES.guardian:
      case PARTY_TYPES.nextFriendForIncompetentPerson:
      case PARTY_TYPES.nextFriendForMinor:
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
      case PARTY_TYPES.partnershipBBA:
      case PARTY_TYPES.survivingSpouse:
      case PARTY_TYPES.trust:
        contactPrimary.additionalName = contactPrimary.secondaryName;
        delete contactPrimary.secondaryName;
        break;
      case PARTY_TYPES.estate: {
        const additionalNameFields = compact([
          contactPrimary.secondaryName,
          contactPrimary.title,
        ]);
        contactPrimary.additionalName = additionalNameFields.join(', ');
        delete contactPrimary.secondaryName;
        delete contactPrimary.title;
        break;
      }
      case PARTY_TYPES.estateWithoutExecutor:
      case PARTY_TYPES.corporation:
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimary.additionalName = `c/o ${contactPrimary.inCareOf}`;
        delete contactPrimary.inCareOf;
        break;
      default:
        break;
    }
  }
};

/**
 * Retrieves the primary contact on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the primary contact object on the case
 */
const getContactPrimary = function (rawCase) {
  return rawCase.petitioners?.find(
    p => p.contactType === CONTACT_TYPES.primary,
  );
};

/**
 * Returns the primary contact on the case
 *
 * @returns {Object} the primary contact object on the case
 */
Case.prototype.getContactPrimary = function () {
  return getContactPrimary(this);
};

/**
 * Retrieves the secondary contact on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the secondary contact object on the case
 */
const getContactSecondary = function (rawCase) {
  return rawCase.petitioners?.find(
    p => p.contactType === CONTACT_TYPES.secondary,
  );
};

/**
 * Retrieves the other filers on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Array} the other filers on the case
 */
const getOtherFilers = function (rawCase) {
  return rawCase.petitioners?.filter(
    p => p.contactType === CONTACT_TYPES.otherFiler,
  );
};

/**
 * Returns the secondary contact on the case
 *
 * @returns {Object} the secondary contact object on the case
 */
Case.prototype.getContactSecondary = function () {
  return getContactSecondary(this);
};

/**
 * Returns the other filers on the case
 *
 * @returns {Array} the other filers on the case
 */
Case.prototype.getOtherFilers = function () {
  return getOtherFilers(this);
};

/**
 * Retrieves the other petitioners on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Array} the other petitioners on the case
 */
const getOtherPetitioners = function (rawCase) {
  return rawCase.petitioners?.filter(
    p => p.contactType === CONTACT_TYPES.otherPetitioner,
  );
};

/**
 * Returns the other petitioners on the case
 *
 * @returns {Array} the other petitioners on the case
 */
Case.prototype.getOtherPetitioners = function () {
  return getOtherPetitioners(this);
};

/**
 * Updates the specified contact object in the case petitioner's array
 *
 * @param {object} arguments.rawCase the raw case object
 * @param {object} arguments.updatedPetitioner the updated petitioner object
 */
const updatePetitioner = function (rawCase, updatedPetitioner) {
  const petitionerIndex = rawCase.petitioners.findIndex(
    p => p.contactId === updatedPetitioner.contactId,
  );

  if (petitionerIndex !== -1) {
    rawCase.petitioners[petitionerIndex] = updatedPetitioner;
  } else {
    throw new Error(
      `Petitioner was not found on case ${rawCase.docketNumber}.`,
    );
  }
};

/**
 * Updates the specified contact object in the case petitioner's array
 *
 * @param {object} arguments.updatedPetitioner the updated petitioner object
 */
Case.prototype.updatePetitioner = function (updatedPetitioner) {
  updatePetitioner(this, updatedPetitioner);
};

/**
 * Determines if provided user is associated with the case
 *
 * @param {object} arguments.user the user account
 * @returns {boolean} true if the user provided is associated with the case, false otherwise
 */
Case.prototype.isAssociatedUser = function ({ user }) {
  return isAssociatedUser({ caseRaw: this, user });
};

/**
 * set case status
 *
 * @param {string} caseStatus the case status to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseStatus = function (caseStatus) {
  this.status = caseStatus;
  if (
    [
      CASE_STATUS_TYPES.generalDocket,
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    ].includes(caseStatus)
  ) {
    this.associatedJudge = CHIEF_JUDGE;
  } else if (caseStatus === CASE_STATUS_TYPES.closed) {
    this.closeCase();
  }
  return this;
};

/**
 * set case caption
 *
 * @param {string} caseCaption the case caption to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseCaption = function (caseCaption) {
  this.caseCaption = caseCaption;
  return this;
};

/**
 * get consolidation status between current case entity and another case entity
 *
 * @param {object} caseEntity the pending case entity to check
 * @returns {object} object with canConsolidate flag and reason string
 */
Case.prototype.getConsolidationStatus = function ({ caseEntity }) {
  let canConsolidate = true;
  const reason = [];

  if (!this.canConsolidate(caseEntity)) {
    return {
      canConsolidate: false,
      reason: [
        `Case status is ${caseEntity.status} and cannot be consolidated`,
      ],
    };
  }

  if (this.docketNumber === caseEntity.docketNumber) {
    canConsolidate = false;
    reason.push('Cases are the same');
  }

  if (this.status !== caseEntity.status) {
    canConsolidate = false;
    reason.push('Case status is not the same');
  }

  if (this.procedureType !== caseEntity.procedureType) {
    canConsolidate = false;
    reason.push('Case procedure is not the same');
  }

  if (this.preferredTrialCity !== caseEntity.preferredTrialCity) {
    canConsolidate = false;
    reason.push('Place of trial is not the same');
  }

  if (this.associatedJudge !== caseEntity.associatedJudge) {
    canConsolidate = false;
    reason.push('Judge is not the same');
  }

  return { canConsolidate, reason };
};

/**
 * checks case eligibility for consolidation by the current case's status
 *
 * @returns {boolean} true if eligible for consolidation, false otherwise
 * @param {object} caseToConsolidate (optional) case to check for consolidation eligibility
 */
Case.prototype.canConsolidate = function (caseToConsolidate) {
  const ineligibleStatusTypes = [
    CASE_STATUS_TYPES.new,
    CASE_STATUS_TYPES.generalDocket,
    CASE_STATUS_TYPES.closed,
    CASE_STATUS_TYPES.onAppeal,
  ];

  const caseToCheck = caseToConsolidate || this;

  return !ineligibleStatusTypes.includes(caseToCheck.status);
};

/**
 * sets lead docket number on the current case
 *
 * @param {string} leadDocketNumber the docketNumber of the lead case for consolidation
 * @returns {Case} the updated Case entity
 */
Case.prototype.setLeadCase = function (leadDocketNumber) {
  this.leadDocketNumber = leadDocketNumber;
  return this;
};

/**
 * removes the consolidation from the case by setting leadDocketNumber to undefined
 *
 * @returns {Case} the updated Case entity
 */
Case.prototype.removeConsolidation = function () {
  this.leadDocketNumber = undefined;
  return this;
};

/**
 * sorts the given array of cases by docket number
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.sortByDocketNumber = function (cases) {
  return cases.sort((a, b) => {
    const aSplit = a.docketNumber.split('-');
    const bSplit = b.docketNumber.split('-');

    if (aSplit[1] !== bSplit[1]) {
      // compare years if they aren't the same
      return aSplit[1].localeCompare(bSplit[1]);
    } else {
      // compare index if years are the same
      return aSplit[0].localeCompare(bSplit[0]);
    }
  });
};

/**
 * return the lead case for the given set of cases based on createdAt
 * (does NOT evaluate leadDocketNumber)
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.findLeadCaseForCases = function (cases) {
  const casesOrdered = Case.sortByDocketNumber([...cases]);
  return casesOrdered.shift();
};

/**
 * re-formats docket number with any leading zeroes and suffix removed
 *
 * @param {string} docketNumber the docket number to re-format
 * @returns {string} the formatted docket Number
 */
Case.formatDocketNumber = function formatDocketNumber(docketNumber) {
  const regex = /^0*(\d+-\d{2}).*/;
  return docketNumber.replace(regex, '$1');
};

/**
 * sets the sealedDate on a case to the current date and time
 *
 * @returns {Case} this case entity
 */
Case.prototype.setAsSealed = function () {
  this.sealedDate = createISODateString();
  this.isSealed = true;
  return this;
};

/**
 * generates the case confirmation pdf file name
 *
 * @returns {string} this case confirmation pdf file name
 */
Case.prototype.getCaseConfirmationGeneratedPdfFileName = function () {
  return `case-${this.docketNumber}-confirmation.pdf`;
};

/**
 * adds the correspondence document to the list of correspondences on the case
 *
 * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.fileCorrespondence = function (correspondenceEntity) {
  this.correspondence = [...this.correspondence, correspondenceEntity];

  return this;
};

/**
 * updates the correspondence document on the case
 *
 * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.updateCorrespondence = function (correspondenceEntity) {
  const foundCorrespondence = this.correspondence.find(
    correspondence =>
      correspondence.correspondenceId === correspondenceEntity.correspondenceId,
  );

  if (foundCorrespondence)
    Object.assign(foundCorrespondence, correspondenceEntity);

  return this;
};

/**
 * adds the statistic to the list of statistics on the case
 *
 * @param {Statistic} statisticEntity the statistic to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.addStatistic = function (statisticEntity) {
  if (this.statistics.length === 12) {
    throw new Error('maximum number of statistics reached');
  }

  this.statistics = [...this.statistics, statisticEntity];

  return this;
};

/**
 * updates the statistic with the given index on the case
 *
 * @param {Statistic} statisticEntity the statistic to update on the case
 * @param {string} statisticId the id of the statistic to update
 * @returns {Case} this case entity
 */
Case.prototype.updateStatistic = function (statisticEntity, statisticId) {
  const statisticToUpdate = this.statistics.find(
    statistic => statistic.statisticId === statisticId,
  );

  if (statisticToUpdate) Object.assign(statisticToUpdate, statisticEntity);

  return this;
};

/**
 * deletes the statistic with the given index from the case
 *
 * @param {string} statisticId the id of the statistic to delete
 * @returns {Case} this case entity
 */
Case.prototype.deleteStatistic = function (statisticId) {
  const statisticIndexToDelete = this.statistics.findIndex(
    statistic => statistic.statisticId === statisticId,
  );

  if (statisticIndexToDelete !== -1) {
    this.statistics.splice(statisticIndexToDelete, 1);
  }

  return this;
};

const isSealedCase = rawCase => {
  const isSealed =
    rawCase.isSealed ||
    !!rawCase.sealedDate ||
    (Array.isArray(rawCase.docketEntries) &&
      rawCase.docketEntries.some(
        docketEntry => docketEntry.isSealed || docketEntry.isLegacySealed,
      ));
  return isSealed;
};

const caseHasServedDocketEntries = rawCase => {
  return !!rawCase.docketEntries.some(docketEntry => isServed(docketEntry));
};

module.exports = {
  Case: validEntityDecorator(Case),
  caseHasServedDocketEntries,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getOtherPetitioners,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  isAssociatedUser,
  isSealedCase,
  isUserIdRepresentedByPrivatePractitioner,
  updatePetitioner,
};
