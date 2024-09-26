import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  message: MessageTable;
  case: CaseTable;
  work_item: WorkItemTable;
}

export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  caseStatus: string;
  caseTitle: string;
  completedAt?: string;
  completedBy?: string;
  completedBySection?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: string;
  docketNumber: string;
  from: string;
  fromSection: string;
  fromUserId: string;
  isCompleted: boolean;
  isRead: boolean;
  isRepliedTo: boolean;
  leadDocketNumber?: string;
  message: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
  to: string;
  toSection: string;
  toUserId: string;
}

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

export interface CaseTable {
  docketNumber: string;
  trialLocation?: string;
  trialDate?: string;
  leadDocketNumber?: string;
  docketNumberSuffix?: string;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface WorkItemTable {
  work_item_id: string;
  assignee_id?: string;
  assignee_name?: string;
  associated_judge: string;
  associated_judge_id?: string;
  case_is_in_progress?: boolean;
  case_status: string;
  case_title?: string;
  completed_at?: string;
  completed_by?: string;
  completed_by_user_id?: string;
  completed_message?: string;
  created_at: string;
  docket_entry: any;
  docket_number: string;
  docket_number_with_suffix?: string;
  hide_from_pending_messages?: boolean;
  high_priority?: boolean;
  in_progress?: boolean;
  is_initialize_case?: boolean;
  is_read?: boolean;
  lead_docket_number?: string;
  section: string;
  sent_by: string;
  sent_by_section?: string;
  sent_by_user_id?: string;
  trial_date?: string;
  trial_location?: string;
  updated_at: string;
}

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;
