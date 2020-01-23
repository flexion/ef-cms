const { DocketRecord } = require('./DocketRecord');

describe('DocketRecord', () => {
  describe('validation', () => {
    it('fails validation if a description is omitted', () => {
      expect(
        new DocketRecord({
          eventCode: 'O',
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if an eventCode is omitted', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          index: 0,
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if an index is omitted', () => {
      expect(
        new DocketRecord({
          description: 'Test Docket Record',
          eventCode: 'O',
        }).isValid(),
      ).toBeFalsy();
    });

    it('fails validation if nothing is passed in', () => {
      expect(new DocketRecord({}).isValid()).toBeFalsy();
    });

    it('required messages display for required fields when an empty docket record is validated', () => {
      expect(new DocketRecord({}).getFormattedValidationErrors()).toEqual({
        description: 'Enter a description',
        eventCode: 'Enter an event code',
        index: 'Enter an index',
      });
    });
  });
});
