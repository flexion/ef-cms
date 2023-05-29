import { Blob } from 'blob-polyfill';
import JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * A custom JSDOM environment to set the TextEncoder
 */
// eslint-disable-next-line import/no-default-export
export default class JsdomWithTextEncoderEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    this.global.Blob = Blob;
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
  }
}
