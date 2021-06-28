import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { CASE_TYPES_MAP } = applicationContext.getConstants();

export const petitionerChoosesCaseType = integrationTest => {
  it('petitioner chooses the case type', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    expect(integrationTest.getState('form.hasIrsNotice')).toEqual(true);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.cdp,
    });
    expect(integrationTest.getState('form.caseType')).toEqual(
      CASE_TYPES_MAP.cdp,
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });
    expect(integrationTest.getState('form.filingType')).toEqual('Myself');
  });
};
