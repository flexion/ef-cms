import { state } from 'cerebral';

/**
 * returns array of valid case types and descriptions based
 * on whether there is an IRS notice or not
 *
 * @param {*} get cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} array of case types with descriptions
 */
export const caseTypeDescriptionHelper = (get, applicationContext) => {
  const form = get(state.form);
  const { CASE_TYPES, CASE_TYPES_MAP } = applicationContext.getConstants();

  let caseTypesWithDescriptions = [];
  if (form.hasIrsNotice) {
    CASE_TYPES.forEach(caseType => {
      let caseDescription = '';
      switch (caseType) {
        case 'Deficiency':
          caseDescription = 'Notice of Deficiency';
          break;
        case CASE_TYPES_MAP.cdp:
          caseDescription =
            'Notice of Determination Concerning Collection Action';
          break;
        case 'Innocent Spouse':
          caseDescription =
            'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015';
          break;
        case 'Partnership (Section 6226)':
          caseDescription =
            'Readjustment of Partnership Items Code Section 6226';
          break;
        case 'Partnership (Section 6228)':
          caseDescription = 'Adjustment of Partnership Items Code Section 6228';
          break;
        case 'Partnership (BBA Section 1101)':
          caseDescription = 'Partnership Action Under BBA Section 1101';
          break;
        case 'Whistleblower':
          caseDescription =
            'Notice of Determination Under Section 7623 Concerning Whistleblower Action';
          break;
        case 'Worker Classification':
          caseDescription = 'Notice of Determination of Worker Classification';
          break;
        case 'Passport':
          caseDescription =
            'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State';
          break;
        case 'Interest Abatement':
          caseDescription =
            'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim';
          break;
        case 'Other':
          caseDescription = 'Other';
          break;
        default:
          break;
      }
      if (caseDescription !== '') {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  } else {
    CASE_TYPES.forEach(caseType => {
      let caseDescription = '';
      switch (caseType) {
        case CASE_TYPES_MAP.cdp:
          caseDescription = 'CDP (Lien/Levy)';
          break;
        case 'Innocent Spouse':
          caseDescription = 'Innocent Spouse';
          break;
        case 'Whistleblower':
          caseDescription = 'Whistleblower';
          break;
        case 'Worker Classification':
          caseDescription = 'Worker Classification';
          break;
        case 'Declaratory Judgment (Retirement Plan)':
          caseDescription = 'Declaratory Judgment (Retirement Plan)';
          break;
        case 'Declaratory Judgment (Exempt Organization)':
          caseDescription = 'Declaratory Judgment (Exempt Organization)';
          break;
        case 'Interest Abatement':
          caseDescription =
            'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement';
          break;
        case 'Other':
          caseDescription = 'Other';
          break;
        default:
          break;
      }
      if (caseDescription !== '') {
        caseTypesWithDescriptions.push({
          description: caseDescription,
          type: caseType,
        });
      }
    });
  }
  return { caseTypes: caseTypesWithDescriptions };
};
