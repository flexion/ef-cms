import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDocumentDetailTabAction } from './setDocumentDetailTabAction';

describe('setDocumentDetailTabAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the document detail tab', async () => {
    const result = await runAction(setDocumentDetailTabAction, {
      props: {
        tab: 'caseInfo',
      },
      state: {
        path: 'docketClerk',
      },
    });
    expect(result.state.currentViewMetadata.documentDetail.tab).toEqual(
      'caseInfo',
    );
  });
});
