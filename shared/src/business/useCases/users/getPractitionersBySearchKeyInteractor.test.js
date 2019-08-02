const {
  getPractitionersBySearchKeyInteractor,
} = require('./getPractitionersBySearchKeyInteractor');

describe('getPractitionersBySearchKeyInteractor', () => {
  let applicationContext;

  it('should throw an error when not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: 'petitioner',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getUsersBySearchKey: async () => [],
        }),
      };
      await getPractitionersBySearchKeyInteractor({
        applicationContext,
        searchKey: 'something',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should return users from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: 'petitionsclerk',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        getUsersBySearchKey: async () => [{ name: 'Test Practitioner' }],
      }),
    };

    const result = await getPractitionersBySearchKeyInteractor({
      applicationContext,
      searchKey: 'Test Practitioner',
    });

    expect(result).toEqual([{ name: 'Test Practitioner' }]);
  });
});
