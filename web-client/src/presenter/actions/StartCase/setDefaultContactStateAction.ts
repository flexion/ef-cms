import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { showContactsHelperUpdated } from '@web-client/presenter/computeds/showContactsHelperUpdated';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultContactStateAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const partyType = get(state.form.partyType);

  const { showContactSecondary } = showContactsHelperUpdated(
    partyType,
    PARTY_TYPES,
    props,
  );

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const defaultContact = { countryType: COUNTRY_TYPES.DOMESTIC };

  const TYPES = [
    'filingType',
    'businessType',
    'otherType',
    'estateType',
    'minorIncompetentType',
  ];

  if (TYPES.includes(props.key)) {
    // toggling filing types
    store.set(state.form.contactPrimary, defaultContact);
    store.unset(state.form.contactSecondary);
    store.unset(state.form.useSameAsPrimary);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.hasSpouseConsent);
    return;
  }

  if (showContactSecondary) {
    store.set(state.form.contactSecondary, {});
    store.set(state.form.useSameAsPrimary, true);
    store.set(state.form.hasSpouseConsent, false);
  } else {
    store.set(state.form.contactSecondary, {});
    store.set(state.form.hasSpouseConsent, false);
    store.set(state.form.useSameAsPrimary, false);
  }
};