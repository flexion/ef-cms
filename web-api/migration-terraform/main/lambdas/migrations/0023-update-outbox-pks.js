const migrateItems = async items => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk.startsWith('user-outbox|')) {
      const completedKey = item.completedAt ? 'complete' : 'incomplete';
      itemsAfter.push({
        ...item,
        pk: `user-${completedKey}-outbox|${item.workItemId}`,
      });
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;
