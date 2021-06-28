export const judgeViewsDashboardMessages = (
  integrationTest,
  messageSubjects,
) => {
  return it('Judge views dashboard messages', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');
    expect(integrationTest.getState('currentPage')).toEqual('DashboardJudge');

    const messages = integrationTest.getState('messages');
    expect(messages.length).toBeGreaterThan(1);

    messageSubjects.forEach(subject => {
      expect(messages.find(m => m.subject === subject)).toBeDefined();
    });
  });
};
