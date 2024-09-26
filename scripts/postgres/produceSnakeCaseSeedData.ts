import * as util from 'util';
import { workItems } from '@web-api/persistence/postgres/utils/seed/fixtures/workItems';

function camelToSnake(camelStr) {
  return camelStr.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

const work_items = workItems.map(workItem => {
  const work_item = {};
  for (let key in workItem) {
    let new_key = camelToSnake(key);
    // console.log(`${key} => ${new_key}`);
    work_item[new_key] = workItem[key];
  }
  return work_item;
});

// console.log(JSON.stringify(work_items, null, 2));

console.log(
  util.inspect(work_items, {
    depth: Infinity,
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
  }),
);
