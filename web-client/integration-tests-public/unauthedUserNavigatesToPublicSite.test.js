import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';

const integrationTest = setupTest();
describe('Unauthed user navigates to public site', () => {
  unauthedUserNavigatesToPublicSite(integrationTest);
});
