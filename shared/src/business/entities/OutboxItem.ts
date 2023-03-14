import { CASE_STATUS_TYPES } from './EntityConstants';
import {
  IValidationEntity,
  TStaticValidationMethods,
  joiValidationDecorator,
  validEntityDecorator,
} from './JoiValidationDecorator';
import { OUTBOX_ITEM_VALIDATION_RULES } from './EntityValidationConstants';
import { pick } from 'lodash';

export class OutboxItemClass {
  public entityName: string;
  public caseStatus: string;
  public caseTitle: string;
  public completedAt: string;
  public completedBy: string;
  public caseIsInProgress: boolean;
  public docketEntry: Partial<RawDocketEntry>;
  public docketNumber: string;
  public highPriority: boolean;
  public inProgress: boolean;
  public leadDocketNumber: string;
  public section: string;
  public assigneeId: string;
  public trialDate: string;
  public workItemId: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawOutboxItem: RawOutboxItem, { applicationContext }) {
    this.entityName = 'OutboxItem';
  }

  init(rawOutboxItem: RawOutboxItem, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.caseStatus = rawOutboxItem.caseStatus;
    this.caseTitle = rawOutboxItem.caseTitle;
    this.completedAt = rawOutboxItem.completedAt;
    this.completedBy = rawOutboxItem.completedBy;
    this.caseIsInProgress = rawOutboxItem.caseIsInProgress;
    this.assigneeId = rawOutboxItem.assigneeId;
    this.docketEntry = pick(rawOutboxItem.docketEntry, [
      'descriptionDisplay',
      'docketEntryId',
      'documentType',
      'eventCode',
      'filedBy',
      'isCourtIssuedDocument',
      'isFileAttached',
      'isLegacyServed',
      'isMinuteEntry',
      'isOrder',
      'isPaper',
      'isUnservable',
      'servedAt',
    ]);

    this.docketNumber = rawOutboxItem.docketNumber;
    this.highPriority =
      rawOutboxItem.highPriority ||
      rawOutboxItem.caseStatus === CASE_STATUS_TYPES.calendared;
    this.inProgress = rawOutboxItem.inProgress;
    this.leadDocketNumber = rawOutboxItem.leadDocketNumber;
    this.section = rawOutboxItem.section;
    this.trialDate = rawOutboxItem.trialDate;
    this.workItemId =
      rawOutboxItem.workItemId || applicationContext.getUniqueId();
  }
}

joiValidationDecorator(OutboxItemClass, OUTBOX_ITEM_VALIDATION_RULES);

export const OutboxItem: typeof OutboxItemClass &
  TStaticValidationMethods<RawOutboxItem> =
  validEntityDecorator(OutboxItemClass);

declare global {
  type RawOutboxItem = ExcludeMethods<OutboxItemClass>;
}
// eslint-disable-next-line no-redeclare
export interface OutboxItemClass extends IValidationEntity<OutboxItemClass> {}
