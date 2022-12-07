const createApplicationContext = require('../../../../src/applicationContext');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const applicationContext = createApplicationContext({});

const isDocketEntryItem = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
};

const migrateItems = items => {
  const itemsAfter = [];
  for (const item of items) {
    if (isDocketEntryItem(item)) {
      const docketEntry = new DocketEntry(item, { applicationContext });
      if (docketEntry.isCourtIssued() && docketEntry.isServed()) {
        docketEntry.filingDate = docketEntry.servedAt;
        Object.assign(item, docketEntry);
      }
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
