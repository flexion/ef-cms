const joi = require('joi');
const {
  CASE_CAPTION_POSTFIX,
  INITIAL_DOCUMENT_TYPES,
  MINUTE_ENTRIES_MAP,
  ROLES,
} = require('../EntityConstants');
const {
  DOCKET_ENTRY_VALIDATION_RULES,
} = require('../EntityValidationConstants');
const {
  shouldGenerateDocketRecordIndex,
} = require('../../utilities/shouldGenerateDocketRecordIndex');
const { compareStrings } = require('../../utilities/sortFunctions');
const { createISODateString } = require('../../utilities/DateHandler');
const { DocketEntry } = require('../DocketEntry');

const CaseDocketEntries = {
  prototypes: {
    addDocketEntry(docketEntryEntity) {
      docketEntryEntity.docketNumber = this.docketNumber;

      if (docketEntryEntity.isOnDocketRecord) {
        const updateIndex = shouldGenerateDocketRecordIndex({
          caseDetail: this,
          docketEntry: docketEntryEntity,
        });

        if (updateIndex) {
          docketEntryEntity.index = this.generateNextDocketRecordIndex();
        }
      }

      this.docketEntries = [...this.docketEntries, docketEntryEntity];
    },

    assignDocketEntries({
      applicationContext,
      filtered,
      isSealedCase,
      rawCase,
    }) {
      if (Array.isArray(rawCase.docketEntries)) {
        this.docketEntries = rawCase.docketEntries
          .map(
            docketEntry =>
              new DocketEntry(docketEntry, { applicationContext, filtered }),
          )
          .sort((a, b) => compareStrings(a.createdAt, b.createdAt));

        this.isSealed = isSealedCase(rawCase);

        if (
          filtered &&
          applicationContext.getCurrentUser().role !== ROLES.irsSuperuser &&
          (applicationContext.getCurrentUser().role !== ROLES.petitionsClerk ||
            this.getIrsSendDate())
        ) {
          this.docketEntries = this.docketEntries.filter(
            d => d.documentType !== INITIAL_DOCUMENT_TYPES.stin.documentType,
          );
        }
      } else {
        this.docketEntries = [];
      }
    },

    deleteDocketEntryById({ docketEntryId }) {
      this.docketEntries = this.docketEntries.filter(
        item => item.docketEntryId !== docketEntryId,
      );

      return this;
    },

    generateNextDocketRecordIndex() {
      const nextIndex =
        this.docketEntries
          .filter(d => d.isOnDocketRecord && d.index !== undefined)
          .sort((a, b) => a.index - b.index).length + 1;
      return nextIndex;
    },

    getDocketEntryById({ docketEntryId }) {
      return this.docketEntries.find(
        docketEntry => docketEntry.docketEntryId === docketEntryId,
      );
    },

    updateCaseCaptionDocketRecord({ applicationContext }) {
      const caseCaptionRegex = /^Caption of case is amended from '(.*)' to '(.*)'/;
      let lastCaption = this.initialCaption;

      this.docketEntries.forEach(docketEntry => {
        const result = caseCaptionRegex.exec(docketEntry.documentTitle);
        if (result) {
          const [, , changedCaption] = result;
          lastCaption = changedCaption.replace(` ${CASE_CAPTION_POSTFIX}`, '');
        }
      });

      const needsCaptionChangedRecord =
        this.initialCaption &&
        lastCaption !== this.caseCaption &&
        !this.isPaper;

      if (needsCaptionChangedRecord) {
        const { userId } = applicationContext.getCurrentUser();

        this.addDocketEntry(
          new DocketEntry(
            {
              documentTitle: `Caption of case is amended from '${lastCaption} ${CASE_CAPTION_POSTFIX}' to '${this.caseCaption} ${CASE_CAPTION_POSTFIX}'`,
              documentType:
                MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.documentType,
              eventCode: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.eventCode,
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
    },

    updateDocketEntry(updatedDocketEntry) {
      const foundDocketEntryIndex = this.docketEntries.findIndex(
        docketEntry =>
          docketEntry.docketEntryId === updatedDocketEntry.docketEntryId,
      );

      if (foundDocketEntryIndex !== -1) {
        this.docketEntries[foundDocketEntryIndex] = updatedDocketEntry;

        if (updatedDocketEntry.isOnDocketRecord) {
          const updateIndex = shouldGenerateDocketRecordIndex({
            caseDetail: this,
            docketEntry: updatedDocketEntry,
          });

          if (updateIndex) {
            updatedDocketEntry.index = this.generateNextDocketRecordIndex();
          }
        }
      }

      return this;
    },
  },
  validation: {
    docketEntries: joi
      .array()
      .items(DOCKET_ENTRY_VALIDATION_RULES)
      .required()
      .description('List of DocketEntry Entities for the case.'),
  },
  validationMessages: {
    docketEntries: 'At least one valid docket entry is required',
  },
};

module.exports = {
  CaseDocketEntries,
};
