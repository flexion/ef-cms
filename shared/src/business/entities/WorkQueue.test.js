const {
  getSectionForRole,
  SENIOR_ATTORNEY_SECTION,
  DOCKET_SECTION,
} = require('./WorkQueue');

describe('WorkQueue', () => {
  describe('getSectionForRole', () => {
    it('returns the section for role', () => {
      expect(getSectionForRole('seniorattorney')).toEqual(
        SENIOR_ATTORNEY_SECTION,
      );
      expect(getSectionForRole('docketclerk')).toEqual(DOCKET_SECTION);
    });
  });
});
