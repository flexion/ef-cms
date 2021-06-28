export const petitionsClerkEditsSavedPetition = integrationTest => {
  return it('Petitions Clerk edits saved petition', async () => {
    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
      tab: 'IrsNotice',
    });

    expect(integrationTest.getState('currentPage')).toEqual('PetitionQc');
  });
};
