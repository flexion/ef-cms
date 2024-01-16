const environment = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID!,
  S3_ENDPOINT: process.env.S3_ENDPOINT!,
  TEMP_DOCUMENTS_BUCKET_NAME: process.env.TEMP_DOCUMENTS_BUCKET_NAME!,
};

export function getEnv() {
  return environment;
}

export function setEnv(key: keyof typeof environment, value: string) {
  environment[key] = value;
}
