// const DocketEntry = require('../../../../../shared/src/business/entities/DocketEntry');
// const {
//   COURT_ISSUED_EVENT_CODES,
// } = require('../../../../../shared/src/business/entities/EntityConstants');
// const applicationContext = require('../../../../src/applicationContext');

const isDocketEntryItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const migrateItems = items => {
  const itemsAfter = [];
  for (const item of items) {
    if (isDocketEntryItem(item)) {
      // const docketEntry = new DocketEntry({ item, applicationContext });
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
