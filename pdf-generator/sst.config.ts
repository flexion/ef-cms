import { AsyncStack } from './stacks/AsyncStack';
import { SSTConfig } from 'sst';

// eslint-disable-next-line import/no-default-export
export default {
  config() {
    return {
      name: 'efcms',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(AsyncStack);
  },
} satisfies SSTConfig;
