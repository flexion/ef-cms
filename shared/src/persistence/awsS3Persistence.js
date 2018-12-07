const axios = require('axios');
const uuidv4 = require('uuid/v4');

/**
 * uploadPdf
 * @param policy
 * @param file
 * @returns {Promise<*>}
 */
exports.uploadPdf = async ({ policy, file }) => {
  const documentId = uuidv4();
  const formData = new FormData();
  formData.append('key', documentId);
  formData.append('X-Amz-Algorithm', policy.fields['X-Amz-Algorithm']);
  formData.append('X-Amz-Credential', policy.fields['X-Amz-Credential']);
  formData.append('X-Amz-Date', policy.fields['X-Amz-Date']);
  formData.append(
    'X-Amz-Security-Token',
    policy.fields['X-Amz-Security-Token'] || '',
  );
  formData.append('Policy', policy.fields.Policy);
  formData.append('X-Amz-Signature', policy.fields['X-Amz-Signature']);
  formData.append('Content-Type', 'application/pdf');
  formData.append('file', file, file.name || 'fileName');
  await axios.post(policy.url, formData, {
    headers: {
      /* eslint no-underscore-dangle: ["error", {"allow": ["_boundary"] }] */
      'content-type': `multipart/form-data; boundary=${formData._boundary}`,
    },
  });
  return documentId;
};

const getUploadPolicy = async ({ applicationContext }) => {
  const response = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/uploadPolicy`,
  );
  return response.data;
};

const getDownloadPolicy = async ({ applicationContext, documentId }) => {
  const {
    data: { url },
  } = await axios.get(
    `${applicationContext.getBaseUrl()}/documents/${documentId}/downloadPolicyUrl`,
  );
  return url;
};

exports.getDocument = async ({ applicationContext, documentId }) => {
  const url = await getDownloadPolicy({ applicationContext, documentId });
  const { data: fileBlob } = await axios({
    url,
    method: 'GET',
    responseType: 'blob',
  });
  return new Blob([fileBlob], { type: 'application/pdf' });
};

exports.uploadDocument = async ({ applicationContext, answerDocument }) => {
  const policy = await getUploadPolicy({ applicationContext });

  const answerDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      policy,
      file: answerDocument,
    });

  return answerDocumentId;
};

exports.uploadPdfsForNewCase = async ({
  applicationContext,
  caseInitiator,
  fileHasUploaded,
}) => {
  const policy = await getUploadPolicy({ applicationContext });

  const petitionDocumentId = await exports.uploadPdf({
    policy,
    file: caseInitiator.petitionFile,
  });
  fileHasUploaded();

  const requestForPlaceOfTrialDocumentId = await exports.uploadPdf({
    policy,
    file: caseInitiator.requestForPlaceOfTrial,
  });
  fileHasUploaded();

  const statementOfTaxpayerIdentificationNumberDocumentId = await exports.uploadPdf(
    {
      policy,
      file: caseInitiator.statementOfTaxpayerIdentificationNumber,
    },
  );
  fileHasUploaded();

  return {
    petitionDocumentId,
    requestForPlaceOfTrialDocumentId,
    statementOfTaxpayerIdentificationNumberDocumentId,
  };
};
