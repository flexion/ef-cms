export const admissionsClerkVerifiesPractitionerServiceIndicator = (
  integrationTest,
  expectedServiceIndicator,
) => {
  return it('admissions clerk verifies practitioner service preference', async () => {
    await integrationTest.runSequence('gotoPractitionerDetailSequence', {
      barNumber: integrationTest.barNumber,
    });

    expect(
      integrationTest.getState('practitionerDetail').serviceIndicator,
    ).toEqual(expectedServiceIndicator);
  });
};
