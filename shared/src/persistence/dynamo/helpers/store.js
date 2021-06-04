const client = require('../../dynamodbClientService');
/**
 * store
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @param {string} providers.year the year of the item to increment, formatted as YYYY
 * @returns {Promise} the promise of the call to persistence
 */
exports.incrementKeyCount = ({ applicationContext, key }) =>
  client.updateConsistent({
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':value': 1,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'ADD #id :value',
    applicationContext,
  });

exports.decrementKeyCount = ({ applicationContext, key }) =>
  client.updateConsistent({
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':value': -1,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'ADD #id :value',
    applicationContext,
  });

exports.deleteKeyCount = ({ applicationContext, key }) =>
  client.delete({ applicationContext, key });
