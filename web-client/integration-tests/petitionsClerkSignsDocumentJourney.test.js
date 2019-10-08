import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { Document } from '../../shared/src/business/entities/Document';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { setupTest } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
import petitionsClerkAddsOrderToCase from './journey/petitionsClerkAddsOrderToCase';
import petitionsClerkAppliesSignatureToDraftDocument from './journey/petitionsClerkAppliesSignatureToDraftDocument';
import petitionsClerkClearsSignatureFromDraftDocument from './journey/petitionsClerkClearsSignatureFromDraftDocument';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRemovesSignatureFromDraftDocument from './journey/petitionsClerkRemovesSignatureFromDraftDocument';
import petitionsClerkSavesSignatureForDraftDocument from './journey/petitionsClerkSavesSignatureForDraftDocument';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsCaseDetailAfterAddingOrder from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import petitionsClerkViewsDocumentDetail from './journey/petitionsClerkViewsDocumentDetail';
import petitionsClerkViewsDraftDocuments from './journey/petitionsClerkViewsDraftDocuments';
import petitionsClerkViewsSignDraftDocument from './journey/petitionsClerkViewsSignDraftDocument';
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');
const { Order } = require('../../shared/src/business/entities/orders/Order');

let test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => {
      return new Promise(resolve => {
        resolve(null);
      });
    },
  },
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

global.File = () => {
  return fakeFile;
};
presenter.providers.router = {
  createObjectURL: () => {
    return 'fakeUrl';
  },
  externalRoute: () => null,
  revokeObjectURL: () => {},
  route: async url => {
    test.currentRouteUrl = url;
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

test = CerebralTest(presenter);

describe('Petitions Clerk Create Order Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      DOMParser: () => {
        return {
          parseFromString: () => {
            return {
              children: [
                {
                  innerHTML: 'something',
                },
              ],
              querySelector: () => {},
            };
          },
        };
      },
      URL: {
        createObjectURL: () => {
          return fakeData;
        },
        revokeObjectURL: () => {},
      },
      document: {},
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
      pdfjsObj: {
        getData: () => {
          return new Promise(resolve => {
            resolve(new Uint8Array(fakeFile));
          });
        },
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
      ORDER_TYPES_MAP: Order.ORDER_TYPES,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  taxpayerLogin(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxPayerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkViewsDraftDocuments(test);
  petitionsClerkAddsOrderToCase(test);
  petitionsClerkViewsCaseDetailAfterAddingOrder(test);
  petitionsClerkViewsDraftDocuments(test, 1);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkViewsSignDraftDocument(test);
  petitionsClerkAppliesSignatureToDraftDocument(test);
  petitionsClerkClearsSignatureFromDraftDocument(test);
  petitionsClerkAppliesSignatureToDraftDocument(test);
  petitionsClerkSavesSignatureForDraftDocument(test);
  petitionsClerkViewsDocumentDetail(test);
  petitionsClerkRemovesSignatureFromDraftDocument(test);
  petitionsClerkSignsOut(test);
});
