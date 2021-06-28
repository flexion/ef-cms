import { getPetitionWorkItemForCase } from '../helpers';

export const petitionerAddNewCaseToTestObj = (
  integrationTest,
  createdCases,
) => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', async () => {
    const petitionerNewCase = integrationTest.getState('caseDetail');
    expect(petitionerNewCase).toBeDefined();

    const workitem = getPetitionWorkItemForCase(petitionerNewCase);

    expect(workitem).toBeDefined();
    createdCases.push(petitionerNewCase);
  });
};
