import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { Document } from '../../shared/src/business/entities/Document';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { uploadPetition } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSetsCaseReadyForTrial from './journey/petitionsClerkSetsCaseReadyForTrial';
import petitionsClerkUpdatesFiledBy from './journey/petitionsClerkUpdatesFiledBy';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
import userSignsOut from './journey/taxpayerSignsOut';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  externalRoute: () => {},
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

test = CerebralTest(presenter);

describe('Trial Session Eligible Cases - Both small and regular cases get scheduled to the trial session that’s a hybrid session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      INTERNAL_CATEGORY_MAP: Document.CATEGORY_MAP,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      STATUS_TYPES: Case.STATUS_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  const trialLocation = `Despacito, Texas, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Hybrid',
    trialLocation,
  };
  const createdCases = [];

  describe(`Create trial session with Hybrid session type for '${trialLocation}' with max case count = 2`, () => {
    docketClerkLogIn(test);
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsAnUpcomingTrialSession(test);
    userSignsOut(test);
  });

  describe('Create cases', () => {
    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '01',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #1', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Regular',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '02',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #2', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 2/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '02',
        receivedAtDay: '01',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #3', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });
  });

  describe(`Result: Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(3);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[1],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[2],
      );
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });

    userSignsOut(test);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);
    petitionsClerkSetsATrialSessionsSchedule(test);
    userSignsOut(test);
  });

  describe(`Result: Case #1 and #2 are assigned to '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #1 and #2 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(2);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCases[1],
      );
    });

    userSignsOut(test);
  });
});
