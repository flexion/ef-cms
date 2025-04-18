import { NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP } from '../../business/entities/EntityConstants';
import { union } from 'lodash';

/**
 * creates a lookup of changed contact fields
 *
 * @param {object} providers the providers object
 * @param {object} providers.newData updated contact information
 * @param {object} providers.oldData the old contact information
 * @returns {object} diff object with old and new values for each changed field
 */
export const getAddressPhoneDiff = <T extends object, U extends object>({
  newData,
  oldData,
}: {
  newData: T;
  oldData: U;
}): Record<keyof T | keyof U, any> => {
  const diff = {} as Record<keyof T | keyof U, any>;

  const fields: (keyof T | keyof U)[] = union<keyof T | keyof U>(
    Object.keys(newData) as Array<keyof T>,
    Object.keys(oldData) as Array<keyof U>,
  );

  fields.forEach(key => {
    const newValue = (newData as any)[key];
    const oldValue = (oldData as any)[key];
    if (oldValue !== newValue) {
      diff[key] = {
        newData: newValue,
        oldData: oldValue,
      };
    }
  });

  return diff;
};

/**
 * returns the appropriate documentType given the old and new contact data
 *
 * @param {object} providers the providers object
 * @param {object} providers.diff the initial diff
 * @param {object} providers.newData updated contact information
 * @param {object} providers.oldData the old contact information
 * @returns {string} documentType for the address / phone change scenario
 */
export const getDocumentTypeForAddressChange = <
  T extends object,
  U extends object,
>({
  diff,
  newData,
  oldData,
}: {
  diff?: Record<keyof T | keyof U, any>;
  newData: T;
  oldData: U;
}):
  | {
      documentType: string;
      eventCode: string;
      title: string;
    }
  | undefined => {
  const initialDiff = diff || getAddressPhoneDiff({ newData, oldData });
  const addressFields = [
    'country',
    'countryType',
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'postalCode',
  ];

  const isAddressChange: boolean = Object.keys(initialDiff).some(field =>
    addressFields.includes(field),
  );
  const isPhoneChange: boolean = !!initialDiff['phone'];
  const isEmailChange: boolean =
    newData['email'] && newData['email'] !== oldData['email'];

  if (isEmailChange) {
    return NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NOCE',
    );
  } else if (isAddressChange && !isPhoneChange) {
    return NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCA',
    );
  } else if (isPhoneChange && !isAddressChange) {
    return NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCP',
    );
  } else if (isAddressChange && isPhoneChange) {
    return NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
      e => e.eventCode === 'NCAP',
    );
  }

  return;
};
