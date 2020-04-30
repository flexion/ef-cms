import { state } from 'cerebral';

export const publicCaseDetailHeaderHelper = get => {
  const caseDetail = get(state.caseDetail);

  return {
    caseCaption: caseDetail.caseCaption || '',
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: `${caseDetail.docketNumber}${
      caseDetail.docketNumberSuffix || ''
    }`,
    isCaseSealed: !!caseDetail.isSealed,
  };
};
