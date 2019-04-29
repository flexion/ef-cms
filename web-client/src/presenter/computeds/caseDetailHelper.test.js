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
});
