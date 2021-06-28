export const petitionsClerkCancelsAddingDeficiencyStatisticToCase =
  integrationTest => {
    return it('Petitions clerk cancels adding deficiency statistic to case', async () => {
      await integrationTest.runSequence('gotoAddDeficiencyStatisticsSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('currentPage')).toEqual(
        'AddDeficiencyStatistics',
      );

      await integrationTest.runSequence('cancelAddStatisticSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      expect(
        integrationTest.getState(
          'currentViewMetadata.caseDetail.caseInformationTab',
        ),
      ).toEqual('statistics');
    });
  };
