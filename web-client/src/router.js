import { queryStringDecoder } from './queryStringDecoder';
import route from 'riot-route';

route.base('/');
const pageTitleSuffix = ' | U.S. Tax Court';

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    const checkLoggedIn = cb => {
      return function() {
        if (!app.getState('user')) {
          const path = app.getState('cognitoLoginUrl');
          window.location.replace(path);
        } else {
          cb.apply(null, arguments);
        }
      };
    };
    route(
      '/',
      checkLoggedIn(() => {
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      }),
    );
    route(
      '/case-detail/*',
      checkLoggedIn(docketNumber => {
        document.title = `Case details ${pageTitleSuffix}`;
        app.getSequence('gotoCaseDetailSequence')({ docketNumber });
      }),
    );
    route(
      '/case-detail/*/documents/*',
      checkLoggedIn((docketNumber, documentId) => {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
        });
      }),
    );
    route(
      '/case-detail/*/documents/*/messages/*',
      checkLoggedIn((docketNumber, documentId, messageId) => {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailMessageSequence')({
          docketNumber,
          documentId,
          messageId,
        });
      }),
    );
    route(
      '/case-detail/*/file-a-document',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        app.getSequence('gotoFileDocumentSequence')({ docketNumber });
      }),
    );
    route(
      '/case-detail/*/add-docket-entry',
      checkLoggedIn(docketNumber => {
        document.title = `Add docket entry ${pageTitleSuffix}`;
        app.getSequence('gotoAddDocketEntrySequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/request-access',
      checkLoggedIn(docketNumber => {
        document.title = `Request access ${pageTitleSuffix}`;
        app.getSequence('gotoRequestAccessSequence')({ docketNumber });
      }),
    );
    route(
      '/document-qc..',
      checkLoggedIn(() => {
        const path = route._.getPathFromBase();
        const validPaths = [
          'document-qc',
          'document-qc/my',
          'document-qc/my/inbox',
          'document-qc/my/outbox',
          'document-qc/my/batched',
          'document-qc/section',
          'document-qc/section/inbox',
          'document-qc/section/outbox',
          'document-qc/section/batched',
        ];

        if (path && validPaths.indexOf(path) === -1) {
          app.getSequence('notFoundErrorSequence')({
            error: {},
          });
        } else {
          const routeArgs = { workQueueIsInternal: false };
          const pathParts = path.split('/');

          if (pathParts[1]) {
            routeArgs.queue = pathParts[1];
          }
          if (pathParts[2]) {
            routeArgs.box = pathParts[2];
          }

          app.getSequence('gotoDashboardSequence')(routeArgs);
        }
        document.title = `Dashboard ${pageTitleSuffix}`;
      }),
    );
    route('/idle-logout', () => {
      app.getSequence('gotoIdleLogoutSequence')();
    });
    route('/log-in...', () => {
      const { token, code, path } = queryStringDecoder();
      if (code) {
        app.getSequence('loginWithCodeSequence')({ code, path });
      } else {
        app.getSequence('loginWithTokenSequence')({ path, token });
      }
    });
    route(
      '/before-starting-a-case',
      checkLoggedIn(() => {
        document.title = `Before you start a case ${pageTitleSuffix}`;
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );
    route(
      '/start-a-case',
      checkLoggedIn(() => {
        document.title = `Start a case ${pageTitleSuffix}`;
        app.getSequence('gotoStartCaseSequence')();
      }),
    );
    route('/style-guide', () => {
      document.title = `Style Guide ${pageTitleSuffix}`;
      app.getSequence('gotoStyleGuideSequence')();
    });
    route(
      '/messages',
      checkLoggedIn(() => {
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      }),
    );
    route(
      '/messages..',
      checkLoggedIn(() => {
        const path = route._.getPathFromBase();
        const validPaths = [
          'messages',
          'messages/my',
          'messages/my/inbox',
          'messages/my/outbox',
          'messages/my/batched',
          'messages/section',
          'messages/section/inbox',
          'messages/section/outbox',
          'messages/section/batched',
        ];

        if (path && validPaths.indexOf(path) === -1) {
          app.getSequence('notFoundErrorSequence')({
            error: {},
          });
        } else {
          const routeArgs = { workQueueIsInternal: true };
          const pathParts = path.split('/');

          if (pathParts[1]) {
            routeArgs.queue = pathParts[1];
          }
          if (pathParts[2]) {
            routeArgs.box = pathParts[2];
          }

          app.getSequence('gotoDashboardSequence')(routeArgs);
        }
        document.title = `Dashboard ${pageTitleSuffix}`;
      }),
    );

    route('/mock-login...', () => {
      const { token, path } = queryStringDecoder();
      if (token) {
        document.title = `Mock Login ${pageTitleSuffix}`;
        app.getSequence('submitLoginSequence')({ path, token });
        return;
      }

      if (process.env.COGNITO) {
        // USTC_ENV is undefined in prod
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      } else {
        document.title = `Mock Login ${pageTitleSuffix}`;
        app.getSequence('gotoLoginSequence')();
      }
    });
    route(
      '..',
      () => {
        document.title = `Error ${pageTitleSuffix}`;
        app.getSequence('notFoundErrorSequence')({
          error: {},
        });
      },
      true,
    );
    route.start(true);
  },
};

export { route, router };
