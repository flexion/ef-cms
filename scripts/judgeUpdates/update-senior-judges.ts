import { User } from '@shared/business/entities/User';
import { requireEnvVars } from '../../shared/admin-tools/util';
requireEnvVars([
  'DEFAULT_ACCOUNT_PASS',
  'ELASTICSEARCH_ENDPOINT',
  'ENV',
  'REGION',
]);
import { MAX_SEARCH_CLIENT_RESULTS } from '../../shared/src/business/entities/EntityConstants';
import { createApplicationContext } from '@web-api/applicationContext';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

async function searchForAllJudges(applicationContext) {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'role.S': {
                  value: 'judge',
                },
              },
            },
          },
        },
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-user',
    },
  });
  return results;
}

(async () => {
  const applicationContext = createApplicationContext({});
  const judgeUsers = await searchForAllJudges(applicationContext);

  const seniorJudgeNames = [
    'Cohen',
    'Colvin',
    'Gale',
    'Goeke',
    'Gustafson',
    'Halpern',
    'Holmes',
    'Lauber',
    'Marvel',
    'Morrison',
    'Paris',
    'Thornton',
    'Vasquez',
  ];
  const seniorJudges = judgeUsers.filter(judge => {
    return seniorJudgeNames.includes(judge.name);
  });

  for (let judge of seniorJudges) {
    const { userId } = judge;

    const userToUpdate = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });
    const userEntity = new User(userToUpdate);
    userEntity.judgeTitle = 'Senior Judge';

    console.log('userToUpdate', userToUpdate);
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
})();
