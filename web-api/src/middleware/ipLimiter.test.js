const { ipLimiter } = require('./ipLimiter');

describe('ipLimiter', () => {
  it('should return a 429 response', async () => {
    const next = jest.fn();
    const res = {
      status: jest.fn(() => ({
        json: () => jest.fn(),
      })),
    };
    let incrementKeyCountMock = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 20,
    });
    await ipLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
      },
      res,
      next,
    );
    expect(res.status).toBeCalledWith(429);
    expect(next).not.toBeCalled();
  });

  it('should call next if limit is not reached', async () => {
    const next = jest.fn();
    const res = {
      status: jest.fn(() => ({
        json: () => jest.fn(),
      })),
    };
    let incrementKeyCountMock = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() + 1e6,
      id: 0,
    });
    await ipLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: jest.fn(),
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
      },
      res,
      next,
    );
    expect(next).toBeCalled();
  });

  it('should delete the limiter key if expires at is passed', async () => {
    const next = jest.fn();
    const res = {
      status: jest.fn(() => ({
        json: () => jest.fn(),
      })),
    };
    let incrementKeyCountMock = jest.fn();
    const deleteKeyCountMock = jest.fn();
    incrementKeyCountMock.mockReturnValue({
      expiresAt: Date.now() - 1e6,
      id: 30,
    });
    await ipLimiter('order-search')(
      {
        apiGateway: {
          event: {
            requestContext: {
              identity: '127.0.0.1',
            },
          },
        },
        applicationContext: {
          getPersistenceGateway: () => ({
            deleteKeyCount: deleteKeyCountMock,
            incrementKeyCount: incrementKeyCountMock,
            setExpiresAt: jest.fn(),
          }),
        },
      },
      res,
      next,
    );
    expect(deleteKeyCountMock).toBeCalled();
    expect(next).toBeCalled();
  });
});
