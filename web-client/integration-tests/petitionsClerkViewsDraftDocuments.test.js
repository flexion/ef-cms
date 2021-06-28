import { fakeFile, loginAs, setupTest, viewCaseDetail } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const integrationTest = setupTest();

describe('Petitions Clerk Views Draft Documents', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile, 'Lubbock, Texas');

  it('views case detail', async () => {
    await viewCaseDetail({
      docketNumber: integrationTest.docketNumber,
      integrationTest,
    });
  });

  petitionsClerkAddsOrderToCase(integrationTest);
  petitionsClerkAddsOrderToCase(integrationTest);
  petitionsClerkViewsDraftDocuments(integrationTest, 2);

  it('views the second document in the draft documents list', async () => {
    // reset the draft documents view meta
    integrationTest.setState('draftDocumentViewerDocketEntryId', null);

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      primaryTab: 'drafts',
    });

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toEqual(true);

    // this gets fired when the component is mounted, so it is being explicitly called here
    await integrationTest.runSequence(
      'loadDefaultDraftViewerDocumentToDisplaySequence',
    );

    let formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    let { draftDocuments } = formattedCase;

    const viewerDraftDocumentIdToDisplay = integrationTest.getState(
      'viewerDraftDocumentToDisplay.docketEntryId',
    );
    expect(viewerDraftDocumentIdToDisplay).toEqual(
      draftDocuments[0].docketEntryId,
    );

    // select the second document in the list
    await integrationTest.runSequence(
      'setViewerDraftDocumentToDisplaySequence',
      {
        viewerDraftDocumentToDisplay: draftDocuments[1],
      },
    );

    expect(
      integrationTest.getState(
        'screenMetadata.draftDocumentViewerDocketEntryId',
      ),
    ).toEqual(draftDocuments[1].docketEntryId);

    // change tabs and come back to draft documents

    integrationTest.setState(
      'currentViewMetadata.caseDetail.primaryTab',
      'docketRecord',
    );
    await integrationTest.runSequence('caseDetailPrimaryTabChangeSequence');

    integrationTest.setState(
      'currentViewMetadata.caseDetail.primaryTab',
      'drafts',
    );
    await integrationTest.runSequence('caseDetailPrimaryTabChangeSequence');

    expect(
      integrationTest.getState('viewerDraftDocumentToDisplay.docketEntryId'),
    ).toEqual(draftDocuments[1].docketEntryId);

    //leave case and come back
    await integrationTest.runSequence('gotoDashboardSequence');

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      primaryTab: 'drafts',
    });

    // this gets fired when the component is mounted, so it is being explicitly called here
    await integrationTest.runSequence(
      'loadDefaultDraftViewerDocumentToDisplaySequence',
    );

    formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    // resets back to first document
    expect(
      integrationTest.getState('viewerDraftDocumentToDisplay.docketEntryId'),
    ).toEqual(formattedCase.draftDocuments[0].docketEntryId);
  });
});
