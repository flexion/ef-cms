const joi = require('joi-browser');
const {
  addPropertyHelper,
  makeRequiredHelper,
} = require('./externalDocumentHelpers');

describe('external document helpers', () => {
  describe('addPropertyHelper', () => {
    it('should add a property to the schema without a custom error message', () => {
      const schema = {
        something: true,
      };
      addPropertyHelper({
        itemName: 'somethingElse',
        itemSchema: false,
        schema,
      });
      expect(schema.somethingElse).toEqual(false);
    });

    it('should add a property to the schema and a custom error message to the error message map', () => {
      const schema = {
        something: true,
      };
      const errorToMessageMap = {
        something: 'You had an error with something.',
      };
      addPropertyHelper({
        errorToMessageMap,
        itemErrorMessage: 'You had an error with something else.',
        itemName: 'somethingElse',
        itemSchema: false,
        schema,
      });
      expect(schema.somethingElse).toEqual(false);
      expect(errorToMessageMap.somethingElse).toEqual(
        'You had an error with something else.',
      );
    });
  });

  describe('makeRequiredHelper', () => {
    it('should make an optional field required', () => {
      const schema = {
        something: joi.string().required(),
      };
      const schemaOptionalItems = {
        somethingElse: joi.string(),
      };
      makeRequiredHelper({
        itemName: 'somethingElse',
        schema,
        schemaOptionalItems,
      });
      expect(schema.somethingElse).toEqual(joi.string().required());
    });

    it('should make an optional field required', () => {
      const schema = {
        something: joi.string().required(),
      };
      const schemaOptionalItems = {
        somethingElse: joi.string(),
      };
      makeRequiredHelper({
        itemName: 'somethingElse2',
        schema,
        schemaOptionalItems,
      });
      expect(schema.somethingElse2).toEqual(undefined);
    });
  });
});
