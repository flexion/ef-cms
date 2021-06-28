import { setupTest } from './helpers';
import { unauthedUserViewsHealthCheck } from './journey/unauthedUserViewsHealthCheck';

const integrationTest = setupTest();

describe('Unauthed user views health check', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  unauthedUserViewsHealthCheck(integrationTest);
});
