const { UnauthorizedError } = require('../../errors/errors');
const {
  BLOCK_CASE,
  isAuthorized,
} = require('../../authorization/authorizationClientService');
const AWS = require('aws-sdk');
const { get } = require('lodash');

/**
 * getBlockedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
exports.getBlockedCasesInteractor = async ({
  applicationContext,
  trialLocation,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const body = await applicationContext.getSearchClient().search({
    body: {
      query: {
        bool: {
          must: [
            { match: { 'blocked.BOOL': true } },
            { match: { 'preferredTrialCity.S': trialLocation } },
          ],
        },
      },
    },
    index: 'efcms',
  });

  const foundCases = [];
  const hits = get(body, 'hits.hits');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  return foundCases;
};
