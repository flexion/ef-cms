import { Get } from 'cerebral';
import { NonJudgeContact, RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export type FormattedIrsCalendarAdminInfo = {
  label: string;
  value: string;
  email?: string;
  name: string;
  phone?: string;
};

export type GetAllIrsPractitionersForSelectHelperResults = {
  irsPractitionersContactInfo: FormattedIrsCalendarAdminInfo[];
};

export const getAllIrsPractitionersForSelectHelper = (
  get: Get,
): GetAllIrsPractitionersForSelectHelperResults => {
  const irsPractitioners = get(state.irsPractitioners);
  const irsPractitionersContactInfo = irsPractitioners
    .filter(irsPrac => irsPrac['admissionsStatus'] === 'Active')
    .filter(irsPrac => irsPrac['practiceType'] === 'IRS')
    .map(irsPrac => getFormattedIrsPractitionerInfo(irsPrac));

  return {
    irsPractitionersContactInfo,
  };
};

function getFormattedIrsPractitionerInfo(
  irsPrac: RawUser,
): FormattedIrsCalendarAdminInfo {
  const addressLocation = [
    (irsPrac.contact as NonJudgeContact)?.address1,
    (irsPrac.contact as NonJudgeContact)?.address2,
  ]
    .filter(v => !!v)
    .join(', ');

  const addressState = [
    (irsPrac.contact as NonJudgeContact)?.city,
    (irsPrac.contact as NonJudgeContact)?.state,
  ]
    .filter(v => !!v)
    .join(', ');

  const contactInfo = [
    irsPrac.name,
    addressLocation,
    addressState || (irsPrac.contact as NonJudgeContact)?.postalCode
      ? `${addressState} ${(irsPrac.contact as NonJudgeContact)?.postalCode || ''}`
      : '',
  ].filter(v => !!v);

  const labelAndValue = contactInfo.join('; ');
  return {
    email: irsPrac.email,
    label: labelAndValue,
    name: irsPrac.name,
    phone: irsPrac.contact?.phone,
    value: labelAndValue,
  };
}
