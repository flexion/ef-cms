const courtIssuedEventCodes = require('../../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');

const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

const DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

const TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

const CHIEF_JUDGE = 'Chief Judge';

const DOCKET_NUMBER_SUFFIXES = ['W', 'P', 'X', 'R', 'SL', 'L', 'S'];

const CASE_STATUS_TYPES = {
  assignedCase: 'Assigned - Case', // Case has been assigned to a judge
  assignedMotion: 'Assigned - Motion', // Someone has requested a judge for the case
  calendared: 'Calendared', // Case has been scheduled for trial
  cav: 'CAV', // Core alternative valuation
  closed: 'Closed', // Judge has made a ruling to close the case
  generalDocket: 'General Docket - Not at Issue', // Submitted to the IRS
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)', // Case is ready for trial
  jurisdictionRetained: 'Jurisdiction Retained', // Jurisdiction of a case is retained by a specific judge — usually after the case is on a judge’s trial calendar
  new: 'New', // Case has not been QCed
  onAppeal: 'On Appeal', // After the trial, the case has gone to the appeals court
  rule155: 'Rule 155', // Where the Court has filed or stated its opinion or issued a dispositive order determining the issues in a case, it may withhold entry of its decision for the purpose of permitting the parties to submit computations pursuant to the Court’s determination of the issues, showing the correct amount to be included in the decision.
  submitted: 'Submitted', // Submitted to the judge for decision
};

const DOCUMENT_RELATIONSHIPS = [
  'primaryDocument',
  'primarySupportingDocument',
  'secondaryDocument',
  'secondarySupportingDocument',
  'supportingDocument',
];

const ORDER_DOCUMENT_TYPES = [
  'O',
  'OAJ',
  'OAL',
  'OAP',
  'OAPF',
  'OAR',
  'OAS',
  'OASL',
  'OAW',
  'OAX',
  'OCA',
  'OD',
  'ODD',
  'ODL',
  'ODP',
  'ODR',
  'ODS',
  'ODSL',
  'ODW',
  'ODX',
  'OF',
  'OFAB',
  'OFFX',
  'OFWD',
  'OFX',
  'OIP',
  'OJR',
  'OODS',
  'OPFX',
  'OPX',
  'ORAP',
  'OROP',
  'OSC',
  'OSCP',
  'OST',
  'OSUB',
  'OAD',
  'ODJ',
];

const DOCUMENT_NOTICE_EVENT_CODES = ['NOT'];
const DOCUMENT_CATEGORIES = Object.keys(documentMapExternal);
const DOCUMENT_CATEGORY_MAP = documentMapExternal;
const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
const DOCUMENT_INTERNAL_CATEGORY_MAP = documentMapInternal;
const COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;
const OPINION_DOCUMENT_TYPES = ['MOP', 'SOP', 'TCOP'];

const SCENARIOS = [
  'Standard',
  'Nonstandard A',
  'Nonstandard B',
  'Nonstandard C',
  'Nonstandard D',
  'Nonstandard E',
  'Nonstandard F',
  'Nonstandard G',
  'Nonstandard H',
  'Type A',
  'Type B',
  'Type C',
  'Type D',
  'Type E',
  'Type F',
  'Type G',
  'Type H',
];

const TRANSCRIPT_EVENT_CODE = 'TRAN';

const OBJECTIONS_OPTIONS = ['No', 'Yes', 'Unknown'];

const CONTACT_CHANGE_DOCUMENT_TYPES = [
  'Notice of Change of Address',
  'Notice of Change of Telephone Number',
  'Notice of Change of Address and Telephone Number',
];

const TRACKED_DOCUMENT_TYPES = {
  application: {
    category: 'Application',
  },
  motion: {
    category: 'Motion',
  },
  orderToShowCause: {
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  proposedStipulatedDecision: {
    documentType: 'Proposed Stipulated Decision',
    eventCode: 'PSDE',
  },
};

const INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
  },
  ownershipDisclosure: {
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'DISC',
  },
  petition: {
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
  },
};

const NOTICE_OF_DOCKET_CHANGE = {
  documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
  documentType: 'Notice of Docket Change',
  eventCode: 'NODC',
};

const NOTICE_OF_TRIAL = {
  documentTitle: 'Notice of Trial on [Date] at [Time]',
  documentType: 'Notice of Trial',
  eventCode: 'NDT',
};

const STANDING_PRETRIAL_NOTICE = {
  documentTitle: 'Standing Pretrial Notice',
  documentType: 'Standing Pretrial Notice',
  eventCode: 'SPTN',
};

const STANDING_PRETRIAL_ORDER = {
  documentTitle: 'Standing Pretrial Order',
  documentType: 'Standing Pretrial Order',
  eventCode: 'SPTO',
};

const SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: NOTICE_OF_DOCKET_CHANGE,
  noticeOfTrial: NOTICE_OF_TRIAL,
  standingPretrialNotice: STANDING_PRETRIAL_NOTICE,
  standingPretrialOrder: STANDING_PRETRIAL_ORDER,
};

const SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

const EVENT_CODES = [
  INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
  INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  INITIAL_DOCUMENT_TYPES.petition.eventCode,
  INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
  INITIAL_DOCUMENT_TYPES.stin.eventCode,
  NOTICE_OF_DOCKET_CHANGE.eventCode,
  NOTICE_OF_TRIAL.eventCode,
  STANDING_PRETRIAL_NOTICE.eventCode,
  STANDING_PRETRIAL_ORDER.eventCode,
  'MISL',
  'FEE',
  'FEEW',
  'MGRTED',
  'MIND',
  'MINC',
];

const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not Paid',
  WAIVED: 'Waived',
};

const PROCEDURE_TYPES = ['Regular', 'Small']; // This is the order that they appear in the UI

const STATUS_TYPES_WITH_ASSOCIATED_JUDGE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const STATUS_TYPES_MANUAL_UPDATE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.generalDocket,
  CASE_STATUS_TYPES.generalDocketReadyForTrial,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.onAppeal,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const ANSWER_DOCUMENT_CODES = [
  'A',
  'AAAP',
  'AAPN',
  'AATP',
  'AATS',
  'AATT',
  'APA',
  'ASAP',
  'ASUP',
  'ATAP',
  'ATSP',
];

const CASE_CAPTION_POSTFIX = 'v. Commissioner of Internal Revenue, Respondent';

const AUTOMATIC_BLOCKED_REASONS = {
  dueDate: 'Due Date',
  pending: 'Pending Item',
  pendingAndDueDate: 'Pending Item and Due Date',
};

const CASE_TYPES_MAP = {
  cdp: 'CDP (Lien/Levy)',
  deficiency: 'Deficiency',
  djExemptOrg: 'Declaratory Judgment (Exempt Organization)',
  djRetirementPlan: 'Declaratory Judgment (Retirement Plan)',
  innocentSpouse: 'Innocent Spouse',
  interestAbatement: 'Interest Abatement',
  other: 'Other',
  partnershipSection1101: 'Partnership (BBA Section 1101)',
  partnershipSection6226: 'Partnership (Section 6226)',
  partnershipSection6228: 'Partnership (Section 6228)',
  passport: 'Passport',
  whistleblower: 'Whistleblower',
  workerClassification: 'Worker Classification',
};

const CASE_TYPES = Object.values(CASE_TYPES_MAP);

const ROLES = {
  adc: 'adc',
  admin: 'admin',
  admissionsClerk: 'admissionsclerk',
  chambers: 'chambers',
  clerkOfCourt: 'clerkofcourt',
  docketClerk: 'docketclerk',
  floater: 'floater',
  inactivePractitioner: 'inactivePractitioner',
  irsPractitioner: 'irsPractitioner',
  irsSuperuser: 'irsSuperuser',
  judge: 'judge',
  petitioner: 'petitioner',
  petitionsClerk: 'petitionsclerk',
  privatePractitioner: 'privatePractitioner',
  trialClerk: 'trialclerk',
};

const FILING_TYPES = {
  [ROLES.petitioner]: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  [ROLES.privatePractitioner]: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

const ANSWER_CUTOFF_AMOUNT_IN_DAYS = 45;

const ANSWER_CUTOFF_UNIT = 'day';

const COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
};

const US_STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

const PARTY_TYPES = {
  conservator: 'Conservator',
  corporation: 'Corporation',
  custodian: 'Custodian',
  donor: 'Donor',
  estate: 'Estate with an executor/personal representative/fiduciary/etc.',
  estateWithoutExecutor:
    'Estate without an executor/personal representative/fiduciary/etc.',
  guardian: 'Guardian',
  nextFriendForIncompetentPerson:
    'Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)',
  nextFriendForMinor:
    'Next friend for a minor (without a guardian, conservator, or other like fiduciary)',
  partnershipAsTaxMattersPartner: 'Partnership (as the Tax Matters Partner)',
  partnershipBBA:
    'Partnership (as a partnership representative under the BBA regime)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than Tax Matters Partner)',
  petitioner: 'Petitioner',
  petitionerDeceasedSpouse: 'Petitioner & deceased spouse',
  petitionerSpouse: 'Petitioner & spouse',
  survivingSpouse: 'Surviving spouse',
  transferee: 'Transferee',
  trust: 'Trust',
};

const BUSINESS_TYPES = {
  corporation: PARTY_TYPES.corporation,
  partnershipAsTaxMattersPartner: PARTY_TYPES.partnershipAsTaxMattersPartner,
  partnershipBBA: PARTY_TYPES.partnershipBBA,
  partnershipOtherThanTaxMatters: PARTY_TYPES.partnershipOtherThanTaxMatters,
};

const ESTATE_TYPES = {
  estate: PARTY_TYPES.estate,
  estateWithoutExecutor: PARTY_TYPES.estateWithoutExecutor,
  trust: PARTY_TYPES.trust,
};

const OTHER_TYPES = {
  conservator: PARTY_TYPES.conservator,
  custodian: PARTY_TYPES.custodian,
  guardian: PARTY_TYPES.guardian,
  nextFriendForIncompetentPerson: PARTY_TYPES.nextFriendForIncompetentPerson,
  nextFriendForMinor: PARTY_TYPES.nextFriendForMinor,
};

const ORDER_TYPES = [
  {
    documentType: 'Order',
    eventCode: 'O',
  },
  {
    documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
    documentType: 'Order of Dismissal for Lack of Jurisdiction',
    eventCode: 'ODJ',
  },
  {
    documentTitle: 'Order of Dismissal',
    documentType: 'Order of Dismissal',
    eventCode: 'OD',
  },
  {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
  },
  {
    documentTitle: 'Order to Show Cause',
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  {
    documentTitle: 'Order and Decision',
    documentType: 'Order and Decision',
    eventCode: 'OAD',
  },
  {
    documentTitle: 'Decision',
    documentType: 'Decision',
    eventCode: 'DEC',
  },
  {
    documentType: 'Notice',
    eventCode: 'NOT',
  },
];

module.exports = {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_CUTOFF_UNIT,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_INTERNAL_CATEGORIES,
  DOCUMENT_INTERNAL_CATEGORY_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  ESTATE_TYPES,
  EVENT_CODES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  NOTICE_OF_DOCKET_CHANGE,
  NOTICE_OF_TRIAL,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  ORDER_DOCUMENT_TYPES,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  SCENARIOS,
  SERVICE_INDICATOR_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRACKED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_LOCATION_MATCHER,
  US_STATES,
};
