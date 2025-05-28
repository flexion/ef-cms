import { createReadStream, writeFileSync } from 'fs';
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

rl.on('close', () => {
  console.log('Done!');
  console.log(`Deleting ${thingsToDelete.length} things`);
  writeFileSync(
    './thingsToDeleteInDynamo.json',
    JSON.stringify(thingsToDelete),
  );
  // Delete them
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
