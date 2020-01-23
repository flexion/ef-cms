const { PublicDocketRecordEntry } = require('./PublicDocketRecordEntry');

describe('PublicDocketRecordEntry', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocketRecordEntry({
      createdAt: 'testing',
      description: 'testing',
      documentId: 'testing',
      filedBy: 'testing',
      index: 'testing',
    });

    expect(entity.toRawObject()).toEqual({
      createdAt: 'testing',
      description: 'testing',
      documentId: 'testing',
      filedBy: 'testing',
      index: 'testing',
    });
  });
});
