import {
  DOCKET_SECTION,
  IRS_BATCH_SYSTEM_SECTION,
  SENIOR_ATTORNEY_SECTION,
} from '../../../../shared/src/business/entities/WorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

const isDateToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  return now === then;
};

const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext.getUtilities().formatNow('MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  const yesterday = applicationContext.getUtilities().formatDateString(
    applicationContext
      .getUtilities()
      .prepareDateFromString()
      .add(-1, 'days')
      .toDate(),
    'MMDDYY',
  );

  let formattedDate;
  if (now == then) {
    formattedDate = applicationContext
      .getUtilities()
      .formatDateString(date, 'TIME_TZ');
  } else if (then === yesterday) {
    formattedDate = 'Yesterday';
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = (
  applicationContext,
  workItem = {},
  selectedWorkItems = [],
  workQueueIsInternal,
) => {
  const result = _.cloneDeep(workItem);

  result.createdAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.createdAt, 'MMDDYY');

  result.messages = _.orderBy(result.messages, 'createdAt', 'desc');
  result.messages.forEach(message => {
    message.createdAtFormatted = formatDateIfToday(
      message.createdAt,
      applicationContext,
    );
    message.to = message.to || 'Unassigned';
    message.createdAtTimeFormattedTZ = applicationContext
      .getUtilities()
      .formatDateString(message.createdAt, 'DATE_TIME_TZ');
  });
  result.sentBySection = _.capitalize(result.sentBySection);
  result.completedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME');
  result.completedAtFormattedTZ = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME_TZ');
  result.assigneeName = result.assigneeName || 'Unassigned';

  result.showUnreadIndicators = !result.isRead;
  result.showUnreadStatusIcon = !result.isRead;

  result.showComplete = !result.isInitializeCase;
  result.showSendTo = !result.isInitializeCase;

  if (result.assigneeName === 'Unassigned') {
    result.showUnassignedIcon = true;
  }

  switch (result.caseStatus.trim()) {
    case 'Batched for IRS':
      result.showBatchedStatusIcon = true;
      result.showUnreadStatusIcon = false;
      result.showUnassignedIcon = false;
      break;
    case 'Recalled':
      result.showRecalledStatusIcon = true;
      result.showUnreadStatusIcon = false;
      break;
    case 'General Docket - Not at Issue':
    case 'New':
    default:
      result.showBatchedStatusIcon = false;
      result.showRecalledStatusIcon = false;
  }

  if (applicationContext.getCurrentUser().role !== 'petitionsclerk') {
    result.showRecalledStatusIcon = false;
    result.showBatchedStatusIcon = false;
  }

  result.docketNumberWithSuffix = `${
    result.docketNumber
  }${result.docketNumberSuffix || ''}`;

  result.selected = !!selectedWorkItems.find(
    workItem => workItem.workItemId == result.workItemId,
  );

  result.currentMessage = result.messages[0];

  result.receivedAt = workQueueIsInternal
    ? result.currentMessage.createdAt
    : isDateToday(result.document.receivedAt, applicationContext)
    ? result.document.createdAt
    : result.document.receivedAt;
  result.received = formatDateIfToday(result.receivedAt, applicationContext);

  result.sentDateFormatted = formatDateIfToday(
    result.currentMessage.createdAt,
    applicationContext,
  );
  result.historyMessages = result.messages.slice(1);

  if (
    result.messages.find(
      message => message.message == 'Petition batched for IRS',
    )
  ) {
    result.batchedAt = result.messages.find(
      message => message.message == 'Petition batched for IRS',
    ).createdAtTimeFormattedTZ;
  }

  return result;
};

export const filterWorkItems = ({
  applicationContext,
  user,
  workQueueToDisplay,
}) => {
  const { box, queue, workQueueIsInternal } = workQueueToDisplay;
  const docQCUserSection =
    user.section === SENIOR_ATTORNEY_SECTION ? DOCKET_SECTION : user.section;
  const { Case } = applicationContext.getEntityConstructors();

  const filters = {
    documentQc: {
      my: {
        batched: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.sentByUserId === user.userId &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === Case.STATUS_TYPES.batchedForIRS
          );
        },
        inProgress: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            !item.isInternal &&
            item.section === user.section &&
            item.document.isFileAttached === false
          );
        },
        inbox: item => {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            !item.isInternal &&
            item.section === user.section &&
            item.document.isFileAttached !== false
          );
        },
        outbox: item => {
          return (
            !item.isInternal &&
            (user.role === 'petitionsclerk'
              ? item.section === IRS_BATCH_SYSTEM_SECTION
              : true) &&
            item.completedByUserId &&
            item.completedByUserId === user.userId &&
            !!item.completedAt
          );
        },
      },
      section: {
        batched: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.section === IRS_BATCH_SYSTEM_SECTION &&
            item.caseStatus === Case.STATUS_TYPES.batchedForIRS
          );
        },
        inProgress: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.section === user.section &&
            item.document.isFileAttached === false
          );
        },
        inbox: item => {
          return (
            !item.completedAt &&
            !item.isInternal &&
            item.section === docQCUserSection &&
            item.document.isFileAttached !== false
          );
        },
        outbox: item => {
          return (
            !!item.completedAt &&
            !item.isInternal &&
            (user.role === 'petitionsclerk'
              ? item.section === IRS_BATCH_SYSTEM_SECTION
              : true)
          );
        },
      },
    },
    messages: {
      my: {
        inbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.section === user.section &&
            item.assigneeId === user.userId
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.sentByUserId &&
            item.sentByUserId === user.userId
          );
        },
      },
      section: {
        inbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.section === user.section
          );
        },
        outbox: item => {
          return (
            !item.completedAt &&
            item.isInternal &&
            item.sentBySection === user.section
          );
        },
      },
    },
  };

  const view = workQueueIsInternal ? 'messages' : 'documentQc';
  const composedFilter = filters[view][queue][box];
  return composedFilter;
};

export const formattedWorkQueue = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const workItems = get(state.workQueue);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const { workQueueIsInternal } = workQueueToDisplay;
  const selectedWorkItems = get(state.selectedWorkItems);

  let workQueue = workItems
    .filter(
      filterWorkItems({
        applicationContext,
        user,
        workQueueToDisplay,
      }),
    )
    .map(item =>
      formatWorkItem(
        applicationContext,
        item,
        selectedWorkItems,
        workQueueIsInternal,
      ),
    );

  const sortFields = {
    documentQc: {
      my: {
        batched: 'batchedAt',
        inProgress: 'receivedAt',
        inbox: 'receivedAt',
        outbox: user.role === 'petitionsclerk' ? 'completedAt' : 'receivedAt',
      },
      section: {
        batched: 'batchedAt',
        inProgress: 'receivedAt',
        inbox: 'receivedAt',
        outbox: user.role === 'petitionsclerk' ? 'completedAt' : 'receivedAt',
      },
    },
    messages: {
      my: {
        inbox: 'receivedAt',
        outbox: 'receivedAt',
      },
      section: {
        inbox: 'receivedAt',
        outbox: 'receivedAt',
      },
    },
  };

  const sortDirections = {
    documentQc: {
      my: {
        batched: 'asc',
        inProgress: 'asc',
        inbox: 'asc',
        outbox: 'desc',
      },
      section: {
        batched: 'asc',
        inProgress: 'asc',
        inbox: 'asc',
        outbox: 'desc',
      },
    },
    messages: {
      my: {
        inbox: 'asc',
        outbox: 'desc',
      },
      section: {
        inbox: 'asc',
        outbox: 'desc',
      },
    },
  };

  const sortField =
    sortFields[workQueueIsInternal ? 'messages' : 'documentQc'][
      workQueueToDisplay.queue
    ][workQueueToDisplay.box];

  const sortDirection =
    sortDirections[workQueueIsInternal ? 'messages' : 'documentQc'][
      workQueueToDisplay.queue
    ][workQueueToDisplay.box];

  workQueue = _.orderBy(workQueue, [sortField, 'docketNumber'], sortDirection);

  return workQueue;
};
