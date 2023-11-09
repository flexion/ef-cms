import { CUSTOM_CASE_INVENTORY_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import {
  CustomCaseInventoryReportFilters,
  GetCaseInventoryReportRequest,
  GetCaseInventoryReportResponse,
} from '../../../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCustomCaseInventoryReportAction } from './getCustomCaseInventoryReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCustomCaseInventoryReportAction', () => {
  const lastCaseId = 8291;
  let mockCustomCaseReportResponse: GetCaseInventoryReportResponse;
  let filterValues: CustomCaseInventoryReportFilters;
  let expectedRequest: GetCaseInventoryReportRequest;

  beforeEach(() => {
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId,
      totalCount: 0,
    };

    applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );

    presenter.providers.applicationContext = applicationContext;
    filterValues = {
      caseStatuses: ['Assigned - Case'],
      caseTypes: ['Deficiency'],
      endDate: '05/14/2022',
      filingMethod: 'electronic',
      highPriority: true,
      judges: ['Colvin'],
      preferredTrialCities: ['Jackson, Mississippi'],
      procedureType: 'All',
      startDate: '05/10/2022',
    };

    expectedRequest = {
      ...filterValues,
      endDate: '2022-05-15T03:59:59.999Z',
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
      searchAfter: 0,
      startDate: '2022-05-10T04:00:00.000Z',
    };
  });

  it('should get the custom case inventory report with filter values that the user has selected', async () => {
    const result = await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseInventory: {
          filters: filterValues,
          lastIdsOfPages: [0],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
    expect(result.state.customCaseInventory.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseInventory.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseInventory.lastIdsOfPages).toMatchObject([
      0,
      lastCaseId,
    ]);
  });

  it('should populate page ID tracking array when navigating to later pages', async () => {
    const page2SearchId = 9001;
    mockCustomCaseReportResponse = {
      foundCases: [],
      lastCaseId: page2SearchId,
      totalCount: 0,
    };
    applicationContext
      .getUseCases()
      .getCustomCaseInventoryReportInteractor.mockResolvedValue(
        mockCustomCaseReportResponse,
      );
    const page1SearchId = 123;
    const expectedRequestWithSearchAfter = {
      ...expectedRequest,
      searchAfter: page1SearchId,
    };

    const result = await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 1,
      },
      state: {
        customCaseInventory: {
          filters: filterValues,
          lastIdsOfPages: [0, page1SearchId],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequestWithSearchAfter);
    expect(result.state.customCaseInventory.cases).toEqual(
      mockCustomCaseReportResponse.foundCases,
    );
    expect(result.state.customCaseInventory.totalCases).toEqual(
      mockCustomCaseReportResponse.totalCount,
    );
    expect(result.state.customCaseInventory.lastIdsOfPages).toMatchObject([
      0,
      page1SearchId,
      page2SearchId,
    ]);
  });

  it('should remove the high priority filter when the value is false', async () => {
    await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseInventory: {
          filters: { ...filterValues, highPriority: false },
          lastIdsOfPages: [0],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      ...expectedRequest,
      highPriority: undefined,
    });
  });

  it('should not format the start or end date if they have not been selected', async () => {
    filterValues.startDate = '';
    filterValues.endDate = '';

    expectedRequest.startDate = '';
    expectedRequest.endDate = '';

    await runAction(getCustomCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: 0,
      },
      state: {
        customCaseInventory: {
          filters: filterValues,
          lastIdsOfPages: [0],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getCustomCaseInventoryReportInteractor,
    ).toHaveBeenCalledWith(expect.anything(), expectedRequest);
  });
});
