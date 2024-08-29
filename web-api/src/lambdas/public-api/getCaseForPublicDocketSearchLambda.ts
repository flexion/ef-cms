import { genericHandler } from '../../genericHandler';
import { getCaseForPublicDocketSearchInteractor } from '@web-api/business/useCases/public/getCaseForPublicDocketSearchInteractor';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseForPublicDocketSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCaseForPublicDocketSearchInteractor(applicationContext, {
      docketNumber: event.pathParameters.docketNumber,
    });
  });
