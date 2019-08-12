import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {},
  () => {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <p>Trial Session Working Copy</p>
        </section>
      </>
    );
  },
);
