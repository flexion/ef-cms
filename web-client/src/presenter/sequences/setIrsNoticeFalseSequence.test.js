import { CerebralTest } from 'cerebral/test';
import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setIrsNoticeFalseSequence', () => {
  // hasIrsNotice is the original value submitted from the taxpayer, hasVerifiedIrsNotice is a different field used by the petitionsclerk
  it('when hasVerifiedIrsNotice is not defined, it should set the hasVerifiedIrsNotice to false, clear the form year properties, and clear the yearAmounts on the caseDetail, and not modify the original hasIrsNotice', async () => {
    test.setState('form', {
      irsDay: '10',
      irsMonth: '01',
      irsYear: '2019',
    });
    test.setState('caseDetail', {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: undefined,
      yearAmounts: [
        {
          amount: 100.0,
          year: '2000',
        },
      ],
    });

    await test.runSequence('setIrsNoticeFalseSequence');
    expect(test.getState('form')).toMatchObject({
      irsDay: '',
      irsMonth: '',
      irsYear: '',
    });
    expect(test.getState('caseDetail')).toMatchObject({
      hasIrsNotice: true,
      hasVerifiedIrsNotice: false,
      yearAmounts: [],
    });
  });
});
