import { Container } from '@cerebral/react';
import {
  faFilePdf,
  faFlag,
  faCaretLeft,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import App from 'cerebral';
import mainModule from './main';
import React from 'react';
import ReactDOM from 'react-dom';

import { router, route } from './router';
import AppComponent from './components/App';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: (applicationContext, debugTools) => {
    library.add(faFilePdf, faFlag, faCaretLeft);
    mainModule.providers.applicationContext = applicationContext;
    mainModule.providers.router = {
      route,
    };
    const cerebralApp = App(mainModule, debugTools);
    router.initialize(cerebralApp);
    ReactDOM.render(
      <Container app={cerebralApp}>
        <AppComponent />
      </Container>,
      document.querySelector('#app'),
    );
  },
};

export default app;
