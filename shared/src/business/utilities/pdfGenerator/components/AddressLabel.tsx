import React from 'react';

export const AddressLabel = ({
  address1,
  address2,
  address3,
  city,
  country,
  countryType,
  inCareOf,
  name,
  postalCode,
  state,
  title,
}) => {
  return (
    <div className="address-label">
      <style type="text/css">
        {'@media print{@page {margin-bottom: 2cm}}'}
      </style>
      <div>{name}</div>
      {inCareOf && (
        <div>
          c/o {inCareOf}
          {title && <span>, {title}</span>}
        </div>
      )}
      <div>{address1}</div>
      {address2 && <div>{address2}</div>}
      {address3 && <div>{address3}</div>}
      <div>
        {city}, {state} {postalCode}
      </div>
      <div>{countryType === 'international' && country}</div>
    </div>
  );
};
