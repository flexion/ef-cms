import { documentViewerHelper as documentViewerHelperComputed } from '../../src/presenter/computeds/documentViewerHelper';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
);

export const petitionsClerkServesPetitionFromDocumentView = integrationTest => {
  return it('petitions clerk serves electronic petition from document view', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const petitionDocketEntryId = integrationTest
      .getState('caseDetail.docketEntries')
      .find(d => d.eventCode === 'P').docketEntryId;

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketEntryId: petitionDocketEntryId,
      docketNumber: integrationTest.docketNumber,
      docketRecordTab: 'documentView',
    });

    await integrationTest.runSequence(
      'loadDefaultDocketViewerDocumentToDisplaySequence',
    );

    let helper = runCompute(documentViewerHelper, {
      state: integrationTest.getState(),
    });

    expect(helper.showNotServed).toBeTruthy();
    expect(helper.showServePetitionButton).toBeTruthy();

    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
      redirectUrl: `/case-detail/${integrationTest.docketNumber}/document-view?docketEntryId=${petitionDocketEntryId}`,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    expect(integrationTest.getState('currentPage')).toEqual('PetitionQc');

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'ReviewSavedPetition',
    );

    await integrationTest.runSequence('openConfirmServeToIrsModalSequence');

    await integrationTest.runSequence('serveCaseToIrsSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    await integrationTest.runSequence(
      'loadDefaultDocketViewerDocumentToDisplaySequence',
    );

    helper = runCompute(documentViewerHelper, {
      state: integrationTest.getState(),
    });

    expect(helper.showServePetitionButton).toBeFalsy();
    expect(helper.showNotServed).toBeFalsy();

    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });

    const formattedWorkItem = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    }).find(item => item.docketNumber === integrationTest.docketNumber);

    expect(formattedWorkItem.editLink).toContain(
      '/document-view?docketEntryId=',
    );
  });
};
