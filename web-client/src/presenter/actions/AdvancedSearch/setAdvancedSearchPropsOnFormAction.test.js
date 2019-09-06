import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAdvancedSearchPropsOnFormAction } from './setAdvancedSearchPropsOnFormAction';

describe('setAdvancedSearchPropsOnFormAction', () => {
  it('sets valid advanced search fields passed in as props on state.form', async () => {
    const result = await runAction(setAdvancedSearchPropsOnFormAction, {
      modules: { presenter },
      props: {
        countryType: 'c',
        petitionerName: 'a',
        petitionerState: 'b',
        something: 'f',
        somethingElse: 'g',
        yearFiledMax: 'e',
      },
      state: { form: { anotherThing: 'h' } },
    });

    expect(result.state.form).toEqual({
      anotherThing: 'h',
      countryType: 'c',
      petitionerName: 'a',
      petitionerState: 'b',
      yearFiledMax: 'e',
    });
  });
});
