import { state } from 'cerebral';

/**
 * get the pending email status only for petitioners on a case
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.get the cerebral get
 * @returns {object} an object containing pending emails with their associated contactId
 */
export const getPetitionersPendingEmailStatusOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { petitioners } = get(state.caseDetail);

  for (let petitioner of petitioners) {
    const pendingEmail = await applicationContext
      .getUseCases()
      .getUserPendingEmailStatusInteractor({
        applicationContext,
        userId: petitioner.contactId,
      });

    pendingEmails[petitioner.contactId] = pendingEmail;
  }

  return { pendingEmails };
};
