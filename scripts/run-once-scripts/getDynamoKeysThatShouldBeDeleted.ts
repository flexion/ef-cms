import { applicationContext } from '@web-api/applicationContext';
import { batchDelete } from '@web-api/persistence/dynamodbClientService';
import { createReadStream, writeFileSync } from 'fs';
import { chunk } from 'lodash';
import readline from 'readline';

const thingsToDelete: any[] = [];
let scanCount = 0;

const rl = readline.createInterface({
  input: createReadStream(
    '/Users/zacharyrogers/Documents/allTestDynamoRecords.txt',
  ),
  crlfDelay: Infinity,
});

rl.on('line', line => {
  const obj = JSON.parse(line);
  if (isDeletableDynamoRecord(obj)) {
    thingsToDelete.push(obj);
  }
  if (scanCount % 100000) {
    console.log('Scan count: ', scanCount);
  }
  scanCount++;
});

rl.on('close', async () => {
  const filename = './thingsToDeleteInDynamo.json';
  console.log('Finished scan');

  console.log(`Writing things to delete into ${filename}`);
  writeFileSync(filename, JSON.stringify(thingsToDelete));
  console.log('Finished writing');

  console.log(`Deleting ${thingsToDelete.length} things`);
  await deleteThingsInDynamo(thingsToDelete);
});

function isDeletableDynamoRecord(obj) {
  if (isCorrespondence(obj)) {
    return true;
  }
  if (isCaseDeadline(obj)) {
    return true;
  }
  if (isUserCaseNote(obj)) {
    return true;
  }
  if (isCaseWorkSheet(obj)) {
    return true;
  }
  if (isCaseMessage(obj)) {
    return true;
  }
  if (isWorkItem(obj)) {
    return true;
  }
  return false;
}

function isCorrespondence(obj) {
  return obj.sk.startsWith('correspondence|');
}
function isCaseDeadline(obj) {
  return obj.sk.startsWith('case-deadline|');
}
function isUserCaseNote(obj) {
  return obj.pk.startsWith('user-case-note|');
}
function isCaseWorkSheet(obj) {
  return obj.sk.startsWith('case-worksheet|');
}
function isCaseMessage(obj) {
  return (
    obj.pk.startsWith('section-outbox') || obj.pk.startsWith('user-outbox|')
  );
}
function isWorkItem(obj) {
  return obj.sk.startsWith('work-item|');
}

async function deleteThingsInDynamo(
  thingsToDelete: { pk: string; sk: string }[],
) {
  const deleteChunks = chunk(thingsToDelete, 25);

  for (let index = 0; index < deleteChunks.length; index++) {
    const chunk = deleteChunks[index];
    await batchDelete({ applicationContext, items: chunk });
  }
}
