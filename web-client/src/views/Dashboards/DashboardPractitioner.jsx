import { BigHeader } from '../BigHeader';
import { CaseListPractitioner } from '../CaseListPractitioner';
import { ConfirmEmailModal } from '../ConfirmEmailModal';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardPractitioner = connect(
  {
    showModal: state.modal.showModal,
    user: state.user,
  },
  function DashboardPractitioner({ showModal, user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseListPractitioner />
        </section>
        {showModal === 'ConfirmEmailModal' && <ConfirmEmailModal />}
      </React.Fragment>
    );
  },
);
