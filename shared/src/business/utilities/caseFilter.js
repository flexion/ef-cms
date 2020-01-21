const { isAssociatedUser } = require('../entities/cases/Case');
const CASE_ATTRIBUTE_WHITELIST = ['caseId', 'docketNumber', 'sealedDate'];

const caseSealedFormatter = caseRaw => {
  const sealedObj = {};
  CASE_ATTRIBUTE_WHITELIST.forEach(attr => {
    sealedObj[attr] = caseRaw[attr];
  });
  return sealedObj;
};

const caseSearchFilter = (cases, userId) => {
  const results = [];
  for (const caseRaw of cases) {
    if (!caseRaw.sealedDate || isAssociatedUser({ caseRaw, userId })) {
      results.push(caseRaw);
    }
  }
  return results;
};

module.exports = {
  caseSealedFormatter,
  caseSearchFilter,
};
