import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, isAddAnother = true) => {
  return it('Docketclerk saves docket entry', async () => {
    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isAddAnother,
    });

    expect(test.getState('wizardStep')).toEqual('PrimaryDocumentForm');

    if (isAddAnother) {
      expect(test.getState('documentUploadMode')).toEqual('scan');
      expect(test.getState('currentPage')).toEqual('AddDocketEntry');
      expect(test.getState('form')).toMatchObject({
        lodged: false,
        practitioner: [],
      });
      expect(test.getState('documentSelectedForScan')).toEqual(
        'primaryDocumentFile',
      );
    } else {
      expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    }

    const caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    test.docketRecordEntry = caseDetailFormatted.docketRecordWithDocument.pop();
  });
};
