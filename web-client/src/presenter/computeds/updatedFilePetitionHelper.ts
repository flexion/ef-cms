import { ClientApplicationContext } from '@web-client/applicationContext';
import { FilingType, ROLES } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

interface IBusinessFields {
  primary: string;
  secondary: string;
  secondaryNote?: string;
}
interface IOtherContactNameLabel {
  additionalLabel?: string;
  additionalLabelNote?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  secondaryLabelNote?: string;
  showInCareOf?: boolean;
  showInCareOfOptional?: boolean;
  titleLabel?: string;
  titleLabelNote?: string;
}

type UpdatedFilePetitionHelper = {
  filingOptions: { label: string; value: string }[];
  isPetitioner: boolean;
  isPractitioner: boolean;
  businessFieldNames: IBusinessFields | {};
  otherContactNameLabel?: IOtherContactNameLabel;
  otherFilingOptions: string[];
  showContactInformationForOtherPartyType: boolean;
};

export const updatedFilePetitionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): UpdatedFilePetitionHelper => {
  const user = get(state.user);
  const { FILING_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  const businessType = get(state.form.businessType);
  const partyType = get(state.form.partyType);

  const filingOptions = formatFilingTypes(FILING_TYPES[user.role]);
  const businessFieldNames = getBusinessFieldLabels(businessType);
  const otherContactNameLabel = getOtherContactNameLabel(
    partyType,
    PARTY_TYPES,
  );

  const isPetitioner = user.role === ROLES.petitioner;
  const isPractitioner = user.role === ROLES.privatePractitioner;

  const otherFilingOptions = getOtherFilingOptions(isPractitioner);

  return {
    businessFieldNames,
    filingOptions,
    isPetitioner,
    isPractitioner,
    otherContactNameLabel,
    otherFilingOptions,
    showContactInformationForOtherPartyType:
      getShowContactInformationForOtherPartyType(partyType, PARTY_TYPES),
  };
};

function getOtherFilingOptions(isPractitioner) {
  const estateOrTrust = 'An estate or trust';
  const minorOrIncompetentPerson = 'A minor or legally incompetent person';
  const donor = 'Donor';
  const transferee = 'Transferee';
  const deceasedSpouse = 'Deceased Spouse';

  const otherFilingOptions = isPractitioner
    ? [estateOrTrust, donor, transferee, deceasedSpouse]
    : [
        estateOrTrust,
        minorOrIncompetentPerson,
        donor,
        transferee,
        deceasedSpouse,
      ];

  return otherFilingOptions;
}

function formatFilingTypes(filingOptions: FilingType[]) {
  return filingOptions.map(option => {
    if (option === 'Individual petitioner') {
      return {
        label: 'Petitioner',
        value: option,
      };
    }

    if (option === 'Petitioner and spouse') {
      return {
        label: 'Petitioner and petitioner spouse',
        value: option,
      };
    }

    return {
      label: option,
      value: option,
    };
  });
}

function getBusinessFieldLabels(businessType): IBusinessFields | {} {
  switch (businessType) {
    case 'Corporation':
      return {
        primary: 'Business name',
        showInCareOf: true,
        showInCareOfOptional: true,
      };
    case 'Partnership (as the Tax Matters Partner)':
      return {
        primary: 'Partnership name',
        secondary: 'Tax Matters Partner name',
      };
    case 'Partnership (as a partner other than Tax Matters Partner)':
      return {
        primary: 'Business name',
        secondary: 'Name of partner (other than TMP)',
      };
    case 'Partnership (as a partnership representative under BBA)':
      return {
        primary: 'Business name',
        secondary: 'Partnership representative name',
      };
    default:
      return {};
  }
}

function getOtherContactNameLabel(
  partyType,
  PARTY_TYPES,
): IOtherContactNameLabel {
  switch (partyType) {
    case PARTY_TYPES.survivingSpouse:
      return {
        primaryLabel: 'Full name of deceased spouse',
        secondaryLabel: 'Full name of surviving spouse',
      };
    case PARTY_TYPES.estate:
      return {
        primaryLabel: 'Full name of decedent',
        secondaryLabel: 'Full name of executor/personal representative, etc.',
        titleLabel: 'Title',
        titleLabelNote: 'For example: executor, PR, etc.',
      };
    case PARTY_TYPES.estateWithoutExecutor:
      return {
        primaryLabel: 'Full name of decedent',
        showInCareOf: true,
        showInCareOfOptional: true,
      };
    case PARTY_TYPES.trust:
      return {
        primaryLabel: 'Name of trust',
        secondaryLabel: 'Full name of trustee',
      };
    case PARTY_TYPES.conservator:
      return {
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of conservator',
      };
    case PARTY_TYPES.guardian:
      return {
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of guardian',
      };
    case PARTY_TYPES.custodian:
      return {
        primaryLabel: 'Full name of taxpayer',
        secondaryLabel: 'Full name of custodian',
      };
    case PARTY_TYPES.nextFriendForMinor:
      return {
        primaryLabel: 'Full name of minor',
        secondaryLabel: 'Full name of next friend',
      };
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      return {
        primaryLabel: 'Full name of legally incompetent person',
        secondaryLabel: 'Full name of next friend',
      };
    default:
      return {
        primaryLabel: 'Full name of petitioner',
      };
  }
}

function getShowContactInformationForOtherPartyType(
  partyType,
  PARTY_TYPES,
): boolean {
  return [
    PARTY_TYPES.donor,
    PARTY_TYPES.transferee,
    PARTY_TYPES.survivingSpouse,
    PARTY_TYPES.estate,
    PARTY_TYPES.estateWithoutExecutor,
    PARTY_TYPES.trust,
    PARTY_TYPES.conservator,
    PARTY_TYPES.guardian,
    PARTY_TYPES.custodian,
    PARTY_TYPES.nextFriendForMinor,
    PARTY_TYPES.nextFriendForIncompetentPerson,
  ].includes(partyType);
}
