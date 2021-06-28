import {
  contactPrimaryFromState,
  refreshElasticsearchIndex,
  viewCaseDetail,
} from '../helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkViewsCaseDetailDocumentView = integrationTest => {
  return it('Docketclerk views case detail document view', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const caseDetail = integrationTest.getState('caseDetail');

    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      integrationTest,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    await refreshElasticsearchIndex();

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimary.contactId).toBeDefined();

    await integrationTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: {
          docketEntryId: formatted.pendingItemsDocketEntries[0].docketEntryId,
        },
      },
    );

    integrationTest.docketEntryId =
      formatted.pendingItemsDocketEntries[0].docketEntryId;

    expect(integrationTest.getState('docketEntryId')).toEqual(
      integrationTest.docketEntryId,
    );

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.docketRecordTab',
      ),
    ).toEqual('documentView');
  });
};
