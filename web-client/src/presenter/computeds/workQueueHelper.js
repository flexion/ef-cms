import { state } from 'cerebral';

export const workQueueHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const USER_ROLES = get(state.constants.USER_ROLES);
  const isJudge = user.role === USER_ROLES.judge;
  const { myInboxUnreadCount, qcUnreadCount } = get(state.notifications);
  const { workQueueIsInternal } = workQueueToDisplay;
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showInProgress = workQueueToDisplay.box === 'inProgress';
  const showOutbox = workQueueToDisplay.box === 'outbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = workQueueIsInternal
    ? myInboxUnreadCount
    : qcUnreadCount;
  const workQueueType = workQueueIsInternal ? 'Messages' : 'Document QC';
  const isDisplayingQC = !workQueueIsInternal;
  const userIsPetitionsClerk = user.role === USER_ROLES.petitionsClerk;
  const userIsDocketClerk = user.role === USER_ROLES.docketClerk;
  const userIsOther = ![
    USER_ROLES.docketClerk,
    USER_ROLES.petitionsClerk,
  ].includes(user.role);
  const workQueueTitle = `${
    showIndividualWorkQueue
      ? 'My'
      : userIsOther && !workQueueIsInternal
      ? 'Docket'
      : 'Section'
  } ${workQueueType}`;
  const permissions = get(state.permissions);

  const showStartCaseButton = permissions.START_PAPER_CASE && isDisplayingQC;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: workQueueToDisplay.box,
    getQueuePath: ({ box, queue }) => {
      return `/${
        workQueueIsInternal ? 'messages' : 'document-qc'
      }/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsClerk && isDisplayingQC,
    hideFiledByColumn: !(isDisplayingQC && userIsDocketClerk),
    hideFromColumn: isDisplayingQC,
    hideIconColumn: !workQueueIsInternal && userIsOther,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    isDisplayingQC,
    linkToDocumentMessages: !isDisplayingQC,
    queueEmptyMessage: workQueueIsInternal
      ? 'There are no messages.'
      : 'There are no documents.',
    sentTitle: workQueueIsInternal
      ? 'Sent'
      : userIsDocketClerk
      ? 'Processed'
      : 'Served',
    showAssignedToColumn:
      (isDisplayingQC &&
        !showIndividualWorkQueue &&
        (showInbox || showInProgress) &&
        !userIsOther) ||
      !isDisplayingQC,
    showBatchedByColumn: isDisplayingQC && userIsPetitionsClerk && showOutbox,
    showBatchedForIRSTab: userIsPetitionsClerk && workQueueIsInternal === false,
    showCaseStatusColumn: isJudge,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
    showFromColumn: isJudge,
    showInProgressTab: isDisplayingQC && userIsDocketClerk,
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMessagesSentFromColumn: !isDisplayingQC,
    showMyQueueToggle:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn: isDisplayingQC && userIsDocketClerk && showOutbox,
    showReceivedColumn: isDisplayingQC,
    showRunBatchIRSProcessButton: permissions.UPDATE_CASE,
    showSectionSentTab:
      workQueueIsInternal || userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn: isDisplayingQC && permissions.ASSIGN_WORK_ITEM,
    showSendToBar: selectedWorkItems.length > 0,
    showSentColumn: !isDisplayingQC,
    showServedColumn: userIsPetitionsClerk && isDisplayingQC,
    showStartCaseButton,
    workQueueIsInternal,
    workQueueTitle,
    workQueueType,
  };
};
