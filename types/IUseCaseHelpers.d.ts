interface IUpdateCaseAndAssociations {
  ({
    applicationContext,
    caseToUpdate,
  }: {
    applicationContext: IApplicationContext;
    caseToUpdate: any;
  }): Promise<TCase>;
}

interface IUpdateCaseAutomaticBlock {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
  }): any;
}

interface IUpdateCaseAutomaticBlock {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
  }): any;
}

interface IRemoveCounselFromRemovedPetitioner {
  ({
    applicationContext: IApplicationContext,
    caseEntity,
    petitionerContactId,
  }: {
    applicationContext: IApplicationContext;
    caseEntity: any;
    petitionerContactId: string;
  }): any;
}

type TUseCaseHelpers = {
  [key: string]: any;
  updateCaseAndAssociations: IUpdateCaseAndAssociations;
  updateCaseAutomaticBlock: IUpdateCaseAutomaticBlock;
  removeCounselFromRemovedPetitioner: IRemoveCounselFromRemovedPetitioner;
};
