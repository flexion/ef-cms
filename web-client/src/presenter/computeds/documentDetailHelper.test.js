import { runCompute } from 'cerebral/test';

import { documentDetailHelper } from './documentDetailHelper';

describe('formatted work queue computed', () => {
  it('formats the workitems', () => {
    const result = runCompute(documentDetailHelper, {
      state: {
        caseDetail: {
          documents: [],
          status: 'General Docket',
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
          status: 'General Docket',
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
            status: 'General Docket',
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });
  });
});
