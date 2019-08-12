import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from './TrialSessionDetailHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    trialSessionHelper: state.trialSessionHelper,
  },
  ({ trialSessionHelper }) => {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {trialSessionHelper.title}
        </section>
      </>
    );
  },
);
