export default (test, createdCases) => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', async () => {
    await test.runSequence('gotoDashboardSequence');
    const petitionerNewCase = test.getState('cases.0');
    expect(petitionerNewCase).toBeDefined();
    expect(petitionerNewCase.documents).toBeDefined();
    expect(expect(petitionerNewCase.documents[0])).toBeDefined();
    expect(expect(petitionerNewCase.documents[0].workItems)).toBeDefined();
    expect(petitionerNewCase).toEqual('a');
    expect(petitionerNewCase.documents[0].workItems[0]).toBeDefined();
    createdCases.push(petitionerNewCase);
  });
};
