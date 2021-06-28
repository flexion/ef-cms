import { addDocketEntryHelper as addDocketEntryHelperComputed } from '../../src/presenter/computeds/addDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkQCsNCAForCaseWithPaperService = integrationTest => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  return it('Docket Clerk QCs NCA for case with paper service', async () => {
    await refreshElasticsearchIndex();

    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    });

    const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === integrationTest.docketNumber,
    );

    expect(noticeOfChangeOfAddressQCItem).toMatchObject({
      docketEntry: { documentTitle: 'Notice of Change of Address' },
    });

    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    noticeOfChangeOfAddressQCItem.index =
      noticeOfChangeOfAddressQCItem.index || lastIndex;

    const { docketEntryId } =
      formattedDocketEntriesOnDocketRecord[noticeOfChangeOfAddressQCItem.index];

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    const addDocketEntryHelper = withAppContextDecorator(
      addDocketEntryHelperComputed,
    );

    const { showFilingPartiesForm } = runCompute(addDocketEntryHelper, {
      state: integrationTest.getState(),
    });

    expect(showFilingPartiesForm).toBe(false);

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
