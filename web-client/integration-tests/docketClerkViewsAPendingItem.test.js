import { docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater';
import { docketClerkAddsPaperFiledPendingDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledPendingDocketEntryAndServes';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
} from './helpers';
import { formatDateString } from '../../shared/src/business/utilities/DateHandler';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const integrationTest = setupTest();

describe('a docket clerk uploads a pending item and sees that it is pending', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => {
        return new Promise(resolve => {
          resolve(new Uint8Array(fakeFile));
        });
      },
    };
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  let pendingItemsCount;

  loginAs(integrationTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('login as a docket clerk and check pending items count', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    await integrationTest.runSequence('gotoPendingReportSequence');

    await integrationTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    pendingItemsCount = (
      integrationTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater(integrationTest);
  it('docket clerk checks pending items count has not increased for a docket entry saved for later', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      integrationTest,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);

    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoPendingReportSequence');

    await integrationTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      integrationTest.getState('pendingReports.pendingItems') || []
    ).length;

    expect(currentPendingItemsCount).toEqual(pendingItemsCount);
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('respondent uploads a proposed stipulated decision', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      integrationTest,
    });
    await uploadProposedStipulatedDecision(integrationTest);
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('docket clerk checks pending items count has increased and views pending document', async () => {
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      integrationTest,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoPendingReportSequence');

    await integrationTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const currentPendingItemsCount = (
      integrationTest.getState('pendingReports.pendingItems') || []
    ).length;

    const caseReceivedAtDate = integrationTest.getState(
      'caseDetail.receivedAt',
    );
    const firstPendingItemReceivedAtDate = integrationTest.getState(
      'pendingReports.pendingItems[0].receivedAt',
    );
    expect(caseReceivedAtDate).not.toEqual(firstPendingItemReceivedAtDate);

    expect(currentPendingItemsCount).toBeGreaterThan(pendingItemsCount);

    await integrationTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: {
          docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
        },
      },
    );

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.docketRecordTab',
      ),
    ).toEqual('documentView');
  });

  docketClerkAddsPaperFiledPendingDocketEntryAndServes(
    integrationTest,
    fakeFile,
  );

  it('docket clerk views pending report items', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoPendingReportSequence');

    await integrationTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    const caseReceivedAtDate = integrationTest.getState(
      'caseDetail.receivedAt',
    );
    const pendingItems = integrationTest.getState(
      'pendingReports.pendingItems',
    );
    const pendingItem = pendingItems.find(
      item => item.docketEntryId === integrationTest.docketEntryId,
    );

    expect(pendingItem).toBeDefined();

    const answerPendingReceivedAtFormatted = formatDateString(
      pendingItem.receivedAt,
      'MMDDYYYY',
    );
    const caseReceivedAtFormatted = formatDateString(
      caseReceivedAtDate,
      'MMDDYYYY',
    );

    expect(answerPendingReceivedAtFormatted).not.toEqual(
      caseReceivedAtFormatted,
    );
    expect(answerPendingReceivedAtFormatted).toEqual('04/30/2001');
  });
});
