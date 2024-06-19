import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { blockCaseFromTrialInteractor } from '@shared/business/useCases/blockCaseFromTrialInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for blocking a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const blockCaseFromTrialLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const lambdaArguments = {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      };

      return await blockCaseFromTrialInteractor(
        applicationContext,
        {
          ...lambdaArguments,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
