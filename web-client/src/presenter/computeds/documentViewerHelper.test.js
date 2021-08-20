import {
  adcUser,
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { applicationContext } from '../../applicationContext';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
  applicationContext,
);

describe('documentViewerHelper', () => {
  const DOCKET_ENTRY_ID = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: DOCKET_ENTRY_ID,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
    index: 1,
    isOnDocketRecord: true,
  };

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDocumentToDisplay: {
        docketEntryId: DOCKET_ENTRY_ID,
      },
    };
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return an empty object if the requested docketEntryId is not found in the docket record', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
        viewerDocumentToDisplay: {
          docketEntryId: '0848a72a-e61b-4721-b4b8-b2a19ee98baa',
        },
      },
    });
    expect(result).toEqual({});
  });

  it('should return the document description and filed label', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              filedBy: 'Test Petitioner',
              filingDate: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.description).toEqual('Petition');
    expect(result.filedLabel).toEqual('Filed 11/21/18 by Test Petitioner');
  });

  it('should return an empty filed label for court-issued documents', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
            },
          ],
        },
      },
    });
    expect(result.filedLabel).toEqual('');
  });

  it('should return showSealedInBlackstone true or false based on whether the document has isLegacySealed', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: false,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(false);

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: true,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(true);
  });

  it('should return a served label if the document has been served', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
      },
    });
    expect(result.servedLabel).toEqual('');

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              servedAt: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.servedLabel).toEqual('Served 11/21/18');
  });

  it('should return showNotServed true if the document type is servable and does not have a servedAt', () => {
    const { showNotServed } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
      },
    });

    expect(showNotServed).toEqual(true);
  });

  it('should show stricken information if the docket entry has been stricken', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isStricken: true,
            },
          ],
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });

  describe('showServeCourtIssuedDocumentButton', () => {
    const showServeCourtIssuedDocumentButtonTests = [
      {
        description:
          'should be true if the document type is a servable court issued document that does not have a served at',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not a court issued document',
        docketEntryOverrides: {
          documentType: 'Miscellaneous',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document and has servedAt',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is a servable court issued document without servedAt but the user does not have permission to serve the document',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
        user: adcUser,
      },
    ];

    showServeCourtIssuedDocumentButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showServeCourtIssuedDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [
                    { ...baseDocketEntry, ...docketEntryOverrides },
                  ],
                },
              },
            },
          );

          expect(showServeCourtIssuedDocumentButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showServePaperFiledDocumentButton', () => {
    const showServePaperFiledDocumentButtonTests = [
      {
        description:
          'should be true if the document type is an external document (and not a Petition) that does not have a served at and permisisons.SERVE_DOCUMENT is true',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: true,
      },
      {
        description:
          'should be false if the document type is not an external document',
        docketEntryOverrides: {
          documentType: 'Order',
          eventCode: 'O',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document and has servedAt',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document type is an external document without servedAt but the user does not have permission to serve the document',
        docketEntryOverrides: {
          documentType: 'Answer',
          eventCode: 'A',
        },
        expectation: false,
        user: adcUser,
      },
    ];

    showServePaperFiledDocumentButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showServePaperFiledDocumentButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(user || docketClerkUser),
                caseDetail: {
                  docketEntries: [
                    { ...baseDocketEntry, ...docketEntryOverrides },
                  ],
                },
              },
            },
          );

          expect(showServePaperFiledDocumentButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showServePetitionButton', () => {
    const showServePetitionButtonTests = [
      {
        description:
          'should be false if the document is a served Petition document and the user has SERVE_PETITION permission',
        docketEntryOverrides: {
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        expectation: false,
      },
      {
        description:
          'should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission',
        expectation: false,
        user: docketClerkUser,
      },
      {
        description:
          'should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission',
        expectation: true,
      },
    ];

    showServePetitionButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showServePetitionButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || petitionsClerkUser),
              caseDetail: {
                docketEntries: [
                  { ...baseDocketEntry, ...docketEntryOverrides },
                ],
              },
            },
          });

          expect(showServePetitionButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showSignStipulatedDecisionButton', () => {
    const showSignStipulatedDecisionButtonTests = [
      {
        description:
          'should be true if the eventCode is PSDE, the PSDE is served, and the SDEC eventCode is not in the documents',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
        ],
        expectation: true,
      },
      {
        description:
          'should be false if the eventCode is PSDE and the PSDE is not served',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
          },
        ],
        expectation: false,
      },
      {
        description:
          'should be true if the document code is PSDE, the PSDE is served, and an archived SDEC eventCode is in the documents',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            archived: true,
            docketEntryId: '234',
            documentType: 'Stipulated Decision',
            eventCode: 'SDEC',
          },
        ],
        expectation: true,
      },
      {
        description:
          'should be false if the document code is PSDE, the PSDE is served, and the SDEC eventCode is in the documents (and is not archived)',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Proposed Stipulated Decision',
            eventCode: 'PSDE',
            servedAt: '2019-08-25T05:00:00.000Z',
          },
          {
            docketEntryId: '234',
            documentType: 'Stipulated Decision',
            eventCode: 'SDEC',
          },
        ],
        expectation: false,
      },
      {
        description: 'should be false if the eventCode is not PSDE',
        docketEntries: [
          {
            ...baseDocketEntry,
            documentType: 'Answer',
            eventCode: 'A',
          },
        ],
        expectation: false,
      },
    ];

    showSignStipulatedDecisionButtonTests.forEach(
      ({ description, docketEntries, expectation }) => {
        it(`${description}`, () => {
          const { showSignStipulatedDecisionButton } = runCompute(
            documentViewerHelper,
            {
              state: {
                ...getBaseState(docketClerkUser),
                caseDetail: { docketEntries },
              },
            },
          );

          expect(showSignStipulatedDecisionButton).toEqual(expectation);
        });
      },
    );
  });

  describe('showCompleteQcButton', () => {
    const showCompleteQcButtonTests = [
      {
        description:
          'should be true if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress',
        docketEntryOverrides: {
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: true,
      },
      {
        description:
          'should be false if the user does not have EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item and is not in progress',
        docketEntryOverrides: {
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: false,
        user: adcUser,
      },
      {
        description:
          'should be undefined if the user has EDIT_DOCKET_ENTRY permissions and the docket entry does not have an incomplete work item',
        docketEntryOverrides: {
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          servedAt: '2019-08-25T05:00:00.000Z',
        },
        expectation: undefined,
      },
      {
        description:
          'should be false if the user has EDIT_DOCKET_ENTRY permissions and the docket entry has an incomplete work item but is in progress',
        docketEntryOverrides: {
          documentType: 'Proposed Stipulated Decision',
          eventCode: 'PSDE',
          isFileAttached: false,
          servedAt: '2019-08-25T05:00:00.000Z',
          workItem: {},
        },
        expectation: false,
      },
    ];

    showCompleteQcButtonTests.forEach(
      ({ description, docketEntryOverrides, expectation, user }) => {
        it(`${description}`, () => {
          const { showCompleteQcButton } = runCompute(documentViewerHelper, {
            state: {
              ...getBaseState(user || docketClerkUser),
              caseDetail: {
                docketEntries: [
                  { ...baseDocketEntry, ...docketEntryOverrides },
                ],
              },
            },
          });

          expect(showCompleteQcButton).toEqual(expectation);
        });
      },
    );
  });
});
