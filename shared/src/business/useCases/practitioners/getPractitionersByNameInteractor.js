const AWS = require('aws-sdk');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { get, isEmpty, uniqBy } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getPractitionersByNameInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersByNameInteractor = async ({
  applicationContext,
  name,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)
  ) {
    throw new UnauthorizedError('Unauthorized for searching practitioners');
  }

  if (!name) {
    throw new Error('Name must be provided to search');
  }

  const commonQuery = [
    {
      bool: {
        must: [{ match: { 'pk.S': 'user|' } }, { match: { 'sk.S': 'user|' } }],
      },
    },
    {
      bool: {
        should: [
          { match: { 'role.S': 'irsPractitioner' } },
          { match: { 'role.S': 'privatePractitioner' } },
        ],
      },
    },
  ];

  const exactMatchesQuery = [];
  const nonExactMatchesQuery = [];

  const nameArray = name.toLowerCase().split(' ');
  exactMatchesQuery.push({
    bool: {
      minimum_should_match: nameArray.length,
      should: nameArray.map(word => {
        return {
          term: {
            'name.S': word,
          },
        };
      }),
    },
  });

  nonExactMatchesQuery.push({
    bool: {
      must: [{ match: { 'name.S': name } }],
    },
  });

  const source = ['barNumber', 'contact', 'isAdmitted', 'name', 'userId']; //TODO isAdmitted should be admissionsStatus

  let foundUsers = [];

  const unmarshallHit = hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']);

  const exactMatchesBody = await applicationContext.getSearchClient().search({
    body: {
      _source: source,
      query: {
        bool: {
          must: [...commonQuery, ...exactMatchesQuery],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  });

  const exactMatchesHits = get(exactMatchesBody, 'hits.hits');

  if (!isEmpty(exactMatchesHits)) {
    exactMatchesHits.map(hit => foundUsers.push(unmarshallHit(hit)));
  }

  const nonExactMatchesBody = await applicationContext
    .getSearchClient()
    .search({
      body: {
        _source: source,
        query: {
          bool: {
            must: [...commonQuery, ...nonExactMatchesQuery],
          },
        },
        size: 5000,
      },
      index: 'efcms',
    });

  const nonExactMatchesHits = get(nonExactMatchesBody, 'hits.hits');

  if (!isEmpty(nonExactMatchesHits)) {
    nonExactMatchesHits.map(hit => foundUsers.push(unmarshallHit(hit)));
  }

  const uniqueFoundUsers = uniqBy(foundUsers, 'barNumber');

  return User.validateRawCollection(uniqueFoundUsers, { applicationContext });
};
