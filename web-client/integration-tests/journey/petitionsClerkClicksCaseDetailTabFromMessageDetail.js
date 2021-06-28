export const petitionsClerkClicksCaseDetailTabFromMessageDetail =
  integrationTest => {
    return it('petitions clerk clicks case detail tab from message detail', async () => {
      expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

      // simulate click on the case detail primary tab
      integrationTest.setState(
        'currentViewMetadata.caseDetail.primaryTab',
        'drafts',
      );
      await integrationTest.runSequence('caseDetailPrimaryTabChangeSequence');

      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      expect(
        integrationTest.getState(
          'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
        ),
      ).toBeTruthy();
    });
  };
