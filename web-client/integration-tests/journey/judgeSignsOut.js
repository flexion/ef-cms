import { applicationContext } from '../../src/applicationContext';

export default test => {
  return it('Judge signs out', async () => {
    await test.runSequence('signOutSequence');
    expect(test.getState('user')).toEqual(null);
    expect(applicationContext.getCurrentUser()).toEqual(null);
  });
};
