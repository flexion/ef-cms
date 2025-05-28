import { createReadStream, writeFileSync } from 'fs';
import readline from 'readline';

const objectsThatShouldNotBeInDynamo = [
  {
    pk: 'case',
    sk: 'correspondence',
  },
  {
    pk: 'case',
    sk: 'case-deadline',
  },
  // We did not delete pk case-deadline at all.
  // This should have no effect in app code, but it is best to remove anyhow.
  {
    pk: 'case-deadline',
    sk: 'case-deadline',
  },
  {
    pk: 'user-case-note',
    sk: 'user',
  },
  {
    pk: 'case',
    sk: 'case-worksheet',
  },
  {
    pk: 'section-outbox',
    sk: '',
  },
  {
    pk: 'user-outbox',
    sk: '',
  },
  {
    pk: 'case',
    sk: 'work-item',
  },
];

const lookupTable = {};

for (const obj of objectsThatShouldNotBeInDynamo) {
  lookupTable[obj.pk + '|' + obj.sk + '|'] = true;
}

const uniqueKeysMap: Map<string, number> = new Map();
const ids: string[] = [];

const rl = readline.createInterface({
  input: createReadStream('/Users/jimbo/Documents/allDynamoRecords.txt'),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  const pkPrefix = obj.pk.split('|')[0] + '|';
  const skPrefix = obj.pk.split('|')[0] + '|';
  const lookupKey = pkPrefix + skPrefix;
  if (lookupTable[lookupKey]) {
    const currentCount = uniqueKeysMap.get(lookupKey) || 0;
    uniqueKeysMap.set(lookupKey, currentCount + 1);
    ids.push(obj.pk + '_' + obj.sk);
  }
});

rl.on('close', () => {
  console.log('Done!');
  console.log(uniqueKeysMap);
  writeFileSync('./idsOfThingsInDynamo.json', JSON.stringify(ids));
});
