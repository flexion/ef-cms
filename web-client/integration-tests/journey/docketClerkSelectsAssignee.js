export const docketClerkSelectsAssignee = integrationTest => {
  return it('Docket clerk select an assignee', async () => {
    expect(integrationTest.getState('assigneeId')).toBeUndefined();
    await integrationTest.runSequence('selectAssigneeSequence', {
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
    });
    expect(integrationTest.getState('assigneeId')).toBeDefined();
  });
};
