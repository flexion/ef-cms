import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUserFromAuthHeader } from '@web-api/middleware/apiGatewayHelper';
import { onConnectInteractor } from '@web-api/business/useCases/notifications/onConnectInteractor';

/**
 * save the information about a new websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
// TODO 10417 This lambda was causing issues locally (and presumably also would deployed, given how it's a standalone lambda).
// Current approach solves it, but is this what we want to do?
export const connectLambda = event => {
  const authorizedUser: UnknownAuthUser = getUserFromAuthHeader(event);
  return genericHandler(
    event,
    async ({ applicationContext, clientConnectionId }) => {
      const endpoint = event.requestContext.domainName;

      await onConnectInteractor(
        applicationContext,
        {
          clientConnectionId,
          connectionId: event.requestContext.connectionId,
          endpoint,
        },
        authorizedUser,
      );

      applicationContext.logger.debug('Websocket connected', {
        requestId: {
          connection: event.requestContext.connectionId,
        },
      });
    },
    { bypassMaintenanceCheck: true },
  );
};
