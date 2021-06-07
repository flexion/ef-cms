module.exports = {
  properties: {
    'associatedJudge.S': {
      type: 'text',
    },
    'automaticBlocked.BOOL': {
      type: 'boolean',
    },
    'automaticBlockedDate.S': {
      type: 'date',
    },
    'automaticBlockedReason.S': {
      type: 'text',
    },
    'blocked.BOOL': {
      type: 'boolean',
    },
    'blockedDate.S': {
      type: 'date',
    },
    'blockedReason.S': {
      type: 'text',
    },
    'caseCaption.S': {
      type: 'text',
    },
    'closedDate.S': {
      type: 'date',
    },
    'docketEntries.L.M.createdAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.docketEntryId.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.documentType.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.entityName.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.eventCode.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.filedBy.S': {
      type: 'text',
    },
    'docketEntries.L.M.filingDate.S': {
      type: 'date',
    },
    'docketEntries.L.M.indexedTimestamp.N': {
      type: 'text',
    },
    'docketEntries.L.M.isDraft.BOOL': {
      type: 'boolean',
    },
    'docketEntries.L.M.judge.S': {
      type: 'text',
    },
    'docketEntries.L.M.pending.BOOL': {
      type: 'boolean',
    },
    'docketEntries.L.M.receivedAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.servedAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.userId.S': {
      type: 'keyword',
    },
    'docketEntryId.S': {
      type: 'keyword',
    },
    'docketNumber.S': {
      type: 'keyword',
    },
    'docketNumberSuffix.S': {
      type: 'keyword',
    },
    'docketNumberWithSuffix.S': {
      type: 'keyword',
    },
    'documentContents.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentTitle.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentType.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'eventCode.S': {
      type: 'keyword',
    },
    'filingDate.S': {
      type: 'date',
    },
    'hasPendingItems.BOOL': {
      type: 'boolean',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'isCaseSealed.BOOL': {
      type: 'boolean',
    },
    'isLegacyServed.BOOL': {
      type: 'boolean',
    },
    'isSealed.BOOL': { type: 'boolean' },
    'isStricken.BOOL': {
      type: 'boolean',
    },
    'judge.S': {
      type: 'text',
    },
    'numberOfPages.N': {
      type: 'integer',
    },
    'pending.BOOL': {
      type: 'boolean',
    },
    'petitioners.L.M.contactId.S': {
      type: 'text',
    },
    'petitioners.L.M.contactType.S': {
      type: 'keyword',
    },
    'petitioners.L.M.countryType.S': {
      type: 'keyword',
    },
    'petitioners.L.M.name.S': {
      type: 'text',
    },
    'petitioners.L.M.secondaryName.S': {
      type: 'text',
    },
    'petitioners.L.M.state.S': {
      type: 'text',
    },
    'pk.S': {
      type: 'keyword',
    },
    'preferredTrialCity.S': {
      type: 'keyword',
    },
    'privatePractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'receivedAt.S': {
      type: 'date',
    },
    'sealedDate.S': {
      type: 'date',
    },
    'servedAt.S': {
      type: 'date',
    },
    'servedPartiesCode.S': {
      type: 'keyword',
    },
    'signedJudgeName.S': {
      type: 'text',
    },
    'sk.S': {
      type: 'keyword',
    },
    'sortableDocketNumber.N': {
      fields: {
        keyword: {
          type: 'keyword',
        },
      },
      type: 'integer',
    },
    'status.S': {
      type: 'keyword',
    },
    'userId.S': {
      type: 'keyword',
    },
  },
};
