const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const {
  updateAttorneyUserInteractor,
} = require('./updateAttorneyUserInteractor');
const { User } = require('../../entities/User');

const mockUser = {
  admissionsDate: '2019-03-01T21:40:46.415Z',
  birthYear: 2019,
  employer: 'Private',
  isAdmitted: true,
  name: 'Test Attorney',
  practitionerType: 'Attorney',
  role: User.ROLES.practitioner,
  userId: 'practitioner1@example.com',
};

describe('update attorney user', () => {
  let applicationContext;
  let testUser;

  beforeEach(() => {
    testUser = {
      role: 'petitionsclerk',
      userId: 'petitionsclerk',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => testUser,
      getPersistenceGateway: () => ({
        updateAttorneyUser: () => Promise.resolve(mockUser),
      }),
    };
  });

  it('updates the attorney user', async () => {
    const updatedUser = await updateAttorneyUserInteractor({
      applicationContext,
      user: mockUser,
    });
    expect(updatedUser).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updateAttorneyUserInteractor({
        applicationContext,
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
