const { DocketRecord } = require('./DocketRecord');

describe('DocketRecord', () => {
  describe('validation', () => {
    it('fails validation if a filingDate is in the future.', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          eventCode: 'O',
          filingDate: new Date('9000-01-01').toISOString(),
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('passes validation if a filingDate is not in the future', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          eventCode: 'O',
          filingDate: new Date('2000-01-01').toISOString(),
          index: 0,
        }).isValid(),
      ).toBeTruthy();
    });

    it('fails validation if a filingDate is omitted', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          eventCode: 'O',
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if a description is omitted', () => {
      expect(
        new DocketRecord({
          eventCode: 'O',
          filingDate: new Date('2000-01-01').toISOString(),
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if an eventCode is omitted', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          filingDate: new Date('2000-01-01').toISOString(),
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if an index is omitted', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          eventCode: 'O',
          filingDate: new Date('2000-01-01').toISOString(),
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if nothing is passed in', () => {
      expect(new DocketRecord({}).isValid()).toBeFalsy();
    });

    it('required messages display for required fields when an empty docket record is validated', () => {
      expect(new DocketRecord({}).getFormattedValidationErrors()).toEqual({
        description: '"description" is required',
        eventCode: '"eventCode" is required',
        filingDate: '"filingDate" is required',
        index: '"index" is required',
      });
    });
  });
});
