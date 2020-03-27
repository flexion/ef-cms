import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultServiceIndicatorAction } from './setDefaultServiceIndicatorAction';

describe('setDefaultServiceIndicatorAction', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.baseUrl from applicationContext', async () => {
    const { state } = await runAction(
      setDefaultServiceIndicatorAction('testKey'),
      {
        modules: {
          presenter,
        },
        state: {
          testKey: null, // the key that will be set
        },
      },
    );

    expect(state['testKey'].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
