import { createReadStream } from 'fs';
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

const rl = readline.createInterface({
  input: createReadStream('/Users/jimbo/Documents/allDynamoRecords.txt'),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  const pkPrefix = obj.pk.split('|')[0] + '|';
  const skPrefix = obj.pk.split('|')[0] + '|';
  const key = pkPrefix + skPrefix;
  if (lookupTable[key]) {
    const currentCount = uniqueKeysMap.get(key) || 0;
    uniqueKeysMap.set(key, currentCount + 1);
  }
});

rl.on('close', () => {
  console.log('Done!');
  console.log(uniqueKeysMap);
});
