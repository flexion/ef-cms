const AWS = require('aws-sdk');
const {
  formatDocketEntryResult,
} = require('./helpers/formatDocketEntryResult');
const { formatMessageResult } = require('./helpers/formatMessageResult');
const { formatWorkItemResult } = require('./helpers/formatWorkItemResult');
const { get } = require('lodash');

exports.search = async ({ applicationContext, searchParameters }) => {
  let body;
  try {
    body = await applicationContext.getSearchClient().search(searchParameters);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

  const total = get(body, 'hits.total.value', 0);

  let caseMap = {};
  const results = get(body, 'hits.hits', []).map(hit => {
    const sourceUnmarshalled = AWS.DynamoDB.Converter.unmarshall(
      hit['_source'],
    );
    sourceUnmarshalled['_score'] = hit['_score'];

    const isDocketEntryResultWithParentCaseMapping =
      hit['_index'] === 'efcms-docket-entry' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isMessageResultWithParentCaseMapping =
      hit['_index'] === 'efcms-message' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];
    const isWorkItemResultWithParentCaseMapping =
      hit['_index'] === 'efcms-work-item' &&
      hit.inner_hits &&
      hit.inner_hits['case-mappings'];

    if (isDocketEntryResultWithParentCaseMapping) {
      return formatDocketEntryResult({ caseMap, hit, sourceUnmarshalled });
    } else if (isMessageResultWithParentCaseMapping) {
      return formatMessageResult({ caseMap, hit, sourceUnmarshalled });
    } else if (isWorkItemResultWithParentCaseMapping) {
      // console.log('-----------------------------');
      // console.log(
      //   'formatted results',
      //   formatWorkItemResult({ caseMap, hit, sourceUnmarshalled }), // case relations is undefined
      // );
      // console.log('-----------------------------');
      return formatWorkItemResult({ caseMap, hit, sourceUnmarshalled });
    } else {
      return sourceUnmarshalled;
    }
  });

  // console.log('+++++++++++++++++++++++++++++++++++++++');
  // console.log('serachClient resutls', results); // case relations is undefined
  // console.log('+++++++++++++++++++++++++++++++++++++++');

  return {
    results,
    total,
  };
};
