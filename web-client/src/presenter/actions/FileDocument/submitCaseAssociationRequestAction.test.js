import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';

const {
  submitCaseAssociationRequestInteractor,
} = applicationContext.getUseCases();
const {
  submitPendingCaseAssociationRequestInteractor,
} = applicationContext.getUseCases();

describe('submitCaseAssociationRequestAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext.getCurrentUser.mockReturnValue(
    new User({
      email: 'practitioner1@example.com',
      name: 'richard',
      role: User.ROLES.privatePractitioner,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    }),
  );

  it('should call submitCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Entry of Appearance',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestInteractor.mock.calls.length).toEqual(1);
  });

  it('should call submitPendingCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      submitPendingCaseAssociationRequestInteractor.mock.calls.length,
    ).toEqual(1);
  });
});
