import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, overrides = {}) => {
  return it('petitioner views case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const documentCount = overrides.documentCount || 2;
    const docketNumberSuffix = overrides.docketNumberSuffix || 'W';

    const caseDetail = test.getState('caseDetail');
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    expect(caseDetail.docketNumberSuffix).toEqual(docketNumberSuffix);
    expect(caseDetailFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}${docketNumberSuffix}`,
    );
    expect(caseDetail.documents.length).toEqual(documentCount);

    //verify that event codes were added to initial documents/docket entries
    expect(caseDetailFormatted.documents[0].eventCode).toEqual('P');
    expect(caseDetailFormatted.documents[1].eventCode).toEqual('STIN');
    expect(
      caseDetailFormatted.docketRecordWithDocument[1].record.eventCode,
    ).toEqual('RQT');

    expect(caseDetail.preferredTrialCity).toEqual('Seattle, Washington');
  });
};
