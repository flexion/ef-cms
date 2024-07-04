import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type InternationalAddressProps = {
  onBlur: (props: { validationKey: string[] }) => void;
  registerRef?: (param: string) => void;
  type: string;
  onChange: (props: { key: string; value: any }) => void;
  addressInfo: {
    address1?: string;
    address2?: string;
    address3?: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
};

const internationalAddressDeps = {
  validationErrors: state.validationErrors,
};

export const InternationalAddress = connect<
  InternationalAddressProps,
  typeof internationalAddressDeps
>(
  internationalAddressDeps,
  function InternationalAddress({
    addressInfo,
    onBlur,
    onChange,
    registerRef,
    type,
    validationErrors,
  }) {
    return (
      <>
        <FormGroup
          errorMessageId="address-1-error-message"
          errorText={validationErrors?.[type]?.address1}
        >
          <label className="usa-label" htmlFor={`${type}.address1`}>
            Mailing address line 1
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address1`}
            id={`${type}.address1`}
            name={`${type}.address1`}
            ref={registerRef && registerRef(`${type}.address1`)}
            type="text"
            value={addressInfo.address1 || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'address1'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address2`}>
            Mailing address line 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address2`}
            id={`${type}.address2`}
            name={`${type}.address2`}
            type="text"
            value={addressInfo.address2 || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'address2'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>{' '}
        <div className="usa-form-group">
          <label className="usa-label" htmlFor={`${type}.address3`}>
            Mailing address line 3 <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.address3`}
            id={`${type}.address3`}
            name={`${type}.address3`}
            type="text"
            value={addressInfo.address3 || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'address3'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
        <FormGroup
          errorMessageId="state-error-message"
          errorText={validationErrors?.[type]?.state}
        >
          <label className="usa-label" htmlFor={`${type}.state`}>
            State/Province/Region <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.state`}
            id={`${type}.state`}
            name={`${type}.state`}
            ref={registerRef && registerRef(`${type}.state`)}
            type="text"
            value={addressInfo.state || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'state'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup
          errorMessageId="city-error-message"
          errorText={validationErrors?.[type]?.city}
        >
          <label className="usa-label" htmlFor={`${type}.city`}>
            City
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.city`}
            id={`${type}.city`}
            name={`${type}.city`}
            ref={registerRef && registerRef(`${type}.city`)}
            type="text"
            value={addressInfo.city || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'city'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup
          errorMessageId="postal-code-error-message"
          errorText={validationErrors?.[type]?.postalCode}
        >
          <label className="usa-label" htmlFor={`${type}.postalCode`}>
            Postal code
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid={`${type}.postalCode`}
            id={`${type}.postalCode`}
            name={`${type}.postalCode`}
            ref={registerRef && registerRef(`${type}.postalCode`)}
            type="text"
            value={addressInfo.postalCode || ''}
            onBlur={() => {
              onBlur({
                validationKey: [type, 'postalCode'],
              });
            }}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </>
    );
  },
);

InternationalAddress.displayName = 'InternationalAddress';
