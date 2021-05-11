const joi = require('joi');
const {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  LEGACY_TRIAL_CITY_STRINGS,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('../EntityConstants');

const {
  calculateDifferenceInDays,
  createISODateString,
  formatDateString,
  PATTERNS,
  prepareDateFromString,
} = require('../../utilities/DateHandler');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const { compareStrings } = require('../../utilities/sortFunctions');
const { includes, isEmpty } = require('lodash');
const { TrialSession } = require('../trialSessions/TrialSession');

const TrialsAndHearings = {
  prototypes: {
    assignHearings({ applicationContext, rawCase }) {
      if (Array.isArray(rawCase.hearings)) {
        this.hearings = rawCase.hearings
          .map(hearing => new TrialSession(hearing, { applicationContext }))
          .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
      } else {
        this.hearings = [];
      }
    },
    checkForReadyForTrial() {
      const currentDate = prepareDateFromString().toISOString();

      const isCaseGeneralDocketNotAtIssue =
        this.status === CASE_STATUS_TYPES.generalDocket;

      if (isCaseGeneralDocketNotAtIssue) {
        this.docketEntries.forEach(docketEntry => {
          const isAnswerDocument = includes(
            ANSWER_DOCUMENT_CODES,
            docketEntry.eventCode,
          );

          const daysElapsedSinceDocumentWasFiled = calculateDifferenceInDays(
            currentDate,
            docketEntry.createdAt,
          );

          const requiredTimeElapsedSinceFiling =
            daysElapsedSinceDocumentWasFiled > ANSWER_CUTOFF_AMOUNT_IN_DAYS;

          if (isAnswerDocument && requiredTimeElapsedSinceFiling) {
            this.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
          }
        });
      }

      return this;
    },
    generateTrialSortTags() {
      const {
        caseType,
        docketNumber,
        highPriority,
        preferredTrialCity,
        procedureType,
        receivedAt,
      } = this;

      const caseProcedureSymbol =
        procedureType.toLowerCase() === 'regular' ? 'R' : 'S';

      let casePrioritySymbol = 'D';

      if (highPriority === true) {
        casePrioritySymbol = 'A';
      } else if (caseType.toLowerCase() === 'cdp (lien/levy)') {
        casePrioritySymbol = 'B';
      } else if (caseType.toLowerCase() === 'passport') {
        casePrioritySymbol = 'C';
      }

      const formattedFiledTime = formatDateString(receivedAt, 'YYYYMMDDHHmmss');
      const formattedTrialCity = preferredTrialCity.replace(/[\s.,]/g, '');

      const nonHybridSortKey = [
        formattedTrialCity,
        caseProcedureSymbol,
        casePrioritySymbol,
        formattedFiledTime,
        docketNumber,
      ].join('-');

      const hybridSortKey = [
        formattedTrialCity,
        'H', // Hybrid Tag
        casePrioritySymbol,
        formattedFiledTime,
        docketNumber,
      ].join('-');

      return {
        hybrid: hybridSortKey,
        nonHybrid: nonHybridSortKey,
      };
    },

    isCalendared() {
      return this.status === CASE_STATUS_TYPES.calendared;
    },

    isHearing(trialSessionId) {
      return this.hearings.some(
        trialSession => trialSession.trialSessionId === trialSessionId,
      );
    },

    isReadyForTrial() {
      return (
        this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial &&
        this.preferredTrialCity &&
        !this.blocked &&
        !this.automaticBlocked
      );
    },

    removeFromHearing(trialSessionId) {
      const removeIndex = this.hearings
        .map(trialSession => trialSession.trialSessionId)
        .indexOf(trialSessionId);

      this.hearings.splice(removeIndex, 1);
    },

    removeFromTrial(caseStatus, associatedJudge) {
      this.setAssociatedJudge(associatedJudge || CHIEF_JUDGE);
      this.setCaseStatus(
        caseStatus || CASE_STATUS_TYPES.generalDocketReadyForTrial,
      );
      this.trialDate = undefined;
      this.trialLocation = undefined;
      this.trialSessionId = undefined;
      this.trialTime = undefined;
      return this;
    },

    removeFromTrialWithAssociatedJudge(associatedJudge) {
      if (associatedJudge) {
        this.associatedJudge = associatedJudge;
      }

      this.trialDate = undefined;
      this.trialLocation = undefined;
      this.trialSessionId = undefined;
      this.trialTime = undefined;
      return this;
    },

    setAsBlocked(blockedReason) {
      this.blocked = true;
      this.blockedReason = blockedReason;
      this.blockedDate = createISODateString();
      return this;
    },

    setAsCalendared(trialSessionEntity) {
      this.updateTrialSessionInformation(trialSessionEntity);
      if (trialSessionEntity.isCalendared === true) {
        this.status = CASE_STATUS_TYPES.calendared;
      }
      return this;
    },

    setAsHighPriority(highPriorityReason) {
      this.highPriority = true;
      this.highPriorityReason = highPriorityReason;
      return this;
    },

    setAssociatedJudge(associatedJudge) {
      this.associatedJudge = associatedJudge;
      return this;
    },

    setNoticeOfTrialDate() {
      this.noticeOfTrialDate = createISODateString();
      return this;
    },

    setQcCompleteForTrial({ qcCompleteForTrial, trialSessionId }) {
      this.qcCompleteForTrial[trialSessionId] = qcCompleteForTrial;
      return this;
    },

    unsetAsBlocked() {
      this.blocked = false;
      this.blockedReason = undefined;
      this.blockedDate = undefined;
      return this;
    },

    unsetAsHighPriority() {
      this.highPriority = false;
      this.highPriorityReason = undefined;
      return this;
    },

    updateAutomaticBlocked({ caseDeadlines }) {
      const hasPendingItems = this.doesHavePendingItems();
      let automaticBlockedReason;
      if (hasPendingItems && !isEmpty(caseDeadlines)) {
        automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
      } else if (hasPendingItems) {
        automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
      } else if (!isEmpty(caseDeadlines)) {
        automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.dueDate;
      }
      if (automaticBlockedReason) {
        this.automaticBlocked = true;
        this.automaticBlockedDate = createISODateString();
        this.automaticBlockedReason = automaticBlockedReason;
      } else {
        this.automaticBlocked = false;
        this.automaticBlockedDate = undefined;
        this.automaticBlockedReason = undefined;
      }
      return this;
    },

    updateTrialSessionInformation(trialSessionEntity) {
      if (
        trialSessionEntity.isCalendared &&
        trialSessionEntity.judge &&
        trialSessionEntity.judge.name
      ) {
        this.associatedJudge = trialSessionEntity.judge.name;
      }
      this.trialSessionId = trialSessionEntity.trialSessionId;
      this.trialDate = trialSessionEntity.startDate;
      this.trialTime = trialSessionEntity.startTime;
      this.trialLocation = trialSessionEntity.trialLocation;

      return this;
    },
  },
  validation: {
    associatedJudge: JoiValidationConstants.STRING.max(50)
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('Judge assigned to this case. Defaults to Chief Judge.'),

    automaticBlocked: joi
      .boolean()
      .optional()
      .description(
        'Temporarily blocked from trial due to a pending item or due date.',
      ),
    automaticBlockedDate: JoiValidationConstants.ISO_DATE.when(
      'automaticBlocked',
      {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    automaticBlockedReason: JoiValidationConstants.STRING.valid(
      ...Object.values(AUTOMATIC_BLOCKED_REASONS),
    )
      .description('The reason the case was automatically blocked from trial.')
      .when('automaticBlocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    blocked: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] })
      .when('status', {
        is: CASE_STATUS_TYPES.calendared,
        otherwise: joi.optional(),
        then: joi.invalid(true),
      })
      .description('Temporarily blocked from trial.'),
    blockedDate: JoiValidationConstants.ISO_DATE.when('blocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }).meta({ tags: ['Restricted'] }),
    blockedReason: JoiValidationConstants.STRING.max(250)
      .description(
        'Open text field for describing reason for blocking this case from trial.',
      )
      .when('blocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .meta({ tags: ['Restricted'] }),

    highPriority: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] }),
    highPriorityReason: JoiValidationConstants.STRING.max(250)
      .when('highPriority', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .meta({ tags: ['Restricted'] }),

    judgeUserId: JoiValidationConstants.UUID.optional().description(
      'Unique ID for the associated judge.',
    ),
    preferredTrialCity: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(
          ...TRIAL_CITY_STRINGS,
          ...LEGACY_TRIAL_CITY_STRINGS,
          null,
        ),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .optional()
      .description('Where the petitioner would prefer to hold the case trial.'),
    qcCompleteForTrial: joi
      .object()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description(
        'QC Checklist object that must be completed before the case can go to trial.',
      ),
    trialDate: joi
      .alternatives()
      .conditional('trialSessionId', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.ISO_DATE.optional().allow(null),
        then: JoiValidationConstants.ISO_DATE.required(),
      })
      .description('When this case goes to trial.'),

    trialLocation: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .optional()
      .description(
        'Where this case goes to trial. This may be different that the preferred trial location.',
      ),
    trialSessionId: joi
      .when('status', {
        is: CASE_STATUS_TYPES.calendared,
        otherwise: joi.when('trialDate', {
          is: joi.exist().not(null),
          otherwise: JoiValidationConstants.UUID.optional(),
          then: JoiValidationConstants.UUID.required(),
        }),
        then: JoiValidationConstants.UUID.required(),
      })
      .description(
        'The unique ID of the trial session associated with this case.',
      ),
    trialTime: JoiValidationConstants.STRING.pattern(PATTERNS['H:MM'])
      .optional()
      .description('Time of day when this case goes to trial.'),
  },
  validationMessages: {
    preferredTrialCity: 'Select a trial location',
  },
};

module.exports = {
  TrialsAndHearings,
};
