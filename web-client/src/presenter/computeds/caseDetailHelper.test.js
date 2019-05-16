import { runCompute } from 'cerebral/test';

import { caseDetailHelper } from './caseDetailHelper';

describe('case detail computed', () => {
  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is practitioner, and case is owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
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
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should set showFileDocumentButton to true if current page is CaseDetail and user role is not practitioner', () => {
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
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to true if user role is practitioner and case is not owned by user', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
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
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is not practitioner', () => {
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
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set userHasAccessToCase to true if user role is not practitioner', () => {
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
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to true if user role is practitioner and the practitioner is associated with the case', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
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
        user: {
          role: 'practitioner',
          userId: '123',
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
  });

  it('should show the action required tab for a petitioner and no payment', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '234' }] },
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'petitioner',
          userId: '123',
        },
      },
    });

    expect(result.documentDetail.tab).toEqual('actionRequired');
  });

  it('should not show the action required tab for a non-petitioner', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { practitioners: [{ userId: '234' }] },
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: 'docketclerk',
          userId: '123',
        },
      },
    });

    expect(result.documentDetail.tab).toEqual('docketRecord');
  });
});
