const assert = require('assert');

const Case = require('./Case');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const DATE = '2018-12-17T15:33:23.492Z';
const sinon = require('sinon');

const A_VALID_CASE = {
  docketNumber: '101-18',
  documents: MOCK_DOCUMENTS,
};

describe('Case entity', () => {
  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(A_VALID_CASE);
      assert.ok(myCase.isValid());
    });

    it('Creates a valid case from an already existing case json', () => {
      const previouslyCreatedCase = {
        caseId: '241edd00-1d94-40cd-9374-8d1bc7ae6d7b',
        createdAt: '2018-11-21T20:58:28.192Z',
        status: 'new',
        docketNumber: '101-18',
        documents: A_VALID_CASE.documents,
      };
      const myCase = new Case(previouslyCreatedCase);
      assert.ok(myCase.isValid());
    });

    it('adds a paygov date to an already existing case json', () => {
      const previouslyCreatedCase = {
        caseId: '241edd00-1d94-40cd-9374-8d1bc7ae6d7b',
        createdAt: '2018-11-21T20:58:28.192Z',
        status: 'new',
        documents: A_VALID_CASE.documents,
        payGovId: '1234',
        docketNumber: '101-18',
      };
      const myCase = new Case(previouslyCreatedCase);
      assert.ok(myCase.isValid());
      assert.ok(myCase.payGovDate);
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({
        documents: [
          {
            documentId: '123',
            documentType: 'testing',
          },
        ],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({
        documents: [],
      });
      assert.ok(!myCase.isValid());
    });

    it('Creates an invalid case', () => {
      const myCase = new Case({});
      assert.ok(!myCase.isValid());
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error = null;
      try {
        new Case(A_VALID_CASE).validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error === null);
    });

    it('should throw an error on invalid cases', () => {
      let error = null;
      try {
        new Case({}).validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error !== null);
    });
  });

  describe('isValidCaseId', () => {
    it('returns true if a valid uuid', () => {
      assert.ok(Case.isValidCaseId('c54ba5a9-b37b-479d-9201-067ec6e335bb'));
    });

    it('returns false if a invalid uuid', () => {
      assert.equal(
        Case.isValidCaseId('XXX54ba5a9-b37b-479d-9201-067ec6e335bb'),
        false,
      );
    });
  });

  describe('isValidDocketNumber', () => {
    it('returns true if a valid docketNumber', () => {
      assert.ok(Case.isValidDocketNumber('00101-00'));
    });

    it('returns false if a invalid docketnumber', () => {
      assert.equal(Case.isValidDocketNumber('00'), false);
    });
  });

  describe('isPetitionPackageReviewed', () => {
    it('return true is all documents are validated', () => {
      const caseRecord = new Case(A_VALID_CASE);
      assert.ok(caseRecord.isPetitionPackageReviewed());
    });
  });

  describe('markAsSentToIRS', () => {
    it('sets irsSendDate', () => {
      const caseRecord = new Case(A_VALID_CASE);
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      assert.ok(caseRecord.irsSendDate);
    });
  });

  describe('markAsPaidByPayGov', () => {
    it('sets pay gov fields', () => {
      const caseRecord = new Case(A_VALID_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      assert.ok(caseRecord.payGovDate);
    });
  });

  describe('validateWithError', () => {
    it('passes back an error passed in if invalid', () => {
      let error = null;
      const caseRecord = new Case({});
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      assert.ok(error);
      expect(error.message).toContain('Imarealerror');
    });

    it('doesnt passes back an error passed in if valid', () => {
      let error = null;
      const caseRecord = new Case(A_VALID_CASE);
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      assert.ok(!error);
    });
  });

  describe('attachDocument', () => {
    beforeEach(() => {
      sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
    });

    afterEach(() => {
      window.Date.prototype.toISOString.restore();
    });

    it('should attach the document to the case', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachDocument({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
      });
      expect(caseToVerify.documents.length).toEqual(1);
      expect(caseToVerify.documents[0]).toEqual({
        documentType: 'Answer',
        documentId: '123',
        userId: 'respondent',
        filedBy: 'Respondent',
        createdAt: DATE,
        workItems: [],
      });
    });
  });
});
