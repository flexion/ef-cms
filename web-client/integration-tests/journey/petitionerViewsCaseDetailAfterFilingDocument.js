import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { DOCKET_NUMBER_SUFFIXES, INITIAL_DOCUMENT_TYPES } =
  applicationContext.getConstants();

export const petitionerViewsCaseDetailAfterFilingDocument = (
  integrationTest,
  overrides = {},
) => {
  return it('petitioner views case detail after filing a document', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const docketNumberSuffix =
      overrides.docketNumberSuffix || DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;

    const caseDetail = integrationTest.getState('caseDetail');
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(caseDetail.docketNumber).toEqual(integrationTest.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual(docketNumberSuffix);
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${integrationTest.docketNumber}${docketNumberSuffix}`,
    );

    // verify that the user was given a link to their receipt
    expect(integrationTest.getState('alertSuccess.linkUrl')).toBeDefined();

    expect(caseDetail.docketEntries.length).toEqual(6);

    //verify that the documents were added and served
    expect(caseDetail.docketEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventCode: 'P' }),
        expect.objectContaining({
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        }),
        expect.objectContaining({
          eventCode: 'M014',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'AFF',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'STAT',
          servedAt: expect.anything(),
        }),
        expect.objectContaining({
          eventCode: 'DCL',
          servedAt: expect.anything(),
        }),
      ]),
    );

    const statement = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentType === 'Statement',
    );

    expect(statement.showLinkToDocument).toBeTruthy();

    expect(formattedDocketEntriesOnDocketRecord[1].eventCode).toEqual('RQT');
  });
};
