import { EditPetitionerCounselFactory } from './EditPetitionerCounselFactory';

const errorMessages = EditPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES;

describe('EditPetitionerCounselFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = EditPetitionerCounselFactory({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: errorMessages.representing,
      });
    });

    it('should be valid if either representing has at least one entry', () => {
      let entity = EditPetitionerCounselFactory({
        representing: ['02323349-87fe-4d29-91fe-8dd6916d2fda'],
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representing is empty', () => {
      const entity = EditPetitionerCounselFactory({
        representing: [],
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: errorMessages.representing,
      });
    });
  });
});
