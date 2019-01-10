export default test => {
  it('taxpayer sees the procedure types and case types', async () => {
    await test.runSequence('gotoFilePetitionSequence');
    const procedureTypes = test.getState('procedureTypes');
    expect(procedureTypes).not.toBeNull;
    expect(procedureTypes.length).toBeGreaterThan(0);
    expect(test.getState('caseTypes')).not.toBeNull;
    expect(test.getState('caseTypes').length).toBeGreaterThan(0);
  });
};
