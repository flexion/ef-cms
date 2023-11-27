import JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * A custom JSDOM environment to set the TextEncoder
 */
// eslint-disable-next-line import/no-default-export
export default class JsdomWithTextEncoderEnvironment extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }

    this.global.fetch = fetch;
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
  }
}
