import { runCompute } from 'cerebral/test';

import { caseDetailHelper } from './caseDetailHelper';

describe('case detail computed', () => {
  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is practitioner, and case is owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: true,
        },
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set showFileDocumentButton to false if current page is CaseDetail, user role is practitioner, and case is not owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is petitioner, and the user is associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: true,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set showPendingAccessToCaseButton to true if user role is practitioner and case is not owned by user but has pending request', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
          pendingAssociation: true,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showPendingAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to true if user role is practitioner and case is not owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
        },
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: true,
        },
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is petitioner and user is not associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set userHasAccessToCase to true if user role is petitioner and user is associated with case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: true,
        },
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to true if user role is practitioner and the practitioner is associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { associated: true },
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to false if user role is practitioner and the practitioner is not associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '234' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { associated: false },
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to true if user role is respondent and the respondent is associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { respondent: { userId: '789' } },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: true,
        },
        user: {
          role: 'respondent',
          userId: '789',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
    expect(result.showFileDocumentButton).toEqual(true);
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to true if user role is respondent and the respondent is not associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { respondent: { userId: '123' } },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
        },
        user: {
          role: 'respondent',
          userId: '789',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
    expect(result.showFileDocumentButton).toEqual(false);
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showFileFirstDocumentButton to true if user role is respondent and there is no respondent associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          associated: false,
        },
        user: {
          role: 'respondent',
          userId: '789',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
    expect(result.showFileDocumentButton).toEqual(false);
    expect(result.showFileFirstDocumentButton).toEqual(true);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should show add docket entry button if current page is CaseDetailInternal and user role is docketclerk', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetailInternal',
        form: {},
        user: {
          role: 'docketclerk',
          userId: '789',
        },
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(true);
  });

  it('should not show add docket entry button if current page is not CaseDetailInternal or user role is not docketclerk', () => {
    let result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'docketclerk',
          userId: '789',
        },
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(false);

    result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'petitioner',
          userId: '789',
        },
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(false);
  });

  it('should show payment record and not payment options if case is paid', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { payGovId: '123' },
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.showPaymentRecord).toEqual(true);
    expect(result.showPaymentOptions).toEqual(false);
  });

  it('should not show payment record and show payment options if case is not paid', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.showPaymentRecord).toBeUndefined();
    expect(result.showPaymentOptions).toEqual(true);
  });
});
