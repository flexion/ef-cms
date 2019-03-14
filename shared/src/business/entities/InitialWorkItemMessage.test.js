const { InitialWorkItemMessage } = require('./InitialWorkItemMessage');

describe('InitialWorkItemMessage', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const message = new InitialWorkItemMessage({});
      expect(message.getFormattedValidationErrors().message).toEqual(
        'Message is a required field.',
      );
      expect(message.getFormattedValidationErrors().assigneeId).toEqual(
        'Recipient is a required field.',
      );
      expect(message.getFormattedValidationErrors().section).toEqual(
        'Section is a required field.',
      );
    });

    it('should be valid when all fields are present', () => {
      const message = new InitialWorkItemMessage({
        assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'hello world',
        section: 'docket',
      });
      expect(message.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
