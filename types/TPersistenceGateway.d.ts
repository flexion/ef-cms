interface IGetUserById {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TUser>;
}

interface IGetWorkItemById {
  ({
    applicationContext,
    workItemId,
  }: {
    applicationContext: IApplicationContext;
    workItemId: string;
  }): Promise<WorkItem>;
}

interface IPutWorkItemInOutbox {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface ISaveWorkItem {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface IGetCaseByDocketNumber {
  ({
    applicationContext,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
  }): Promise<TCase>;
}

interface IGetDocumentQCInboxForSection {
  ({
    applicationContext,
    section,
    judgeUserName,
  }: {
    applicationContext: IApplicationContext;
    section: any;
    judgeUserName: string;
  }): TSectionWorkItem[];
}
interface ICreateCaseDeadline {
  ({
    applicationContext,
    caseDeadline,
  }: {
    applicationContext: IApplicationContext;
    caseDeadline: TCaseDeadline;
  }): any;
}

interface IGetDocumentQCServedForSection {
  ({
    applicationContext,
    afterDate,
    section,
  }: {
    applicationContext: IApplicationContext;
    afterDate: string;
    section: TSectionWorkItem;
  }): any;
}

interface IGetConfigurationItemValue {
  ({
    applicationContext,
    configurationItemKey,
  }: {
    applicationContext: IApplicationContext;
    configurationItemKey: string;
  }): string;
}

interface IUpdateDocketEntry {
  ({
    applicationContext,
    docketEntryId,
  }: {
    applicationContext: IApplicationContext;
    docketEntryId: string;
    docketNumber: string;
    document: any;
  }): Promise<any>;
}

interface ICreateMessage {
  ({
    applicationContext,
    message,
  }: {
    applicationContext: IApplicationContext;
    message: TMessageData;
  }): Promise<void>;
}

interface IMarkMessageThreadRepliedTo {
  ({
    applicationContext,
    parentMessageId,
  }: {
    applicationContext: IApplicationContext;
    parentMessageId: string;
  }): Promise<void>;
}

interface IGetMessageThreadByParentId {
  ({
    applicationContext,
    parentMessageId,
  }: {
    applicationContext: IApplicationContext;
    parentMessageId: string;
  }): Promise<TMessageData[]>;
}

interface IUpdateMessage {
  ({
    applicationContext,
    message,
  }: {
    applicationContext: IApplicationContext;
    message: TMessageData;
  }): Promise<void>;
}

interface IGetCompletedSectionInboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetCompletedUserInboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface IGetSectionInboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetUserInboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface IGetMessagesByDocketNumber {
  ({
    applicationContext,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
  }): Promise<TMessageData[]>;
}

interface IGetSectionOutboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetUserOutboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface ISetMessageAsRead {
  ({
    applicationContext,
    docketNumber,
    messageId,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
    messageId: string;
  }): Promise<void>;
}

interface IGetTrialSessionById {
  ({
    applicationContext,
    trialSessionId,
  }: {
    applicationContext: IApplicationContext;
    trialSessionId: string;
  }): Promise<TTrialSessionData>;
}

type TPersistenceGateway = {
  [key: string]: any;
  createCaseDeadline: ICreateCaseDeadline;
  getCaseByDocketNumber: IGetCaseByDocketNumber;
  getUserById: IGetUserById;
  getWorkItemById: IGetWorkItemById;
  putWorkItemInOutbox: IPutWorkItemInOutbox;
  getDocumentQCInboxForSection: IGetDocumentQCInboxForSection;
  saveWorkItem: ISaveWorkItem;
  getDocumentQCServedForSection: IGetDocumentQCServedForSection;
  getConfigurationItemValue: IGetConfigurationItemValue;
  updateDocketEntry: IUpdateDocketEntry;
  createMessage: ICreateMessage;
  markMessageThreadRepliedTo: IMarkMessageThreadRepliedTo;
  getMessageThreadByParentId: IGetMessageThreadByParentId;
  updateMessage: IUpdateMessage;
  getCompletedSectionInboxMessages: IGetCompletedSectionInboxMessages;
  getCompletedUserInboxMessages: IGetCompletedUserInboxMessages;
  getSectionInboxMessages: IGetSectionInboxMessages;
  getUserInboxMessages: IGetUserInboxMessages;
  getMessagesByDocketNumber: IGetMessagesByDocketNumber;
  getSectionOutboxMessages: IGetSectionOutboxMessages;
  getUserOutboxMessages: IGetUserOutboxMessages;
  setMessageAsRead: ISetMessageAsRead;
  getTrialSessionById: IGetTrialSessionById;
};
