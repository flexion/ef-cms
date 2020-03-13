import { Case } from '../../../shared/src/business/entities/cases/Case';
import { getFormattedDocumentQCSectionOutbox, wait } from '../helpers';

export default test => {
  it('should allow edits to an in progress case', async () => {
    const lastCreatedCase = await test.getState('caseDetail');

    const { docketNumber } = lastCreatedCase;
    const { caseId } = lastCreatedCase;
    const { documentId } = lastCreatedCase.documents[0];
    test.documentId = documentId;
    test.docketNumber = docketNumber;
    test.caseId = caseId;

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'Something',
    });

    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});
  });

  it('should save edits to an in progress case', async () => {
    await test.runSequence('navigateToReviewSavedPetitionSequence');

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('saveSavedCaseForLaterSequence');
    await wait(5000);

    expect(test.getState('currentPage')).toEqual('Messages');
  });

  it('should display a confirmation modal before serving to irs', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });
    await test.runSequence('openConfirmServeToIrsModalSequence');

    expect(test.getState('showModal')).toBe('ConfirmServeToIrsModal');
  });

  it('should redirect to case detail after successfully serving to irs', async () => {
    await test.runSequence('saveCaseAndServeToIrsSequence');
    await wait(5000);

    expect(test.currentRouteUrl).toEqual(`/case-detail/${test.caseId}`);
    expect(test.getState('showModal')).toEqual('PaperServiceConfirmModal');
  });

  it('should add served case to individual served queue', async () => {
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
      workQueueIsInternal: false,
    });
    await wait(5000);

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.workQueueIsInternal).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('outbox');

    const servedCaseWorkItem = test
      .getState('workQueue')
      .find(x => x.docketNumber === test.docketNumber);

    expect(servedCaseWorkItem).toMatchObject({
      caseTitle:
        'Ada Lovelace & Julius Lenhart, Deceased, Ada Lovelace, Surviving Spouse',
    });
    expect(servedCaseWorkItem.caseStatus).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );
  });

  it('should add served case to section served queue', async () => {
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
      workQueueIsInternal: false,
    });
    await wait(5000);

    const sectionWorkQueueToDisplay = test.getState('workQueueToDisplay');

    expect(sectionWorkQueueToDisplay).toMatchObject({
      box: 'outbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    const sectionServedCaseWorkItem = test
      .getState('workQueue')
      .find(x => x.docketNumber === test.docketNumber);

    expect(sectionServedCaseWorkItem).toMatchObject({
      caseTitle:
        'Ada Lovelace & Julius Lenhart, Deceased, Ada Lovelace, Surviving Spouse',
    });
    expect(sectionServedCaseWorkItem.caseStatus).toEqual(
      Case.STATUS_TYPES.generalDocket,
    );
  });

  it('should indicate who served the case', async () => {
    const outboxItems = await getFormattedDocumentQCSectionOutbox(test);
    const desiredItem = outboxItems.find(
      x => x.docketNumber === test.docketNumber,
    );
    expect(desiredItem.sentBy).toEqual('Test Petitionsclerk');
  });
};
