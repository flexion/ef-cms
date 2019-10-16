import {
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';
import { documentDetailHelper as documentDetailHelperComputed } from './documentDetailHelper';
import { formatDocument } from '../../../../shared/src/business/utilities/getFormattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

let role = 'petitionsclerk';

const getDateISO = () => new Date().toISOString();

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
  {
    getConstants: () => ({
      ORDER_TYPES_MAP: [
        {
          documentTitle: 'Order of Dismissal',
          documentType: 'Order of Dismissal',
          eventCode: 'OD',
        },
      ],
    }),
    getCurrentUser: () => ({
      role,
      userId: 'abc',
    }),
    getUtilities: () => {
      return {
        createISODateString,
        formatDateString,
        formatDocument,
        formatNow,
        prepareDateFromString,
      };
    },
  },
);

describe('formatted work queue computed', () => {
  beforeEach(() => {
    role = 'petitionsclerk';
  });

  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'General Docket - Not at Issue',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean false when case status is general docket', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'General Docket - Not at Issue',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(false);
  });

  it('sets the showCaseDetailsEdit boolean true when case status new', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'New',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean true when case status recalled', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'Recalled',
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  describe('showDocumentInfoTab', () => {
    it('should be false if document is not a petition', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'NotAPetition',
              },
            ],
            status: 'Recalled',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should be true if document is a petition and status is New, Recalled, or Batched for IRS', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: 'Recalled',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(true);
    });

    it('should be false if document is a petition and status is not New, Recalled, or Batched for IRS', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: 'General Docket - Not at Issue',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should show the serve button when a docketclerk and the document is a Stipulated Decision and the document is not served already', () => {
      role = 'docketclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'new',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(true);
    });

    it('should NOT show the serve button when user is a NOT a docketclerk', () => {
      role = 'petitionsclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });

    it('should NOT show the serve button when the document is NOT a signed stipulated decisiion', () => {
      role = 'petitionsclerk';
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Proposed Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });
  });

  it('should NOT show the serve button when a docketclerk and the document is a Stipulated Decision and document has already been served', () => {
    role = 'docketclerk';
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Stipulated Decision',
              status: 'served',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showServeDocumentButton).toEqual(false);
  });

  it('should indicate QC completed by workItem "completedBy" if not indicated on Document', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'taxpayer',
              workItems: [
                {
                  caseStatus: 'New',
                  completedAt: '2018-11-21T20:49:28.192Z',
                  completedBy: 'William T. Riker',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: 'New',
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.qcBy).toBe('William T. Riker');
  });

  it('should indicate QC completed by "qcByUser" on Document if present', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              qcByUser: {
                name: 'Reginald Barclay',
                userId: 'xyzzy',
              },
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'taxpayer',
              workItems: [
                {
                  caseStatus: 'New',
                  completedAt: '2018-11-21T20:49:28.192Z',
                  completedBy: 'William T. Riker',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: 'New',
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.qcBy).toBe('Reginald Barclay');
  });

  it('should filter out completed work items with Served on IRS messages', () => {
    role = 'seniorattorney';

    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'taxpayer',
              workItems: [
                {
                  caseStatus: 'New',
                  completedAt: '2018-11-21T20:49:28.192Z',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: 'New',
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.workItems).toHaveLength(1);
  });

  it('default to empty array when caseDetail.documents is undefined', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: undefined,
        },
      },
    });

    expect(result.formattedDocument).toMatchObject({});
  });

  it("default to empty array when a document's workItems are non-existent", () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: undefined,
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      },
    });

    expect(result.formattedDocument.documentId).toEqual(
      'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  describe('showViewOrdersNeededButton', () => {
    it("should show the 'view orders needed' link if a document has been served and user is petitionsclerk", () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: 'petitionsclerk',
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(true);
    });

    it("should NOT show the 'view orders needed' link if a document has been served and user is NOT a petitionsclerk", () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: 'docketclerk',
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });

    it("should NOT show the 'view orders needed' link if a document has NOT been served and user is a petitionsclerk", () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'processing',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: 'petitionsclerk',
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });

    it("should NOT show the 'view orders needed' link if a document has NOT been served and user is NOT a petitionsclerk", () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'processing',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: 'docketclerk',
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });
  });

  describe('showConfirmEditOrder and showRemoveSignature', () => {
    it('should show confirm edit order and remove signature', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Order of Dismissal',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: 'petitionsclerk',
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(true);
      expect(result.showRemoveSignature).toEqual(true);
    });

    it('should NOT show confirm edit order OR remove signature when the documentType is not an order', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: 'petitionsclerk',
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });

    it('should NOT show confirm edit order OR remove signature when the document has not been signed', () => {
      const result = runCompute(documentDetailHelper, {
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: null,
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: 'petitionsclerk',
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });
  });
});
