import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  caseServicesSupervisorUser,
  judgeColvin,
  legacyJudgeUser,
  petitionsClerkUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { createOrUpdateUser, createUserRecords } from './createOrUpdateUser';

describe('createOrUpdateUser', () => {
  const mockTemporaryPassword = 'tempPass';

  it('should ONLY create a user when they do not already exist in the system', async () => {
    applicationContext
      .getUserGateway()
      .isEmailAvailable.mockResolvedValue(true);

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: false,
      password: mockTemporaryPassword,
      user: petitionsClerkUser,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      expect.anything(),
      {
        email: petitionsClerkUser.email,
        name: petitionsClerkUser.name,
        password: mockTemporaryPassword,
        role: petitionsClerkUser.role,
      },
    );
    expect(
      applicationContext.getCognito().adminDisableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should create and disable the user when the email is available and the disable flag is true', async () => {
    applicationContext
      .getUserGateway()
      .isEmailAvailable.mockResolvedValue(true);
    applicationContext
      .getUserGateway()
      .createUser.mockResolvedValue(petitionsClerkUser.userId);

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: true,
      password: mockTemporaryPassword,
      user: petitionsClerkUser,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalled();
    expect(applicationContext.getUserGateway().disableUser).toHaveBeenCalled();
  });

  it('should update the user when the user already exists in the system', async () => {
    applicationContext
      .getUserGateway()
      .isEmailAvailable.mockResolvedValue(false);

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: false,
      password: mockTemporaryPassword,
      user: petitionsClerkUser,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalledWith(
      expect.anything(),
      {
        email: petitionsClerkUser.email,
        role: petitionsClerkUser.role,
      },
    );
  });

  describe('createUserRecords', () => {
    const mockPrivatePractitionerUser = {
      ...privatePractitionerUser,
      barNumber: 'pt1234', //intentionally lower case - should be converted to upper case when persisted
    };

    it('should persist a private practitioner user with name and barNumber mapping records', async () => {
      await createUserRecords({
        applicationContext,
        user: mockPrivatePractitionerUser,
        userId: mockPrivatePractitionerUser.userId,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...mockPrivatePractitionerUser,
          pk: `user|${mockPrivatePractitionerUser.userId}`,
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PRIVATE PRACTITIONER',
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
    });

    it('should persist a petitions clerk user with a section mapping record', async () => {
      await createUserRecords({
        applicationContext,
        user: petitionsClerkUser,
        userId: petitionsClerkUser.userId,
      });

      expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(
        2,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: 'section|petitions',
          sk: `user|${petitionsClerkUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          ...petitionsClerkUser,
          pk: `user|${petitionsClerkUser.userId}`,
          sk: `user|${petitionsClerkUser.userId}`,
        },
      });
    });

    it('should persist a judge user with a section mapping record for the chambers and the judge', async () => {
      await createUserRecords({
        applicationContext,
        user: judgeColvin,
        userId: judgeColvin.userId,
      });

      expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(
        3,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `section|${judgeColvin.section}`,
          sk: `user|${judgeColvin.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${judgeColvin.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          ...judgeColvin,
          pk: `user|${judgeColvin.userId}`,
          sk: `user|${judgeColvin.userId}`,
        },
      });
    });

    it('should persist a legacy judge user with a section mapping record for the chambers and the judge', async () => {
      await createUserRecords({
        applicationContext,
        user: legacyJudgeUser,
        userId: legacyJudgeUser.userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        3,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `section|${legacyJudgeUser.section}`,
          sk: `user|${legacyJudgeUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${legacyJudgeUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          ...legacyJudgeUser,
          pk: `user|${legacyJudgeUser.userId}`,
          sk: `user|${legacyJudgeUser.userId}`,
        },
      });
    });

    it('should NOT persist mapping records for practitioner that does not have a barNumber', async () => {
      const privatePractitionerUserWithoutBarNumber = {
        ...privatePractitionerUser,
        barNumber: undefined,
      };

      await createUserRecords({
        applicationContext,
        user: privatePractitionerUserWithoutBarNumber,
        userId: privatePractitionerUserWithoutBarNumber.userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        1,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...privatePractitionerUserWithoutBarNumber,
          pk: `user|${privatePractitionerUserWithoutBarNumber.userId}`,
          sk: `user|${privatePractitionerUserWithoutBarNumber.userId}`,
        },
      });
    });

    it('should persist a private practitioner user with name and barNumber mapping records', async () => {
      await createUserRecords({
        applicationContext,
        user: mockPrivatePractitionerUser,
        userId: mockPrivatePractitionerUser.userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        3,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...mockPrivatePractitionerUser,
          pk: `user|${mockPrivatePractitionerUser.userId}`,
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PRIVATE PRACTITIONER',
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${mockPrivatePractitionerUser.userId}`,
        },
      });
    });

    it('should persist a case services supervisor user with 3 section user mapping records (docket, petitions, and case services)', async () => {
      await createUserRecords({
        applicationContext,
        user: caseServicesSupervisorUser,
        userId: caseServicesSupervisorUser.userId,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `section|${caseServicesSupervisorUser.section}`,
          sk: `user|${caseServicesSupervisorUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|docket',
          sk: `user|${caseServicesSupervisorUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'section|petitions',
          sk: `user|${caseServicesSupervisorUser.userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[3][0],
      ).toMatchObject({
        Item: {
          pk: `user|${caseServicesSupervisorUser.userId}`,
          sk: `user|${caseServicesSupervisorUser.userId}`,
        },
      });
    });

    it('should NOT persist section mapping record when the user does not have a section', async () => {
      await createUserRecords({
        applicationContext,
        user: {
          ...petitionsClerkUser,
          section: undefined,
        },
        userId: petitionsClerkUser.userId,
      });

      expect(applicationContext.getDocumentClient().put).toHaveBeenCalledTimes(
        1,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...petitionsClerkUser,
          pk: `user|${petitionsClerkUser.userId}`,
          section: undefined,
          sk: `user|${petitionsClerkUser.userId}`,
        },
      });
    });
  });
});
