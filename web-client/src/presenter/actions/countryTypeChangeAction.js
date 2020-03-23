import { state } from 'cerebral';

/**
 * used to clear contact fields when the countryType changes
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @param {object} providers.store the cerebral store
 */
export const countryTypeChangeAction = ({ props, store }) => {
  const { contactType } = props;
  [
    'address1',
    'address2',
    'address3',
    'country',
    'postalCode',
    'phone',
    'state',
    'city',
  ].forEach(field => {
    store.unset(state.form[contactType][field]);
  });

  store.set(state.validationErrors[contactType], {});
};
