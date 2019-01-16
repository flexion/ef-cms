const sinon = require('sinon');
const { sendToIRS } = require('./irsGateway');

describe('irsGateway', () => {
  beforeEach(() => {
    sinon.stub(global.Date.prototype, 'toISOString').returns('somedatestring');
  });

  afterEach(() => {
    global.Date.prototype.toISOString.restore();
  });

  it('returns a date', async () => {
    const result = await sendToIRS();
    expect(result).toEqual('somedatestring');
  });
});
