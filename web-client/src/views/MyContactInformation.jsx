import { AddressDisplay } from './CaseDetail/PartyInformation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    constants: state.constants,
    user: state.user,
  },
  ({ constants, user }) => {
    return (
      <React.Fragment>
        <div className="case-search">
          <div className="card">
            <div className="content-wrapper gray">
              <h3>My Contact Information</h3>
              <hr />
              {AddressDisplay({ ...user, ...user.contact }, constants)}
              <p className="margin-bottom-0">
                <a
                  className="usa-button usa-button--unstyled"
                  href="/user/contact/edit"
                >
                  <FontAwesomeIcon className="margin-0" icon="edit" />
                  Edit
                </a>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
