import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { WorkingCopySessionList } from './WorkingCopySessionList';
import { connect, state } from '@cerebral/react';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    title: state.trialSessionWorkingCopyHelper.title,
  },
  ({ title }) => {
    return (
      <>
        <TrialSessionDetailHeader />
        <BigHeader text={title} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <WorkingCopySessionList />
        </section>
      </>
    );
  },
);
