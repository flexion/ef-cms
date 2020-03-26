import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateStartCaseWizardAction } from './validateStartCaseWizardAction';

describe('validateStartCaseWizardAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue(null);
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue({ some: 'error' });
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
