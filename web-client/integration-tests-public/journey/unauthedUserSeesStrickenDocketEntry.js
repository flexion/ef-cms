import { applicationContextPublic } from '../../src/applicationContextPublic';
import { contactPrimaryFromState } from '../../integration-tests/helpers';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

export const unauthedUserSeesStrickenDocketEntry = (
  integrationTest,
  docketRecordIndex,
) => {
  return it('View case detail', async () => {
    await integrationTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(
      integrationTest.currentRouteUrl.includes('/case-detail'),
    ).toBeTruthy();
    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.name).toBeDefined();

    const { formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: integrationTest.getState(),
      },
    );

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    integrationTest.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
