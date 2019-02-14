const { redirect, handle, getAuthHeader, getUserFromAuthHeader } = require('./apiGatewayHelper');
const expect = require('chai').expect;
const {
  UnauthorizedError,
  NotFoundError,
} = require('ef-cms-shared/src/errors/errors');

const EXPECTED_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Pragma': 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

describe('handle', () => {
  it('should return an object representing an 200 status back if the callback function executes successfully', async () => {
    const response = await handle(async () => 'success');
    expect(response).to.deep.equal({
      statusCode: '200',
      body: JSON.stringify('success'),
      headers: EXPECTED_HEADERS,
    });
  });

  it('should return an object representing an 404 status if the function returns a NotFoundError', async () => {
    const response = await handle(async () => {
      throw new NotFoundError('not-found error');
    });
    expect(response).to.deep.equal({
      statusCode: 404,
      body: JSON.stringify('not-found error'),
      headers: EXPECTED_HEADERS,
    });
  });

  it('should return an object representing an 403 status if the function returns an UnauthorizedError', async () => {
    const response = await handle(async () => {
      throw new UnauthorizedError('unauthorized error');
    });
    expect(response).to.deep.equal({
      statusCode: 403,
      body: JSON.stringify('unauthorized error'),
      headers: EXPECTED_HEADERS,
    });
  });

  it('should return an object representing an 400 status if the function returns an Error', async () => {
    const response = await handle(async () => {
      throw new Error('other error');
    });
    expect(response).to.deep.equal({
      statusCode: '400',
      body: JSON.stringify('other error'),
      headers: EXPECTED_HEADERS,
    });
  });
});

describe('getAuthHeader', () => {
  it('should return the user token from the authorization header', () => {
    const response = getAuthHeader({
      headers: {
        Authorization: 'Bearer taxpayer',
      },
    });
    expect(response).to.deep.equal('taxpayer');
  });

  it('should return the user token from the authorization header (lowercase a in authorization)', () => {
    const response = getAuthHeader({
      headers: {
        authorization: 'Bearer taxpayer',
      },
    });
    expect(response).to.deep.equal('taxpayer');
  });

  it('should return the user token from the Authorization header #2', () => {
    let error;
    try {
      getAuthHeader({
        headers: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.undefined;
  });

  it('should return the user token from the Authorization header #3', () => {
    let error;
    try {
      getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.undefined;
  });

  it('should return the user token from the Authorization header query string params', () => {
    let error;
    let response;
    try {
      response = getAuthHeader({
        headers: {
          Authorization: 'bearer ',
        },
        queryStringParameters: {
          token: 'teoken'
        }
      });
    } catch (err) {
      error = err;
    }
    expect(response).equal('teoken');
    expect(error).equal(undefined);
  });
});

describe('getUserFromAuthHeader', () => {
  const token = 'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2dhcEEyWk1XcGxudnFaRHhGWUVzUSIsInN1YiI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfN3VSa0YwQXhuIiwiY29nbml0bzp1c2VybmFtZSI6ImE0NmFmZTYwLWFkM2EtNDdhZS1iZDQ5LTQzZDZkNjJhYTQ2OSIsImF1ZCI6IjZ0dTZqMXN0djV1Z2N1dDdkcXNxZHVybjhxIiwiZXZlbnRfaWQiOiIzMGIwYjJiMi0zMDY0LTExZTktOTk0Yi03NTIwMGE2ZTQ3YTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU1MDE1NDI0OCwibmFtZSI6IlRlc3QgUGV0aXRpb25lciIsImV4cCI6MTU1MDE1Nzg0OCwiY3VzdG9tOnJvbGUiOiJwZXRpdGlvbmVyIiwiaWF0IjoxNTUwMTU0MjQ4LCJlbWFpbCI6InBldGl0aW9uZXIxQGV4YW1wbGUuY29tIn0.KBEzAj84SV6Pulu9SEjGqbIPtL_iAeC-Tcc3fvphZ_nLHuIgN7LRv8pM-ClMM3Sua5YVQ7h70N1wRV0UZADxHiEDN5pYshcsjhZdnT9sWN9Nu5QT4l9e1zFsgu1S_p9M29i0__si674VT16hlXHCywrrqrofaJYZgMVXjvfEKYDmUo4XPCGN0GVFtt9sepxjAwd5rRIF9Ned3XGBQ2xrQd5qWlIMsvnhdlIL9FqvC47_ZsPh16IyREp7FDAEI5LxIkJOFE2Ryoe74cg_9nIaqP3rQsRrRMk7E_mQ9yGV4_2j4PEfoehm3wHbrGvhNFdDBDMosS3OfbUY411swAAh3Q';
  it('should return the user from the authorization header', () => {
    const user = getUserFromAuthHeader({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(user.name).to.equal('Test Petitioner');
  });

});

describe('redirect', () => {
  it('should return a redirect status in the header', async () => {
    const response = await redirect(async () => ({ url: 'example.com' }));
    expect(response).to.deep.equal({
      statusCode: 302,
      headers: {
        Location: 'example.com',
      },
    });
  });

  it('should return error object on errors', async () => {
    const response = await redirect(async () => {
      throw new Error('an error');
    });
    expect(response).to.deep.equal({
      statusCode: '400',
      body: JSON.stringify('an error'),
      headers: EXPECTED_HEADERS,
    });
  });
});
