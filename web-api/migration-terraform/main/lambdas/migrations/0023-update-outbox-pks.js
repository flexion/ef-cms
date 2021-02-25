const createApplicationContext = require('../../../../src/applicationContext');
const applicationContext = createApplicationContext({});

const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('user-outbox|')) {
      const completedKey = item.completedAt ? 'complete' : 'incomplete';
      // add completedKey into the item.pk so it's user-${completedKey}-outbox
      const [blah] = item.pk.split('|');
      item.pk = `${userRole}|${upperCaseNameOrBarNumber}`;

      itemsAfter.push({ ...item, ...practitioner });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
