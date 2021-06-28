export const petitionsClerk1VerifiesCaseStatusOnMessage = (
  integrationTest,
  expectedCaseStatus,
) => {
  return it('Petitions Clerk1 verifies updated caseStatus on messages', async () => {
    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === integrationTest.docketNumber,
    );

    expect(foundMessage.caseStatus).toBe(expectedCaseStatus);
  });
};
