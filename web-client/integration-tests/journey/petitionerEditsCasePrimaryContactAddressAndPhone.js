import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
export default test => {
  return it('petitioner updates primary contact address and phone', async () => {
    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.address1',
      value: '101 Main St.',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.address3',
      value: 'Apt. 101',
    });

    await test.runSequence('updateCaseValueSequence', {
      key: 'contactPrimary.phone',
      value: '1111111111',
    });

    await test.runSequence('submitEditPrimaryContactSequence');

    expect(test.getState('caseDetail.contactPrimary.address1')).toEqual(
      '101 Main St.',
    );
    expect(test.getState('caseDetail.contactPrimary.address3')).toEqual(
      'Apt. 101',
    );
    expect(test.getState('caseDetail.contactPrimary.phone')).toEqual(
      '1111111111',
    );

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );
    expect(
      caseDetailFormatted.docketRecordWithDocument[4].record.description,
    ).toContain('Notice of Change of Address and Telephone Number');
  });
};
