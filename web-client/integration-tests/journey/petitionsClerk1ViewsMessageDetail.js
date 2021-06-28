export const petitionsClerk1ViewsMessageDetail = integrationTest => {
  return it('petitions clerk 1 views the message detail for the message they received', async () => {
    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
    });

    expect(integrationTest.getState('messageDetail')).toMatchObject([
      {
        parentMessageId: integrationTest.parentMessageId,
      },
    ]);
  });
};
