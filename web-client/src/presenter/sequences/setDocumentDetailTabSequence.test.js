import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

describe('setDocumentDetailTabSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    test = CerebralTest(presenter);
  });
  it('updates the document detail tab based on props', async () => {
    test.setState('documentDetail', {
      tab: 'docketRecord',
    });

    await test.runSequence('setDocumentDetailTabSequence', {
      tab: 'caseInfo',
    });
    expect(test.getState('currentViewMetadata.documentDetail')).toMatchObject({
      tab: 'caseInfo',
    });
  });
});
