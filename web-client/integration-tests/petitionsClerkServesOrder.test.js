import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';
import { petitionsClerkServesOrder } from './journey/petitionsClerkServesOrder';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreateOrder(integrationTest);
  petitionsClerkSignsOrder(integrationTest);
  petitionsClerkAddsDocketEntryFromOrder(integrationTest);
  petitionsClerkServesOrder(integrationTest);
});
