export default (test, createdCases) => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', async () => {
    const petitionerNewCase = test.getState('caseDetail');
    expect(petitionerNewCase).toBeDefined();
    expect(petitionerNewCase.documents[0].workItems[0]).toBeDefined();
    createdCases.push(petitionerNewCase);
  });
};
