const { ipLimiter } = require('./ipLimiter');

const {
  applicationContext,
} = require('../../../shared/src/business/test/createTestApplicationContext');

describe('ipLimiter', () => {
  let statusMock;
  let res;

  beforeEach(() => {
    statusMock = jest.fn(() => ({
      json: () => jest.fn(),
    }));
    res = {
      set: jest.fn(() => ({
        status: statusMock,
      })),
    };
  });

  it('should return a 429 response', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() + 1e6,
        id: 20,
      });
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(statusMock).toBeCalledWith(429);
    expect(next).not.toBeCalled();
  });

  it('should call next if limit is not reached', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() + 1e6,
        id: 0,
      });
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(next).toBeCalled();
  });

  it('should delete the limiter key if expires at is passed', async () => {
    const next = jest.fn();
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockReturnValue({
        expiresAt: Date.now() - 1e6,
        id: 30,
      });
    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
      },
      res,
      next,
    );
    expect(
      applicationContext.getPersistenceGateway().deleteKeyCount,
    ).toBeCalled();
    expect(next).toBeCalled();
  });

  it('should be able to be invoked exactly 15 times before locking next if limit is not reached', async () => {
    const next = jest.fn();
    let count = 0;
    applicationContext
      .getPersistenceGateway()
      .incrementKeyCount.mockImplementation(() => {
        return {
          expiresAt: Date.now() + 1e6,
          id: ++count,
        };
      });

    for (let i = 0; i < 15; i++) {
      await ipLimiter({ applicationContext, key: 'order-search' })(
        {
          apiGateway: {
            event: {
              requestContext: {
                identity: '127.0.0.1',
              },
            },
          },
        },
        res,
        next,
      );
    }

    await ipLimiter({ applicationContext, key: 'order-search' })(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext,
      },
      res,
      next,
    );

    expect(next).toBeCalledTimes(15);
    // the 16th call should have failed and not invoked next
    expect(next.mock.calls[15]).toBeUndefined();
    expect(statusMock.mock.calls[0]).toBeDefined();
  });
});
