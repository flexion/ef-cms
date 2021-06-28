import { CONTACT_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  contactSecondaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { some } from 'lodash';

const integrationTest = setupTest();

const publicFieldsVisible = () => {
  expect(integrationTest.getState('caseDetail.docketNumber')).toBeDefined();
  expect(integrationTest.getState('caseDetail.caseCaption')).toBeDefined();
  expect(integrationTest.getState('caseDetail.docketEntries.0')).toBeDefined();
  expect(
    integrationTest.getState('caseDetail.petitioners.0.contactId'),
  ).toBeDefined();
};

const associatedFieldsVisible = () => {
  const contactPrimary = contactPrimaryFromState(integrationTest);

  expect(contactPrimary).toMatchObject({
    address1: expect.anything(),
    city: expect.anything(),
    name: expect.anything(),
    phone: expect.anything(),
    state: expect.anything(),
  });
};

const associatedFieldsBlocked = () => {
  const contactPrimary = contactPrimaryFromState(integrationTest);
  const contactSecondary = contactSecondaryFromState(integrationTest);

  expect(contactPrimary).toEqual({
    contactId: contactPrimary.contactId,
    contactType: CONTACT_TYPES.primary,
    entityName: 'PublicContact',
    name: expect.anything(),
    state: expect.anything(),
  });
  expect(contactPrimary.address1).toBeUndefined();
  expect(contactSecondary).toBeUndefined();
};

const internalFieldsVisible = () => {
  expect(
    integrationTest.getState('caseDetail.archivedCorrespondences'),
  ).toBeDefined();
  expect(
    integrationTest.getState('caseDetail.archivedDocketEntries'),
  ).toBeDefined();
  expect(integrationTest.getState('caseDetail.associatedJudge')).toBeDefined();
  expect(integrationTest.getState('caseDetail.correspondence')).toBeDefined();
  expect(integrationTest.getState('caseDetail.statistics')).toBeDefined();
  expect(integrationTest.getState('caseDetail.status')).toBeDefined();
};

const internalFieldsBlocked = () => {
  expect(
    integrationTest.getState('caseDetail.archivedCorrespondences'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.archivedDocketEntries'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.associatedJudge'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.automaticBlocked'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.automaticBlockedDate'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.automaticBlockedReason'),
  ).toBeUndefined();
  expect(integrationTest.getState('caseDetail.blocked')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.blockedDate')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.blockedReason')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.caseNote')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.correspondence')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.damages')).toBeUndefined();
  expect(integrationTest.getState('caseDetail.highPriority')).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.highPriorityReason'),
  ).toBeUndefined();
  expect(integrationTest.getState('caseDetail.judgeUserId')).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.litigationCosts'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.noticeOfAttachments'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderDesignatingPlaceOfTrial'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderForAmendedPetition'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderForAmendedPetitionAndFilingFee'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderForFilingFee'),
  ).toBeUndefined();
  expect(integrationTest.getState('caseDetail.orderForOds')).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderForRatification'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.orderToShowCause'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.qcCompleteForTrial'),
  ).toBeUndefined();
  expect(integrationTest.getState('caseDetail.statistics')).toBeUndefined();

  expect(
    integrationTest.getState('caseDetail.docketEntries.0.draftOrderState'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.editState'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.isDraft'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.judge'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.judgeUserId'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.pending'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.qcAt'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.qcByUserId'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.signedAt'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.signedByUserId'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.signedJudgeName'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.signedJudgeUserId'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.strickenBy'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.strickenByUserId'),
  ).toBeUndefined();
  expect(
    integrationTest.getState('caseDetail.docketEntries.0.workItem'),
  ).toBeUndefined();
};

const stinVisible = () => {
  expect(
    some(integrationTest.getState('caseDetail.docketEntries'), {
      eventCode: 'STIN',
    }),
  ).toBe(true);
};

const stinBlocked = () => {
  expect(
    some(integrationTest.getState('caseDetail.docketEntries'), {
      eventCode: 'STIN',
    }),
  ).toBe(false);
};

const printableDocketRecordVisible = async () => {
  await integrationTest.runSequence('gotoPrintableDocketRecordSequence', {
    docketNumber: integrationTest.docketNumber,
  });
  expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
};

describe('Case permissions test', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerCreatesNewCase(integrationTest, fakeFile);
  petitionerViewsCaseDetail(integrationTest);
  it('Petitioner views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has NOT been served', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'privatePractitioner@example.com');
  it('Unassociated private practitioner views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('Unassociated IRS practitioner views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'petitioner2@example.com');
  it('Unassociated petitioner views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  it('Petitions Clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinVisible();
    await printableDocketRecordVisible();
  });

  petitionsClerkSubmitsCaseToIrs(integrationTest);

  it('Petitions Clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(integrationTest, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has been served', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinVisible();
    await printableDocketRecordVisible();
  });
});
