import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from '../src/presenter/computeds/completeDocumentTypeSectionHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Document title journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const integrationTest = setupTest();

  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const completeDocumentTypeSectionHelper = withAppContextDecorator(
    completeDocumentTypeSectionHelperComputed,
  );

  loginAs(integrationTest, 'privatePractitioner2@example.com');
  practitionerCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  loginAs(integrationTest, 'privatePractitioner2@example.com');
  it('Practitioner files Exhibit(s) document', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Exhibit(s)',
      documentType: 'Exhibit(s)',
      eventCode: 'EXH',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await integrationTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('form.documentType')).toEqual('Exhibit(s)');

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'hasSupportingDocuments',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'attachments',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence(
      'reviewExternalDocumentInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitExternalDocumentSequence');
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket clerk QCs Exhibits docket entry and adds additionalInfo', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const exhibitDocketEntry = integrationTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.eventCode === 'EXH');

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: exhibitDocketEntry.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'Is this pool safe for diving? It deep ends.',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'addToCoversheet',
      value: true,
    });

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends. has been completed.',
    );

    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    });
    const exhibitOutboxWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId === exhibitDocketEntry.docketEntryId,
    );
    integrationTest.docketEntryId = exhibitDocketEntry.docketEntryId;

    expect(exhibitOutboxWorkItem.docketEntry.descriptionDisplay).toEqual(
      'Exhibit(s) Is this pool safe for diving? It deep ends.',
    );
  });

  loginAs(integrationTest, 'privatePractitioner2@example.com');
  it('Practitioner files amendment to Exhibit(s) document', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: '[First, Second, etc.] Amendment to [anything]',
      documentType: 'Amendment [anything]',
      eventCode: 'ADMT',
      filers: [contactPrimary.contactId],
      ordinalValue: 'First',
      primaryDocumentFile: fakeFile,
      scenario: 'Nonstandard F',
    };

    for (const key of Object.keys(documentToSelect)) {
      await integrationTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');

    await integrationTest.runSequence('completeDocumentSelectSequence');

    integrationTest.setState('docketEntryId', undefined);

    const completeDocumentTypeSection = runCompute(
      completeDocumentTypeSectionHelper,
      {
        state: integrationTest.getState(),
      },
    );

    expect(
      completeDocumentTypeSection.primary.previouslyFiledDocuments.find(
        d => d.eventCode === 'EXH',
      ).documentTitle,
    ).toEqual('Exhibit(s) Is this pool safe for diving? It deep ends.');

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'previousDocument',
        value: integrationTest.docketEntryId,
      },
    );

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence(
      'reviewExternalDocumentInformationSequence',
    );

    expect(integrationTest.getState('form.documentTitle')).toEqual(
      'First Amendment to Exhibit(s) Is this pool safe for diving? It deep ends.',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitExternalDocumentSequence');
  });
});
