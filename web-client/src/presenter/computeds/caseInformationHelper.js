import { state } from 'cerebral';

export const caseInformationHelper = get => {
  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);

  const showEditPrivatePractitionersButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.privatePractitioners &&
    !!caseDetail.privatePractitioners.length;
  const showEditIrsPractitionersButton =
    permissions.ASSOCIATE_USER_WITH_CASE &&
    caseDetail.irsPractitioners &&
    !!caseDetail.irsPractitioners.length;
  const showAddCounsel = permissions.ASSOCIATE_USER_WITH_CASE;
  const showSealCaseButton = permissions.SEAL_CASE && !caseDetail.isSealed;

  return {
    showAddCounsel,
    showEditPrivatePractitioners: showEditPrivatePractitionersButton,
    showEditIrsPractitioners: showEditIrsPractitionersButton,
    showSealCaseButton,
  };
};
