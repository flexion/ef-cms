import { state } from '@web-client/presenter/app.cerebral';

export const getStep2DataAction = ({ get }: ActionProps) => {
  const {
    businessType,
    contactPrimary,
    contactSecondary,
    corporateDisclosureFile,
    corporateDisclosureFileSize,
    countryType,
    estateType,
    filingType,
    hasSpouseConsent,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
    useSameAsPrimary,
  } = get(state.form);

  const step2Data = {
    businessType,
    contactPrimary,
    contactSecondary: useSameAsPrimary
      ? { ...contactSecondary, ...contactPrimary }
      : contactSecondary,
    corporateDisclosureFile,
    corporateDisclosureFileSize,
    countryType,
    estateType,
    filingType,
    hasSpouseConsent,
    isSpouseDeceased,
    minorIncompetentType,
    otherType,
    partyType,
    petitionType,
    useSameAsPrimary,
  };

  return {
    step2Data,
  };
};
