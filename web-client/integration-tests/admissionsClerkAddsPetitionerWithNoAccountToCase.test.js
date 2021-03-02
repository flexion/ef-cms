import { DynamoDB } from 'aws-sdk';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  fakeFile,
  getUserRecordById,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { getCaseByDocketNumber } from '../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber';
import { getDocketNumbersByUser } from '../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser';
import { getUserById } from '../../shared/src/persistence/dynamo/users/getUserById';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { setUserEmailFromPendingEmailInteractor } from '../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor';
import { updateCase } from '../../shared/src/persistence/dynamo/cases/updateCase';
import { updateCaseAndAssociations } from '../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateUser } from '../../shared/src/persistence/dynamo/users/updateUser';

const test = setupTest();

const callCognitoTriggerForPendingEmail = async userId => {
  // mock application context similar to that in cognito-triggers.js
  const apiApplicationContext = {
    getCurrentUser: () => ({}),
    getDocumentClient: () => {
      return new DynamoDB.DocumentClient({
        endpoint: 'http://localhost:8000',
        region: 'us-east-1',
      });
    },
    getEnvironment: () => ({
      dynamoDbTableName: 'efcms-local',
      stage: process.env.STAGE,
    }),
    getPersistenceGateway: () => ({
      getCaseByDocketNumber,
      getDocketNumbersByUser,
      getUserById,
      updateCase,
      updateUser,
    }),
    getUseCaseHelpers: () => ({ updateCaseAndAssociations }),
    logger: {
      debug: () => {},
      error: () => {},
      info: () => {},
    },
  };

  const user = await getUserRecordById(userId);
  await setUserEmailFromPendingEmailInteractor({
    applicationContext: apiApplicationContext,
    user,
  });
};

describe('admissions clerk adds petitioner without existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email without existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');
    expect(test.getState('form.email')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('NoMatchingEmailFoundModal');
    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('caseDetail.contactPrimary.email')).toBeUndefined();
    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    test.userId = test.getState('caseDetail.contactPrimary.contactId');

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(test.userId);
  });

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('caseDetail.contactPrimary.email')).toEqual(
      EMAIL_TO_ADD,
    );
    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
