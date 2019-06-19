import {
  DOCKET_SECTION,
  IRS_BATCH_SYSTEM_SECTION,
  PETITIONS_SECTION,
  getSectionForRole,
} from '../../../../shared/src/business/entities/WorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

const formatDateIfToday = (date, applicationContext) => {
  const now = applicationContext
    .getUtilities()
    .formatDateString(undefined, 'MMDDYY');
  const then = applicationContext
    .getUtilities()
    .formatDateString(date, 'MMDDYY');
  let formattedDate;
  if (now == then) {
    formattedDate = applicationContext
      .getUtilities()
      .formatDateString(date, 'TIME');
  } else {
    formattedDate = then;
  }
  return formattedDate;
};

export const formatWorkItem = (
  applicationContext,
  workItem = {},
  selectedWorkItems = [],
  isInternal,
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
    message.createdAtTimeFormatted = applicationContext
      .getUtilities()
      .formatDateString(message.createdAt, 'DATE_TIME');
  });
  result.sentBySection = _.capitalize(result.sentBySection);
  result.completedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.completedAt, 'DATE_TIME');
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

  result.receivedAt = isInternal
    ? result.currentMessage.createdAt
    : result.document.createdAt;
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
    ).createdAtTimeFormatted;
  }

  return result;
};

export const filterWorkItems = ({
  workQueueToDisplay,
  workQueueIsInternal,
  user,
}) => {
  const { box, queue } = workQueueToDisplay;
  const userSection = getSectionForRole(user.role);

  return item => {
    let willShow;
    const isBatched = item.caseStatus === 'Batched for IRS';
    const isAssignedToUser = item.assigneeId === user.userId;

    if (box === 'inbox') {
      const showForCurrentQueue = queue === 'my' ? isAssignedToUser : true;

      willShow =
        !item.completedAt &&
        item.isInternal === workQueueIsInternal &&
        item.section === userSection &&
        showForCurrentQueue;
      if (willShow) {
        console.log(isAssignedToUser, item);
      }
    } else if (box === 'outbox') {
      if (workQueueIsInternal) {
        if (item.isInternal) {
          willShow = true;
        } else {
          willShow = false;
        }
      } else {
        if (isBatched) {
          willShow = false;
        } else {
          if (!item.isInternal) {
            willShow = true;
          } else {
            willShow = false;
          }
        }
      }
    } else if (box === 'batched') {
      if (isBatched) {
        willShow = true;
      } else {
        willShow = false;
      }
    } else if (box === 'outbox') {
      if (workQueueIsInternal) {
        if (item.isInternal) {
          willShow = true;
        } else {
          willShow = false;
        }
      } else {
        if (isBatched) {
          willShow = false;
        } else {
          if (!item.isInternal) {
            willShow = true;
          } else {
            willShow = false;
          }
        }
      }
    }

    return willShow;
  };
};

export const formattedWorkQueue = (get, applicationContext) => {
  const workItems = get(state.workQueue);
  const box = get(state.workQueueToDisplay.box);
  const isInternal = get(state.workQueueIsInternal);
  const selectedWorkItems = get(state.selectedWorkItems);

  let workQueue = workItems
    .filter(filterWorkItems)
    // .filter(item =>
    //   box === 'batched' ? item.caseStatus === 'Batched for IRS' : true,
    // )
    // .filter(item =>
    //   isInternal !== true && box === 'outbox'
    //     ? item.caseStatus !== 'Batched for IRS'
    //     : true,
    // )
    // .filter(item => item.isInternal === isInternal)
    .map(item =>
      formatWorkItem(applicationContext, item, selectedWorkItems, isInternal),
    );

  workQueue = _.orderBy(workQueue, 'receivedAt', 'desc');

  return workQueue;
};
