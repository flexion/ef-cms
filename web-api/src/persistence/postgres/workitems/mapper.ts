import { NewWorkItemKysely } from '@web-api/database-types';
import { RawWorkItem } from '@shared/business/entities/WorkItem';

function pickFields(workItem) {
  return {
    docket_entry: JSON.stringify(workItem.docketEntry),
    work_item_id: workItem.workItemId,
    assignee_id: workItem.assigneeId,
    assignee_name: workItem.assigneeName,
    associated_judge: workItem.associatedJudge,
    associated_judge_id: workItem.associatedJudgeId,
    case_is_in_progress: workItem.caseIsInProgress,
    case_status: workItem.caseStatus,
    case_title: workItem.caseTitle,
    completed_at: workItem.completedAt,
    completed_by: workItem.completedBy,
    completed_by_user_id: workItem.completedByUserId,
    completed_message: workItem.completedMessage,
    created_at: workItem.createdAt,
    docket_number: workItem.docketNumber,
    docket_number_with_suffix: workItem.docketNumberWithSuffix,
    hide_from_pending_messages: workItem.hideFromPendingMessages,
    high_priority: workItem.highPriority,
    in_progress: workItem.inProgress,
    is_initialize_case: workItem.isInitializeCase,
    is_read: workItem.isRead,
    lead_docket_number: workItem.leadDocketNumber,
    section: workItem.section,
    sent_by: workItem.sentBy,
    sent_by_section: workItem.sentBySection,
    sent_by_user_id: workItem.sentByUserId,
    trial_date: workItem.trialDate,
    trial_location: workItem.trialLocation,
    updated_at: workItem.updatedAt,
  };
}

// export function toKyselyUpdateMessage(
//   message: RawMessage,
// ): UpdateMessageKysely {
//   return pickFields(message);
// }

// export function toKyselyUpdateMessages(
//   messages: RawMessage[],
// ): UpdateMessageKysely[] {
//   return messages.map(pickFields);
// }

export function toKyselyNewWorkItem(workItem: RawWorkItem): NewWorkItemKysely {
  return pickFields(workItem);
}

// export function toKyselyNewMessages(
//   messages: RawMessage[],
// ): NewMessageKysely[] {
//   return messages.map(pickFields);
// }
