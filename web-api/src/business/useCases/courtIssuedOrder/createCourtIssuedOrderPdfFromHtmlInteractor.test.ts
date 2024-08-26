import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from './createCourtIssuedOrderPdfFromHtmlInteractor';

describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  const mockPdfUrl = 'www.example.com';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Dr. Leo Marvin, Petitioner',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45W',
      });

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);

    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '321',
    });
  });

  it('throws an error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '432',
    });

    await expect(
      createCourtIssuedOrderPdfFromHtmlInteractor(
        applicationContext,
        {} as any,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('fetches the case by id', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers: [],
    } as any);
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('calls the pdf document generator function', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers: [],
    } as any);
    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          docketNumberWithSuffix: '123-45W',
        }),
      }),
    );
  });

  it('returns the pdf url from the temp documents bucket', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        addedDocketNumbers: [],
      } as any,
    );

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalledWith(expect.objectContaining({ useTempBucket: true }));
    expect(result).toEqual(mockPdfUrl);
  });

  it('calls the generate the order pdf with the defined addedDocketNumbers', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        addedDocketNumbers: ['101-20'],
      } as any,
    );

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ addedDocketNumbers: ['101-20'] }),
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });

  it('calls the generate the order pdf with the defined name and title of the clerk for NOT event codes', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor(
      applicationContext,
      {
        addedDocketNumbers: [],
        eventCode: 'NOT',
      } as any,
    );

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nameOfClerk: 'James Bond',
          titleOfClerk: 'Clerk of the Court (Interim)',
        }),
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });

  it('calls the generate the order pdf WITHOUT a defined name or title of the clerk for non-NOT event codes', async () => {
    await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers: [],
      eventCode: 'O',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getConfigurationItemValue,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getDocumentGenerators().order,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nameOfClerk: '',
          titleOfClerk: '',
        }),
      }),
    );
  });

  describe('BUG: Order the Docket Numbers', () => {
    it('should order the docket numbers correctly by year and index', async () => {
      await createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
        addedDocketNumbers: [
          '101-24',
          '101-19',
          '103-19',
          '101-26',
          '101-16',
          '102-19',
          '101-20',
        ],
      } as any);

      const orderCalls =
        applicationContext.getDocumentGenerators().order.mock.calls;
      expect(orderCalls.length).toEqual(1);
      expect(orderCalls[0][0].data.addedDocketNumbers).toEqual([
        '101-16',
        '101-19',
        '102-19',
        '103-19',
        '101-20',
        '101-24',
        '101-26',
      ]);
    });
  });
});
