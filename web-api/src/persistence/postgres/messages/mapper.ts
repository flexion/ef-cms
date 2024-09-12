import { NewMessage, UpdateMessage } from '@web-api/database-types';
import { RawMessage } from '@shared/business/entities/Message';

function pickFields(message) {
  return {
    attachments: JSON.stringify(message.attachments),
    caseStatus: message.caseStatus,
    caseTitle: message.caseTitle,
    completedAt: message.completedAt,
    completedBy: message.completedBy,
    completedBySection: message.completedBySection,
    completedByUserId: message.completedByUserId,
    completedMessage: message.completedMessage,
    createdAt: message.createdAt,
    docketNumber: message.docketNumber,
    from: message.from,
    fromSection: message.fromSection,
    fromUserId: message.fromUserId,
    isCompleted: message.isCompleted,
    isRead: message.isRead,
    isRepliedTo: message.isRepliedTo,
    message: message.message,
    messageId: message.messageId,
    parentMessageId: message.parentMessageId,
    subject: message.subject,
    to: message.to,
    toSection: message.toSection,
    toUserId: message.toUserId,
  };
}

export function toKyselyUpdateMessage(message: RawMessage): UpdateMessage {
  return pickFields(message);
}

export function toKyselyNewMessage(message: RawMessage): NewMessage {
  return pickFields(message);
}
