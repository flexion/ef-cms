import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * used for deleting a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteCaseNoteLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext.getUseCases().deleteCaseNoteInteractor(
        applicationContext,
        {
          ...event.pathParameters,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
