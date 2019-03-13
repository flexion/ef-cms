import { CerebralTest } from 'cerebral/test';

import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('updateCaseValueByIndexSequence', async () => {
  it('updates the expected key and index inside the caseDetail', async () => {
    test.setState('caseDetail', {
      yearAmounts: [
        {
          year: '2000',
        },
      ],
    });
    await test.runSequence('updateCaseValueByIndexSequence', {
      index: 0,
      key: 'yearAmounts',
      subKey: 'year',
      value: '1999',
    });
    expect(test.getState('caseDetail')).toEqual({
      yearAmounts: [
        {
          year: '1999',
        },
      ],
    });
  });
});
