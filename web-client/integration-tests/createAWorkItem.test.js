import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');

const DOCKET_CLERK_1_ID = '2805d1ab-18d0-43ec-bafb-654e83405416';
const MESSAGE = 'new test message';

// TODO: this is common in each test
let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = new Buffer.from(fakeData, 'base64', {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

const waitForRouter = () => {
  return new Promise(resolve => {
    setImmediate(() => resolve(true));
  });
};

async function loginAs(user) {
  await test.runSequence('updateFormValueSequence', {
    key: 'name',
    value: user,
  });
  await test.runSequence('submitLoginSequence');
}

async function createCase(test) {
  test.setState('form', {
    caseType: 'CDP (Lien/Levy)',
    contactPrimary: {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: 'domestic',
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
      state: 'CT',
    },
    contactSecondary: {},
    filingType: 'Myself',
    hasIrsNotice: false,
    partyType: 'Petitioner',
    preferredTrialCity: 'Lubbock, Texas',
    procedureType: 'Regular',
    signature: true,
  });

  await test.runSequence('updateStartCaseFormValueSequence', {
    key: 'petitionFile',
    value: fakeFile,
  });

  await test.runSequence('updateStartCaseFormValueSequence', {
    key: 'petitionFileSize',
    value: 1,
  });

  await test.runSequence('updateStartCaseFormValueSequence', {
    key: 'stinFile',
    value: fakeFile,
  });

  await test.runSequence('updateStartCaseFormValueSequence', {
    key: 'stinFileSize',
    value: 1,
  });

  await test.runSequence('submitFilePetitionSequence');
  return await waitForRouter();
}

function findByDocumentType(test, documentType) {
  return test
    .getState('caseDetail')
    .documents.find(d => d.documentType === documentType);
}

function getDocketNumber(test) {
  return test.getState('caseDetail').docketNumber;
}

function createWorkItem(test) {
  test.setState('form', {
    assigneeId: DOCKET_CLERK_1_ID,
    message: MESSAGE,
    section: 'docket',
  });

  return test.runSequence('createWorkItemSequence');
}

async function findWorkItemInWorkQueue({
  box,
  docketNumber,
  message,
  queue,
  test,
  workQueueIsInternal = true,
}) {
  await test.runSequence('chooseWorkQueueSequence', {
    box,
    queue,
    workQueueIsInternal,
  });

  const workQueue = test.getState('workQueue');

  const workItem = workQueue.find(
    i => i.docketNumber === docketNumber && i.messages[0].message === message,
  );

  return workItem;
}

describe('Create a work item', () => {
  beforeAll(() => {
    jest.setTimeout(30000);

    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  let docketNumber;
  let petitionDocument;

  it('create the case for this test', async () => {
    await loginAs('taxpayer');
    await waitForRouter();
    await createCase(test);
  });

  it('keep track of the docketNumber and petitionDocument', () => {
    docketNumber = getDocketNumber(test);
    petitionDocument = findByDocumentType(test, 'Petition');
  });

  it('login as a petitionsclerk and create a new work item on the petition document', async () => {
    await loginAs('petitionsclerk');
    await waitForRouter();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: petitionDocument.documentId,
    });

    await createWorkItem(test);
  });

  it('verify the work item exists on the petitions user my outbox', async () => {
    const workItemFromMyOutbox = await findWorkItemInWorkQueue({
      box: 'outbox',
      docketNumber,
      message: MESSAGE,
      queue: 'my',
      test,
    });
    expect(workItemFromMyOutbox).toBeDefined();
  });

  it('verify the work item exists on the petitions section outbox', async () => {
    const workItemFromSectionOutbox = await findWorkItemInWorkQueue({
      box: 'outbox',
      docketNumber,
      message: MESSAGE,
      queue: 'section',
      test,
    });
    expect(workItemFromSectionOutbox).toBeDefined();
  });

  it('login as the docketclerk1 (who we created the new work item for)', async () => {
    await loginAs('docketclerk1');
    await waitForRouter();
  });

  it('verify the work item exists on the docket section inbox', async () => {
    const workItemFromSectionInbox = await findWorkItemInWorkQueue({
      box: 'inbox',
      docketNumber,
      message: MESSAGE,
      queue: 'section',
      test,
    });

    expect(workItemFromSectionInbox).toBeDefined();
  });

  it('verify the work item exists on the docketclerk1 user my inbox', async () => {
    const workItemFromMyInbox = await findWorkItemInWorkQueue({
      box: 'inbox',
      docketNumber,
      message: MESSAGE,
      queue: 'my',
      test,
    });
    expect(workItemFromMyInbox).toBeDefined();
  });
});
