import { FORMATS } from '@shared/business/utilities/DateHandler';
import { STATUS_REPORT_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { prepareStatusReportOrderResponseAction } from './prepareStatusReportOrderResponseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareStatusReportOrderResponseAction,', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  const statusReportFilingDate = '2024-07-04';
  const dueDate = '2024-08-04';
  const statusReportFilingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(statusReportFilingDate, FORMATS.MONTH_DAY_YEAR);
  const dueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(dueDate, FORMATS.MONTH_DAY_YEAR);
  const statusReportIndex = 4;
  const expectedFiledLine = `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is</p>`;

  it('prepare status report with no options selected', async () => {
    const result = await runAction(prepareStatusReportOrderResponseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          additionalOrderText: undefined,
          docketEntryDescription: 'Order',
          dueDate: undefined,
          jurisdiction: undefined,
          orderType: undefined,
          strickenFromTrialSessions: undefined,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.richText).toEqual(expectedFiledLine);
  });

  it('prepare status report with all options selected', async () => {
    const additionalOrderText = 'Test Additional Order Text';
    const jurisdiction =
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.retained;
    const orderType =
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.statusReport;
    const strickenFromTrialSessions = true;
    const expectedFullText = `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a further status report by ${dueDateFormatted}. It is further</p><p class="indent-paragraph">ORDERED that this case is stricken from the trial session. It is further</p><p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned. It is further</p><p class="indent-paragraph">ORDERED that Test Additional Order Text</p>`;

    const result = await runAction(prepareStatusReportOrderResponseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          additionalOrderText,
          dueDate,
          jurisdiction,
          orderType,
          strickenFromTrialSessions,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.richText).toEqual(expectedFullText);
  });

  it.each([
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions.allCasesInGroup,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in the lead case of the consolidated group (Index no. ${statusReportIndex}). For cause, it is</p>`,
    ],
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions.justThisCase,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p>`,
    ],
  ])(
    'should have correct output for lead case with issue order %s',
    async (input, output) => {
      const result = await runAction(prepareStatusReportOrderResponseAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketNumber: '101-01',
            leadDocketNumber: '101-01',
          },
          form: {
            issueOrder: input,
          },
          statusReportOrderResponse: {
            statusReportFilingDate,
            statusReportIndex,
          },
        },
      });

      expect(result.state.form.richText).toBe(output);
    },
  );

  it.each([
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.retained,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.</p>`,
    ],
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.jurisdictionOptions.restored,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that this case is restored to the general docket.</p>`,
    ],
  ])(
    'should have correct output for jurisdiction %s',
    async (input, output) => {
      const result = await runAction(prepareStatusReportOrderResponseAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {},
          form: {
            jurisdiction: input,
          },
          statusReportOrderResponse: {
            statusReportFilingDate,
            statusReportIndex,
          },
        },
      });

      expect(result.state.form.richText).toBe(output);
    },
  );

  it.each([
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.statusReport,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a further status report by ${dueDateFormatted}.</p>`,
    ],
    [
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.orderTypeOptions.stipulatedDecision,
      `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a status report or proposed stipulated decision by ${dueDateFormatted}.</p>`,
    ],
  ])('should have correct output for order type %s', async (input, output) => {
    const result = await runAction(prepareStatusReportOrderResponseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          dueDate,
          orderType: input,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.richText).toBe(output);
  });
});
