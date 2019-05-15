import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const Email = connect(
  {
    email: state[props.bind].email,
  },
  ({ email }) => {
    return (
      <React.Fragment>
        <div className="usa-form-group">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-7 push-right">
              <Hint>To change your email, go to your Account Settings.</Hint>
            </div>
            <div className="mobile-lg:grid-col-5 email-input">
              <label htmlFor="email" className="usa-label">
                Email Address
              </label>
              {email}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
