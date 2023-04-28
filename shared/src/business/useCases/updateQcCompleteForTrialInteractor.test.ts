import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ROLES } from '../entities/EntityConstants';
import { ServiceUnavailableError } from '../../errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { updateQcCompleteForTrialInteractor } from './updateQcCompleteForTrialInteractor';

describe('updateQcCompleteForTrialInteractor', () => {
  let user;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) =>
        Promise.resolve(caseToUpdate),
      );
  });

  it('should throw an error if the user is unauthorized to update a trial session', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updateQcCompleteForTrialInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow('Unauthorized for trial session QC complete');
  });

  it('should call updateCase with the updated qcCompleteForTrial value and return the updated case', async () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    };

    const result = await updateQcCompleteForTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      },
    );
    expect(result.qcCompleteForTrial).toEqual({
      '10aa100f-0330-442b-8423-b01690c76e3f': true,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(MOCK_LOCK);

    await expect(
      updateQcCompleteForTrialInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);

    await updateQcCompleteForTrialInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      qcCompleteForTrial: true,
      trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
    });
  });
});
