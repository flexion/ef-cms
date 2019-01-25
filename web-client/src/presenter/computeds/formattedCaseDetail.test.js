import { runCompute } from 'cerebral/test';

import { formattedCaseDetail, formatYearAmounts } from './formattedCaseDetail';

describe('formattedCaseDetail', () => {
  it('should convert the status to general docket when it is general', async () => {
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          status: 'general',
        },
      },
    });
    expect(result.status).toEqual('general docket');
  });
});

describe('formatYearAmounts', () => {
  it('does not return 2018 when a blank string is passed in', () => {
    const caseDetail = {
      yearAmounts: [
        {
          year: '2000',
          amount: '',
        },
        {
          year: '',
          amount: '',
        },
      ],
    };
    formatYearAmounts(caseDetail);
    expect(caseDetail.yearAmountsFormatted).toEqual([
      { amount: '', formattedYear: '2000', showError: false, year: '2000' },
      { amount: '', formattedYear: 'Invalid date', showError: false, year: '' },
    ]);
  });

  it('does not return 2018 when a blank string is passed in', () => {
    const caseDetail = {
      yearAmounts: [
        {
          year: '2000',
          amount: '',
        },
        {
          year: '5000-12-24T00:00:00.000Z',
          amount: '',
        },
      ],
    };
    const caseDetailErrors = {
      yearAmounts: [{ index: 1, year: 'year can not be in future' }],
    };
    formatYearAmounts(caseDetail, caseDetailErrors);
    expect(caseDetail.yearAmountsFormatted).toEqual([
      { amount: '', formattedYear: '2000', showError: false, year: '2000' },
      {
        amount: '',
        errorMessage: 'year can not be in future',
        formattedYear: '5000',
        showError: true,
        year: '5000',
      },
    ]);
  });
});
