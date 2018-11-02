import { connect } from '@cerebral/react';
import { sequences } from 'cerebral'
import React from 'react';

import SuccessNotification from './SuccessNotification';

export default connect(
  {
    gotoFilePetition: sequences.routeToFilePetition
  },
  function Home({ gotoFilePetition }) {
    return (
      <section className="usa-section usa-grid">
        <SuccessNotification />
        <p>
          <button type="button" className="usa-button"
            onClick={e => {
              e.preventDefault();
              gotoFilePetition();
            }}
          >
            Start a case
          </button>
        </p>
      </section>
    );
  },
);
