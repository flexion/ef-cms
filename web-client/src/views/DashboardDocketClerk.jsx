import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { WorkQueue } from './WorkQueue';
import React from 'react';

export const DashboardDocketClerk = () => (
  <section className="usa-section grid-container">
    <SuccessNotification />
    <ErrorNotification />
    <WorkQueue />
  </section>
);
