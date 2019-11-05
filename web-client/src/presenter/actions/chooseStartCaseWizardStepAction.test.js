import { chooseStartCaseWizardStepAction } from './chooseStartCaseWizardStepAction';
import { runAction } from 'cerebral/test';

describe.only('chooseStartCaseWizardStepAction', () => {
  it('should set state.wizardStep to the passed in props.value and sets state.form.wizardStep to the passed in step', async () => {
    const result = await runAction(chooseStartCaseWizardStepAction, {
      props: { step: '1', value: 'step1' },
      state: { form: {} },
    });

    expect(result.state.wizardStep).toEqual('step1');
    expect(result.state.form.wizardStep).toEqual('1');
  });
});
