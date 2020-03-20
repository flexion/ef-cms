import { menuHelper } from './computeds/menuHelper';

import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { publicAlertHelper } from './computeds/public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/public/publicCaseDetailHelper';

const helpers = {
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  loadingHelper,
  menuHelper,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper,
};

export const state = {
  ...helpers,
  advancedSearchForm: {},
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'Interstitial',
  searchMode: 'byName',
  user: {},
  validationErrors: {},
  waitingForResponse: false,
  waitingForResponseRequests: 0,
};
