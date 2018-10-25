const aws = require('aws-sdk');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const createPolicyUrl = require('./createPolicyUrl');
const chai = require('chai');
chai.use(require('chai-string'));
const sinon = require('sinon');



const MOCK_RESPONSE = {
  "url": "https://s3.us-east-1.amazonaws.com/test",
  "fields": {
    "bucket": "test",
    "X-Amz-Algorithm": "a",
    "X-Amz-Credential": "b",
    "X-Amz-Date": "20181025T132750Z",
    "X-Amz-Security-Token": "c",
    "Policy": "d",
    "X-Amz-Signature": "e"
  }
}

describe('Create policy url', function() {
  let sandbox;
  before(function () {
    sandbox = sinon.createSandbox();
    process.env.DOCUMENTS_BUCKET_NAME = 'test';
    process.env.S3_ENDPOINT = 's3.us-east-1.amazonaws.com';

  });

  afterEach(function() {
    sandbox.restore();
  });

  [
    {
      httpMethod: 'GET'
    }

  ].forEach(function (policyUrlResponse) {

    it('should create a policyUrlResponse on a GET', function () {
      const createPresignedPost = sandbox.stub(aws.S3.prototype, 'createPresignedPost');
      createPresignedPost.yields(null, MOCK_RESPONSE);

      return lambdaTester(createPolicyUrl.create).
        event(policyUrlResponse).
        expectResult(result => {
          const data = JSON.parse(result.body);
          expect(data.url).to.equal(MOCK_RESPONSE.url);
        })
    });

    it('should return an error if S3 errors', function () {
      const createPresignedPost = sandbox.stub(aws.S3.prototype, 'createPresignedPost');
      createPresignedPost.yields(new Error('error'), {something: "test"});

      return lambdaTester(createPolicyUrl.create).
        event(policyUrlResponse)
        .expectResult(err => {
          expect(err.body).to.startsWith('\"error');
        });
    });
  });

});