import { queryStringDecoder } from './queryStringDecoder';

describe('queryStringDecoder', () => {
  beforeAll(() => {
    global.window = Object.create(window);
    const url =
      'http://example.com/?code=CODE&token=TOKEN&path=BoulevardOfBrokenMemes';
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
      writable: true,
    });
  });

  it('should return code, path, and token from hash', () => {
    global.location = {
      hash: '#id_token=ID_TOKEN',
      search: '?code=CODE&token=TOKEN&path=BoulevardOfBrokenMemes',
    };

    const result = queryStringDecoder();

    expect(result.code).toEqual('CODE');
    expect(result.path).toEqual('BoulevardOfBrokenMemes');
    expect(result.token).toEqual('ID_TOKEN');
  });

  it('should return code and token from query with a default path of /', () => {
    global.location = {
      search: '?code=CODE&token=TOKEN',
    };

    const result = queryStringDecoder();

    expect(result.code).toEqual('CODE');
    expect(result.path).toEqual('/');
    expect(result.token).toEqual('TOKEN');
  });
});
