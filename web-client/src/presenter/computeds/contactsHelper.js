import { state } from 'cerebral';

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const contactsHelper = get => {
  const form = get(state.form);
  const userRole = get(state.user.role);
  const { PARTY_TYPES } = get(state.constants);

  let contactPrimary, contactSecondary;
  let showEmail = true;
  if (userRole === 'petitioner') {
    switch (form.partyType) {
      case PARTY_TYPES.conservator:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Conservator for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Business Name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          header: 'Tell Us About Yourself as the Custodian for This Taxpayer',
          nameLabel: 'Name of Custodian',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Taxpayer You Are Filing For',
          nameLabel: 'Name of Taxpayer',
        };
        break;
      case PARTY_TYPES.donor:
        contactPrimary = {
          header: 'Tell Us About the Donor You Are Filing For',
          nameLabel: 'Name of Petitioner',
        };
        break;
      case PARTY_TYPES.estate:
        contactPrimary = {
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About Yourself as the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of Decedent',
          secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In Care Of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Name of Decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          header: 'Tell Us About Yourself as the Guardian for This Taxpayer',
          nameLabel: 'Name of Guardian',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Taxpayer You Are Filing For',
          nameLabel: 'Name of Taxpayer',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          header:
            'Tell Us About Yourself as the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of Next Friend',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header:
            'Tell Us About the Legally Incompetent Person You Are Filing For',
          nameLabel: 'Name of Legally Incompetent Person',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          header: 'Tell Us About Yourself as the Next Friend for This Minor',
          nameLabel: 'Name of Next Friend',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Minor You Are Filing For',
          nameLabel: 'Name of Minor',
        };
        break;
      case PARTY_TYPES.partnershipBBA:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Partnership Representative',
          nameLabel: 'Business Name',
          secondaryNameLabel: 'Partnership Representative Name',
        };
        break;
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        contactPrimary = {
          displaySecondaryName: true,
          header:
            'Tell Us About Yourself as the Partner (Other than Tax Matters Partner)',
          nameLabel: 'Business Name',
          secondaryNameLabel: 'Name of Partner (Other than TMP)',
        };
        break;
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Tax Matters Partner',
          nameLabel: 'Partnership Name',
          secondaryNameLabel: 'Tax Matters Partner Name',
        };
        break;
      case PARTY_TYPES.petitioner:
        contactPrimary = {
          header: 'Tell Us About Yourself',
          nameLabel: 'Name',
        };
        break;
      case PARTY_TYPES.petitionerSpouse:
        contactPrimary = {
          displayPhone: true,
          header: 'Tell Us About Yourself',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayPhone: true,
          header: 'Tell Us About Your Spouse',
          nameLabel: "Spouse's Name",
        };
        break;
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimary = {
          header: 'Tell Us About Yourself',
          nameLabel: 'Name of Petitioner/Surviving Spouse',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About Your Deceased Spouse',
          inCareOfLabel: 'In Care Of',
          nameLabel: 'Name of Deceased Spouse',
        };
        break;
      case PARTY_TYPES.survivingSpouse:
        contactPrimary = {
          header: 'Tell Us About Yourself as the Surviving Spouse',
          nameLabel: 'Name',
        };
        contactSecondary = {
          header: 'Tell Us About Your Deceased Spouse',
          nameLabel: "Spouse's Name",
        };
        break;
      case PARTY_TYPES.transferee:
        contactPrimary = {
          header: 'Tell Us About the Transferee You Are Filing For',
          nameLabel: 'Name of Petitioner',
        };
        break;
      case PARTY_TYPES.trust:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About Yourself as the Trustee',
          nameLabel: 'Name of Trust',
          secondaryNameLabel: 'Name of Trustee',
        };
        break;
    }
  } else {
    showEmail = false;

    switch (form.partyType) {
      case PARTY_TYPES.conservator:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Conservator for This Taxpayer',
          nameLabel: 'Name of Taxpayer',
          secondaryNameLabel: 'Name of Conservator',
        };
        break;
      case PARTY_TYPES.corporation:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Corporation You Are Filing For',
          inCareOfLabel: 'In Care Of',
          nameLabel: 'Business Name',
        };
        break;
      case PARTY_TYPES.custodian:
        contactPrimary = {
          header: 'Tell Us About the Custodian for This Taxpayer',
          nameLabel: 'Name of Custodian',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Taxpayer You Are Filing For',
          nameLabel: 'Name of Taxpayer',
        };
        break;
      case PARTY_TYPES.donor:
        contactPrimary = {
          header: 'Tell Us About the Donor You Are Filing For',
          nameLabel: 'Name of Petitioner',
        };
        break;
      case PARTY_TYPES.estate:
        contactPrimary = {
          displaySecondaryName: true,
          displayTitle: true,
          header:
            'Tell Us About the Executor/Personal Representative/etc. For This Estate',
          nameLabel: 'Name of Decedent',
          secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
        };
        break;
      case PARTY_TYPES.estateWithoutExecutor:
        contactPrimary = {
          displayInCareOf: true,
          header: 'Tell Us About the Estate You Are Filing For',
          inCareOfLabel: 'In Care Of',
          nameLabel: 'Name of Decedent',
        };
        break;
      case PARTY_TYPES.guardian:
        contactPrimary = {
          header: 'Tell Us About the Guardian for This Taxpayer',
          nameLabel: 'Name of Guardian',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Taxpayer You Are Filing For',
          nameLabel: 'Name of Taxpayer',
        };
        break;
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        contactPrimary = {
          header:
            'Tell Us About the Next Friend for This Legally Incompetent Person',
          nameLabel: 'Name of Next Friend',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header:
            'Tell Us About the Legally Incompetent Person You Are Filing For',
          nameLabel: 'Name of Legally Incompetent Person',
        };
        break;
      case PARTY_TYPES.nextFriendForMinor:
        contactPrimary = {
          header: 'Tell Us About the Next Friend for This Minor',
          nameLabel: 'Name of Next Friend',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Minor You Are Filing For',
          nameLabel: 'Name of Minor',
        };
        break;
      case PARTY_TYPES.partnershipBBA:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Partnership Representative',
          nameLabel: 'Business Name',
          secondaryNameLabel: 'Name of Partnership Representative',
        };
        break;
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Partner (Other than Tax Matters Partner)',
          nameLabel: 'Business Name',
          secondaryNameLabel: 'Name of Partner (Other than TMP)',
        };
        break;
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Tax Matters Partner',
          nameLabel: 'Name of Partnership',
          secondaryNameLabel: 'Name of Tax Matters Partner',
        };
        break;
      case PARTY_TYPES.petitioner:
        contactPrimary = {
          header: 'Tell Us About the Petitioner',
          nameLabel: 'Name',
        };
        break;
      case PARTY_TYPES.petitionerSpouse:
        contactPrimary = {
          displayPhone: true,
          header: 'Tell Us About the First Petitioner',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayPhone: true,
          header: 'Tell Us About the Second Petitioner',
          nameLabel: 'Name',
        };
        break;
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimary = {
          header: 'Tell Us About the Petitioner',
          nameLabel: 'Name',
        };
        contactSecondary = {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Tell Us About the Deceased Petitioner',
          inCareOfLabel: 'In Care Of',
          nameLabel: 'Deceased Petitioner Name',
        };
        break;
      case PARTY_TYPES.survivingSpouse:
        contactPrimary = {
          header: 'Tell Us About the Surviving Spouse',
          nameLabel: 'Name',
        };
        contactSecondary = {
          header: 'Tell Us About the Deceased Spouse',
          nameLabel: "Spouse's Name",
        };
        break;
      case PARTY_TYPES.transferee:
        contactPrimary = {
          header: 'Tell Us About the Transferee You Are Filing For',
          nameLabel: 'Name of Petitioner',
        };
        break;
      case PARTY_TYPES.trust:
        contactPrimary = {
          displaySecondaryName: true,
          header: 'Tell Us About the Trustee',
          nameLabel: 'Name of Trust',
          secondaryNameLabel: 'Name of Trustee',
        };
        break;
    }
  }

  return {
    contactPrimary,
    contactSecondary,
    showEmail,
  };
};
