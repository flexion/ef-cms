import {
  AMICUS_BRIEF_DOCUMENT_TYPE,
  AMICUS_BRIEF_EVENT_CODE,
  AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES,
  BRIEF_EVENTCODES,
  CORRECTED_TRANSCRIPT_EVENT_CODE,
  COURT_ISSUED_EVENT_CODES,
  DECISION_EVENT_CODE,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  EXTERNAL_DOCUMENT_TYPES,
  MINUTE_ENTRIES_MAP,
  MOTION_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  PARTIES_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  REVISED_TRANSCRIPT_EVENT_CODE,
  ROLES,
  Role,
  STIN_DOCKET_ENTRY_TYPE,
  TRACKED_DOCUMENT_TYPES_EVENT_CODES,
  TRANSCRIPT_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} from './EntityConstants';
import {
  Case,
  getPetitionDocketEntry,
  isSealedCase,
} from '@shared/business/entities/cases/Case';
import { DOCKET_ENTRY_VALIDATION_RULES } from './EntityValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from './User';
import { WorkItem } from './WorkItem';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
  createISODateString,
} from '../utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';

/* eslint-disable max-lines */
const canDownloadSTIN = (
  entry: RawDocketEntry,
  petitionDocketEntry: RawDocketEntry,
  user: { role: Role },
): boolean => {
  if (
    user.role === ROLES.petitionsClerk &&
    !DocketEntry.isServed(entry) &&
    !DocketEntry.isServed(petitionDocketEntry)
  ) {
    return true;
  } else if (
    user.role === ROLES.caseServicesSupervisor &&
    !DocketEntry.isServed(entry) &&
    !DocketEntry.isServed(petitionDocketEntry)
  ) {
    return true;
  } else if (
    user.role === ROLES.irsSuperuser &&
    DocketEntry.isServed(entry) &&
    DocketEntry.isServed(petitionDocketEntry)
  ) {
    return true;
  }
  return false;
};

export class DocketEntry extends JoiValidationEntity {
  public action?: string;
  public additionalInfo?: string;
  public additionalInfo2?: string;
  public addToCoversheet?: boolean;
  public archived?: boolean;
  public attachments?: string;
  public certificateOfService?: boolean;
  public certificateOfServiceDate?: string;
  public createdAt: string;
  public date?: string;
  public docketEntryId: string;
  public docketNumber: string;
  public docketNumbers?: string;
  public documentContentsId?: string;
  public documentIdBeforeSignature?: string;
  public documentTitle: string;
  public documentType: string;
  public eventCode: string;
  public filedBy?: string;
  public filedByRole?: string;
  public filingDate: string;
  public freeText?: string;
  public freeText2?: string;
  public hasOtherFilingParty?: boolean;
  public hasSupportingDocuments?: boolean;
  public index?: number;
  public isAutoGenerated?: boolean;
  public isFileAttached?: boolean;
  public isLegacy?: boolean;
  public editState?: string;
  public isLegacySealed?: boolean;
  public isLegacyServed?: boolean;
  public isOnDocketRecord: boolean;
  public isPaper?: boolean;
  public isPendingService?: boolean;
  public isSealed?: boolean;
  public isStricken?: boolean;
  public lodged?: boolean;
  public mailingDate?: string;
  public numberOfPages?: number;
  public objections?: string;
  public sealedTo?: string;
  public filers: string[];
  public ordinalValue?: string;
  public otherIteration?: string;
  public otherFilingParty?: string;
  public partyIrsPractitioner?: boolean;
  public processingStatus: string;
  public receivedAt: string;
  public relationship?: string;
  public scenario?: string;
  public secondaryDocument?: {
    secondaryDocumentInfo: string;
  };
  public servedAt?: string;
  public servedPartiesCode?: string;
  public serviceDate?: string;
  public serviceStamp?: string;
  public strickenAt?: string;
  public trialLocation?: string;
  public supportingDocument?: string;
  public userId?: string;
  public privatePractitioners?: any[];
  public servedParties?: any[];
  public signedAt?: string;
  public draftOrderState?: object;
  public stampData!: object;
  public isDraft?: boolean;
  public redactionAcknowledgement?: boolean;
  public judge?: string;
  public judgeUserId?: string;
  public pending?: boolean;
  public previousDocument?: {
    docketEntryId: string;
    documentTitle: string;
    documentType: string;
  };
  public qcAt?: string;
  public qcByUserId?: string;
  public signedByUserId?: string;
  public signedJudgeName?: string;
  public signedJudgeUserId?: string;
  public strickenBy?: string;
  public strickenByUserId?: string;
  public workItem?: any;

  // Keeping this constructor setup like this so we get the typescript safety, but the
  // joi validation proxy invokes init on behalf of the constructor, so we keep these unused arguments.
  constructor(
    rawDocketEntry,
    {
      authorizedUser,
      filtered = false,
      petitioners = [],
    }: {
      authorizedUser: UnknownAuthUser;
      petitioners?: any[];
      filtered?: boolean;
    },
  ) {
    super('DocketEntry');

    if (!filtered || User.isInternalUser(authorizedUser?.role)) {
      this.initForUnfilteredForInternalUsers(rawDocketEntry);
    }

    this.action = rawDocketEntry.action;
    this.additionalInfo = rawDocketEntry.additionalInfo;
    this.additionalInfo2 = rawDocketEntry.additionalInfo2;
    this.addToCoversheet = rawDocketEntry.addToCoversheet || false;
    this.archived = rawDocketEntry.archived;
    this.attachments = rawDocketEntry.attachments;
    this.certificateOfService = rawDocketEntry.certificateOfService;
    this.certificateOfServiceDate = rawDocketEntry.certificateOfServiceDate;
    this.createdAt = rawDocketEntry.createdAt || createISODateString();
    this.date = rawDocketEntry.date;
    this.docketEntryId = rawDocketEntry.docketEntryId || getUniqueId();
    this.docketNumber = rawDocketEntry.docketNumber;
    this.docketNumbers = rawDocketEntry.docketNumbers;
    this.documentContentsId = rawDocketEntry.documentContentsId;
    this.documentIdBeforeSignature = rawDocketEntry.documentIdBeforeSignature;
    this.documentTitle = rawDocketEntry.documentTitle;
    this.documentType = rawDocketEntry.documentType;
    this.eventCode = rawDocketEntry.eventCode;
    this.filedBy = rawDocketEntry.filedBy;
    this.filedByRole = rawDocketEntry.filedByRole;
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
    this.isOnDocketRecord = rawDocketEntry.isOnDocketRecord || false;
    this.isPaper = rawDocketEntry.isPaper;
    this.isPendingService = rawDocketEntry.isPendingService;
    this.isSealed = rawDocketEntry.isSealed;
    this.isStricken = rawDocketEntry.isStricken || false;
    this.lodged = rawDocketEntry.lodged;
    this.mailingDate = rawDocketEntry.mailingDate;
    this.numberOfPages = rawDocketEntry.numberOfPages;
    this.objections = rawDocketEntry.objections;
    this.redactionAcknowledgement = rawDocketEntry.redactionAcknowledgement;
    this.sealedTo = rawDocketEntry.sealedTo;
    this.filers = rawDocketEntry.filers || [];
    this.ordinalValue = rawDocketEntry.ordinalValue;
    this.otherIteration = rawDocketEntry.otherIteration;
    this.otherFilingParty = rawDocketEntry.otherFilingParty;
    this.partyIrsPractitioner = rawDocketEntry.partyIrsPractitioner;
    this.processingStatus = rawDocketEntry.processingStatus || 'pending';
    this.receivedAt = createISODateAtStartOfDayEST(rawDocketEntry.receivedAt);
    this.relationship = rawDocketEntry.relationship;
    this.scenario = rawDocketEntry.scenario;
    if (rawDocketEntry.scenario === 'Nonstandard H') {
      this.secondaryDocument = rawDocketEntry.secondaryDocument;
    }
    this.servedAt = rawDocketEntry.servedAt;
    this.servedPartiesCode = rawDocketEntry.servedPartiesCode;
    this.serviceDate = rawDocketEntry.serviceDate;
    this.serviceStamp = rawDocketEntry.serviceStamp;
    this.strickenAt = rawDocketEntry.strickenAt;
    this.supportingDocument = rawDocketEntry.supportingDocument;
    this.trialLocation = rawDocketEntry.trialLocation;
    // only share the userId with an external user if it is the logged in user
    if (authorizedUser?.userId === rawDocketEntry.userId) {
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
      this.signedAt = rawDocketEntry.signedAt || createISODateString();
    }

    this.generateFiledBy(petitioners);
  }

  private initForUnfilteredForInternalUsers(rawDocketEntry) {
    this.editState = rawDocketEntry.editState;
    this.draftOrderState = rawDocketEntry.draftOrderState;
    this.stampData = rawDocketEntry.stampData || {};
    this.isDraft = rawDocketEntry.isDraft || false;
    this.judge = rawDocketEntry.judge;
    this.judgeUserId = rawDocketEntry.judgeUserId;
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
    this.qcAt = rawDocketEntry.qcAt;
    this.qcByUserId = rawDocketEntry.qcByUserId;
    this.signedAt = rawDocketEntry.signedAt;
    this.signedByUserId = rawDocketEntry.signedByUserId;
    this.signedJudgeName = rawDocketEntry.signedJudgeName;
    this.signedJudgeUserId = rawDocketEntry.signedJudgeUserId;
    this.strickenBy = rawDocketEntry.strickenBy;
    this.strickenByUserId = rawDocketEntry.strickenByUserId;
    this.userId = rawDocketEntry.userId;
    this.workItem = rawDocketEntry.workItem
      ? new WorkItem(rawDocketEntry.workItem)
      : undefined;
  }

  /**
   *
   * @param {WorkItem} workItem the work item to add to the document
   */
  setWorkItem(workItem) {
    this.workItem = workItem;
  }

  /**
   * sets the document as archived (used to hide from the ui)
   *
   */
  archive() {
    this.archived = true;
  }

  /**
   * Mark a docket entry as served
   * @param {Array} servedParties the list of parties to serve the docket entry on
   * @returns {DocketEntry} the docket entry that was marked as served
   */
  setAsServed(servedParties: any[] | null = null) {
    this.servedAt = createISODateString();
    this.draftOrderState = undefined;

    if (this.eventCode === 'ATP') {
      const irsSuperUserParty = [
        {
          name: 'IRS',
          role: ROLES.irsSuperuser,
        },
      ];
      this.servedParties = irsSuperUserParty;
      this.servedPartiesCode = PARTIES_CODES.RESPONDENT;
      return this;
    }

    if (servedParties) {
      this.servedParties = servedParties;
      this.servedPartiesCode = getServedPartiesCode(servedParties);
    }
    return this;
  }

  /**
   * Determines if the deadline should be auto-generated for the docket entry
   * @returns {Boolean} true or false if the deadline should be auto-generated
   */
  shouldAutoGenerateDeadline() {
    return AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES.some(
      item => item.eventCode === this.eventCode,
    );
  }

  /**
   * Gets the auto-generated deadline description for the docket entry
   * @returns {String} the deadline description
   */
  getAutoGeneratedDeadlineDescription() {
    return AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES.find(
      item => item.eventCode === this.eventCode,
    )?.deadlineDescription;
  }

  /**
   * generates the filedBy string from parties selected for the document
   * and contact info from the raw docket entry
   * @param {Array} petitioners the petitioners on the case the docket entry belongs
   * to
   */
  generateFiledBy(petitioners) {
    const isNoticeOfContactChange =
      NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES.includes(this.eventCode);

    const shouldGenerateFiledBy =
      !(isNoticeOfContactChange && this.isAutoGenerated) &&
      !DocketEntry.isServed(this);

    if (shouldGenerateFiledBy) {
      let partiesArray: string[] = [];
      const privatePractitionerIsFiling = this.privatePractitioners?.some(
        practitioner => practitioner.partyPrivatePractitioner,
      );

      if (privatePractitionerIsFiling) {
        Array.isArray(this.privatePractitioners) &&
          this.privatePractitioners.forEach(practitioner => {
            practitioner.partyPrivatePractitioner &&
              partiesArray.push(practitioner.name);
          });
      } else {
        this.partyIrsPractitioner && partiesArray.push('Resp.');

        const petitionersArray: string[] = [];
        const intervenorsArray: string[] = [];
        this.filers.forEach(contactId =>
          petitioners.forEach(p => {
            if (p.contactId === contactId) {
              if (p.contactType == 'intervenor') {
                intervenorsArray.push(p.name);
              } else {
                petitionersArray.push(p.name);
              }
            }
          }),
        );

        if (petitionersArray.length === 1) {
          partiesArray.push(`Petr. ${petitionersArray[0]}`);
        } else if (petitionersArray.length > 1) {
          partiesArray.push(`Petrs. ${petitionersArray.join(' & ')}`);
        }

        if (intervenorsArray.length === 1) {
          partiesArray.push(`Intv. ${intervenorsArray[0]}`);
        } else if (intervenorsArray.length > 1) {
          partiesArray.push(`Intvs. ${intervenorsArray.join(' & ')}`);
        }
      }

      const filedByArray: string[] = [];
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
  }

  /**
   * attaches a signedAt date to the document
   * @param {string} signByUserId the user id of the user who signed the document
   * @param {string} signedJudgeName the judge's signature for the document
   */
  setSigned(signByUserId, signedJudgeName) {
    this.signedByUserId = signByUserId;
    this.signedJudgeName = signedJudgeName;
    this.signedAt = createISODateString();
  }

  /**
   * attaches a qc date and a user to the document
   * @param {object} user the user completing QC process
   */
  setQCed(user) {
    this.qcByUserId = user.userId;
    this.qcAt = createISODateString();
  }

  /**
   * Unsets signature related fields on the docket entry
   */
  unsignDocument() {
    this.signedAt = undefined;
    this.signedJudgeName = undefined;
    this.signedJudgeUserId = undefined;
    this.signedByUserId = undefined;
  }

  /**
   * Sets the docket entry's processing status as complete
   */
  setAsProcessingStatusAsCompleted() {
    this.processingStatus = DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
  }

  /**
   * Determines whether or not the docket entry is of a document
   * type that is automatically served
   * @returns {boolean} true if the docket entry should be automatically served,
   *  otherwise false
   */
  isAutoServed() {
    const isExternalDocumentType = EXTERNAL_DOCUMENT_TYPES.includes(
      this.documentType,
    );

    const isPractitionerAssociationDocumentType =
      PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES.includes(this.documentType);

    // if fully concatenated document title includes the word Simultaneous, do not auto-serve
    const isSimultaneous = (this.documentTitle || this.documentType).includes(
      'Simultaneous',
    );

    return (
      (isExternalDocumentType || isPractitionerAssociationDocumentType) &&
      !isSimultaneous
    );
  }

  isCourtIssued(): boolean {
    return DocketEntry.isCourtIssued({ eventCode: this.eventCode });
  }

  static TRANSCRIPT_AGE_DAYS_MIN = 90;

  static isCourtIssued({ eventCode }: { eventCode: string }): boolean {
    return COURT_ISSUED_EVENT_CODES.map(
      ({ eventCode: courtIssuedEventCode }) => courtIssuedEventCode,
    ).includes(eventCode);
  }

  static isAvailableToExternal = (entry: RawDocketEntry): boolean => {
    const servedOrUnservable =
      DocketEntry.isServed(entry) || DocketEntry.isUnservable(entry);

    return (
      servedOrUnservable &&
      !entry.isStricken &&
      entry.isOnDocketRecord &&
      entry.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE
    );
  };

  static isPublicEventCode(eventCode: string) {
    return (
      DocketEntry.isOrder(eventCode) ||
      DocketEntry.isDecision(eventCode) ||
      DocketEntry.isOpinion(eventCode) ||
      ['OCS', 'TCRP', 'ODL'].includes(eventCode)
    );
  }

  static isPublic(
    entry: RawDocketEntry,
    {
      caseIsSealed = false,
      rootDocument,
      visibilityChangeDate,
    }: {
      caseIsSealed?: boolean;
      rootDocument?: RawDocketEntry;
      visibilityChangeDate: string;
    },
  ): boolean {
    if (
      !DocketEntry.isAvailableToExternal(entry) ||
      DocketEntry.isTranscript(entry.eventCode) ||
      DocketEntry.isSealed(entry)
    ) {
      return false;
    }

    if (caseIsSealed) {
      return DocketEntry.isOpinion(entry.eventCode);
    }
    if (DocketEntry.isPublicEventCode(entry.eventCode)) {
      return true;
    }
    if (entry.lodged) {
      return false;
    }

    if (
      !POLICY_DATE_IMPACTED_EVENTCODES.includes(entry.eventCode) ||
      entry.filingDate < visibilityChangeDate
    ) {
      return false;
    }
    if ([AMICUS_BRIEF_EVENT_CODE, 'SDEC'].includes(entry.eventCode)) {
      return true;
    }

    if (rootDocument && rootDocument.eventCode === AMICUS_BRIEF_EVENT_CODE) {
      return true;
    }

    if (!DocketEntry.isFiledByPractitioner(entry.filedByRole)) {
      return false;
    }

    if (
      !entry.isPaper &&
      DocketEntry.isFiledByPractitioner(entry.filedByRole) &&
      DocketEntry.isBrief(entry.eventCode)
    ) {
      return true;
    }

    if (!rootDocument || !DocketEntry.isBriefType(rootDocument.documentType)) {
      return false;
    }

    return (
      !rootDocument.isPaper &&
      DocketEntry.isFiledByPractitioner(rootDocument.filedByRole)
    );
  }

  static isFiledByPractitioner(filedByRole?: string): boolean {
    return (
      !!filedByRole &&
      [ROLES.privatePractitioner, ROLES.irsPractitioner].includes(filedByRole)
    );
  }

  static isOpinion(eventCode: string): boolean {
    return OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(eventCode);
  }

  static isOrder(eventCode: string): boolean {
    return ORDER_EVENT_CODES.includes(eventCode);
  }

  static isMotion(eventCode: string): boolean {
    return MOTION_EVENT_CODES.includes(eventCode);
  }

  static isTranscript(eventCode: string): boolean {
    return [
      TRANSCRIPT_EVENT_CODE,
      CORRECTED_TRANSCRIPT_EVENT_CODE,
      REVISED_TRANSCRIPT_EVENT_CODE,
    ].includes(eventCode);
  }

  static isDecision(eventCode: string): boolean {
    return eventCode === DECISION_EVENT_CODE;
  }

  static isBrief(eventCode: string): boolean {
    return BRIEF_EVENTCODES.includes(eventCode);
  }

  static isBriefType(documentType: string): boolean {
    const documentTypes = [
      AMICUS_BRIEF_DOCUMENT_TYPE,
      ...[
        ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Simultaneous Brief'],
        ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Seriatim Brief'],
      ].map(document => document.documentType),
    ];

    return !!documentTypes.includes(documentType);
  }

  static isTranscriptOldEnoughToUnseal = doc => {
    if (!DocketEntry.isTranscript(doc.eventCode)) return true;

    const dateStringToCheck = doc.isLegacy ? doc.filingDate : doc.date;
    const availableOnDate = calculateISODate({
      dateString: dateStringToCheck,
      howMuch: DocketEntry.TRANSCRIPT_AGE_DAYS_MIN,
      units: 'days',
    });
    const rightNow = createISODateString();

    const meetsTranscriptAgeRequirements = availableOnDate <= rightNow;
    return meetsTranscriptAgeRequirements;
  };

  static isSealed = ({ isLegacySealed, isSealed }: RawDocketEntry): boolean =>
    !!(isSealed || isLegacySealed);

  static isSealedToExternal = ({ sealedTo }: RawDocketEntry): boolean =>
    sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL;

  static isDownloadable = (
    entry: RawDocketEntry,
    {
      isTerminalUser = false,
      rawCase,
      user,
      visibilityChangeDate,
    }: {
      rawCase: RawCase | RawPublicCase;
      user: { userId: string; role: Role };
      isTerminalUser: boolean;
      visibilityChangeDate: string;
    },
  ): boolean => {
    if (!entry.isFileAttached) return false;

    const petitionDocketEntry = getPetitionDocketEntry(rawCase);

    //Only allow STIN download if:
    //  - role Petition Clerk & entry not served, or
    //  - role Case Services Supervisor & entry not served, or
    //  - role IRS Superuser and entry served.
    if (entry.eventCode == STIN_DOCKET_ENTRY_TYPE.eventCode) {
      return canDownloadSTIN(entry, petitionDocketEntry, user);
    }

    if (User.isInternalUser(user.role)) return true;

    if (!DocketEntry.isServed(entry) && !DocketEntry.isUnservable(entry)) {
      return false;
    }

    if (user.role === ROLES.irsSuperuser)
      return DocketEntry.isServed(petitionDocketEntry);

    if (isTerminalUser) return !DocketEntry.isSealed(entry);

    const userHasAccessToCase = Case.userHasAccessToCase(rawCase, user);

    const isPublicDocument = DocketEntry.isPublic(entry, {
      caseIsSealed: isSealedCase(rawCase),
      rootDocument: DocketEntry.fetchRootDocument(entry, rawCase.docketEntries),
      visibilityChangeDate,
    });

    if (!userHasAccessToCase || isPublicDocument) return !!isPublicDocument;
    if (entry.isStricken || DocketEntry.isSealedToExternal(entry)) return false;
    if (DocketEntry.isTranscript(entry.eventCode))
      return DocketEntry.isTranscriptOldEnoughToUnseal(entry);
    return true;
  };

  /**
   * sets the number of pages for the docket entry
   * @param {Number} numberOfPages the number of pages
   */
  setNumberOfPages(numberOfPages) {
    this.numberOfPages = numberOfPages;
  }

  setFiledBy(user: { userId: string; role: Role }): void {
    this.userId = user.userId;
    this.filedByRole = user.role;
  }

  /**
   * strikes this docket entry
   * @param {object} obj param
   * @param {string} obj.name user name
   * @param {string} obj.userId user id
   */
  strikeEntry({ name: strickenByName, userId }) {
    if (this.isOnDocketRecord) {
      this.isStricken = true;
      this.strickenBy = strickenByName;
      this.strickenByUserId = userId;
      this.strickenAt = createISODateString();
    } else {
      throw new Error(
        'Cannot strike a document that is not on the docket record.',
      );
    }
  }

  /**
   * Seal this docket entry
   * @param {object} obj param
   * @param {string} obj.sealedTo the type of user to seal this docket entry from
   */
  sealEntry({ sealedTo }) {
    this.sealedTo = sealedTo;
    this.isSealed = true;
  }

  /**
   * Unseal this docket entry
   *
   */
  unsealEntry() {
    delete this.sealedTo;
    this.isSealed = false;
    this.isLegacySealed = false;
  }

  static isPendingOnCreation(rawDocketEntry) {
    return TRACKED_DOCUMENT_TYPES_EVENT_CODES.includes(
      rawDocketEntry.eventCode,
    );
  }

  /**
   * The pending boolean on the DocketEntry just represents if the user checked the
   * add to pending report checkbox.  This is a computed that uses that along with
   * eventCodes and servedAt to determine if the docket entry is pending.
   * @param {DocketEntryClass} docketEntry the docket entry to check pending state
   * @returns {boolean} is the docket entry is pending or not
   */
  static isPending(docketEntry) {
    return (
      docketEntry.pending &&
      (DocketEntry.isServed(docketEntry) ||
        UNSERVABLE_EVENT_CODES.find(
          unservedCode => unservedCode === docketEntry.eventCode,
        ))
    );
  }

  getValidationRules() {
    return DOCKET_ENTRY_VALIDATION_RULES;
  }

  static isMinuteEntry({
    eventCode,
    isFileAttached,
  }: {
    eventCode: string;
    isFileAttached?: boolean;
  }): boolean {
    if (eventCode === 'RQT') {
      return !isFileAttached;
    }

    const MINUTE_ENTRIES_EVENT_CODES = Object.values(MINUTE_ENTRIES_MAP).map(
      v => v.eventCode,
    );

    return MINUTE_ENTRIES_EVENT_CODES.includes(eventCode);
  }

  static isServed(rawDocketEntry: RawDocketEntry): boolean {
    return !!rawDocketEntry.servedAt || !!rawDocketEntry.isLegacyServed;
  }

  static isUnservable({
    eventCode,
    isLegacyServed,
  }: {
    eventCode: string;
    isLegacyServed?: boolean;
  }): boolean {
    return UNSERVABLE_EVENT_CODES.includes(eventCode) || !!isLegacyServed;
  }

  static fetchRootDocument = (
    entry: RawDocketEntry,
    docketEntries: RawDocketEntry[],
  ): RawDocketEntry => {
    const { previousDocument } = entry;
    if (!previousDocument) return entry;

    const previousEntry = docketEntries.find(
      e => e.docketEntryId === previousDocument.docketEntryId,
    );

    if (!previousEntry) return entry;

    return DocketEntry.fetchRootDocument(previousEntry, docketEntries);
  };
}

/**
 * Determines the servedPartiesCode based on the given servedParties
 * @param {Array} servedParties List of parties that have been served
 * @returns {String} served parties code
 */
export const getServedPartiesCode = (servedParties?: any[]) => {
  let servedPartiesCode: string | undefined = undefined;
  if (servedParties && servedParties.length > 0) {
    if (
      servedParties.length === 1 &&
      servedParties[0].role === ROLES.irsSuperuser
    ) {
      servedPartiesCode = PARTIES_CODES.RESPONDENT;
    } else {
      servedPartiesCode = PARTIES_CODES.BOTH;
    }
  }
  return servedPartiesCode;
};

declare global {
  type RawDocketEntry = ExcludeMethods<DocketEntry>;
}
