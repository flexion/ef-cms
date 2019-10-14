import { runAction } from 'cerebral/test';
import { updateEditDocketEntryWizardDataAction } from './updateEditDocketEntryWizardDataAction';

describe('updateEditDocketEntryWizardDataAction', () => {
  it('clear Certificate Of Service date items when certificateOfService is updated', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: [],
        },
        form: {
          certificateOfServiceDate: '12-12-1212',
          certificateOfServiceDay: 12,
          certificateOfServiceMonth: 12,
          certificateOfServiceYear: 12,
        },
      },
    });
    expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
    expect(result.state.form.certificateOfServiceDay).toEqual(undefined);
    expect(result.state.form.certificateOfServiceMonth).toEqual(undefined);
    expect(result.state.form.certificateOfServiceYear).toEqual(undefined);
  });

  it('unsets form state values when props.key=eventCode', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'eventCode',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form).toEqual({
      documentTitle: 'document title',
    });
  });

  it('unsets additionalInfo if empty', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo: '',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo).toEqual(undefined);
  });

  it('does not unset additionalInfo if not empty', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo',
        value: 'abc',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo: 'abc',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo).toEqual('abc');
  });

  it('unsets additionalInfo2 if empty', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo2',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo2: '',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo2).toEqual(undefined);
  });

  it('does not unset additionalInfo2 if not empty', async () => {
    const result = await runAction(updateEditDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo2',
        value: 'abc',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo2: 'abc',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo2).toEqual('abc');
  });
});
