import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createOrderAction } from './createOrderAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('createOrderAction', () => {
  beforeAll(() => {
    window.DOMParser = class {
      constructor() {}
    };

    window.DOMParser.prototype.parseFromString = jest.fn().mockReturnValue({
      children: [{ innerHTML: '' }],
      querySelector: jest.fn().mockReturnValue({
        children: [{ innerHTML: '' }],
      }),
    });

    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('creates an order', async () => {
    const result = await runAction(createOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseCaption: 'Guy Fieri',
        },
      },
    });

    expect(applicationContextForClient.getCaseCaptionNames).toBeCalled();
    expect(applicationContextForClient.getPdfStyles).toBeCalled();
    expect(result.output.htmlString.indexOf('Guy Fieri')).toBeTruthy();
  });

  it('creates an order for a notice', async () => {
    applicationContextForClient.getClerkOfCourtNameForSigning.mockReturnValue(
      'Bobby Flay',
    );

    const result = await runAction(createOrderAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseCaption: 'Guy Fieri',
        },
        form: {
          eventCode: 'NOT',
        },
      },
    });

    expect(applicationContextForClient.getCaseCaptionNames).toBeCalled();
    expect(applicationContextForClient.getPdfStyles).toBeCalled();
    expect(
      applicationContextForClient.getClerkOfCourtNameForSigning,
    ).toBeCalled();
    expect(result.output.htmlString.indexOf('Guy Fieri')).toBeTruthy();
    expect(result.output.htmlString.indexOf('Bobby Flay')).toBeTruthy();
  });
});
