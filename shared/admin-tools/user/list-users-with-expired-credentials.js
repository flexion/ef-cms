const {
  IAMClient,
  ListAccessKeysCommand,
  ListUsersCommand,
} = require('@aws-sdk/client-iam');
const { DateTime } = require('luxon');

const iamClient = new IAMClient({ region: 'us-east-1' });
const startOfCurrentQuarter = DateTime.fromObject({
  quarter: DateTime.now().quarter,
  year: DateTime.now().year,
});

/**
 * cycle through all of the users in the current AWS account and check the age of their credentials
 */
const checkUsers = async () => {
  const command = new ListUsersCommand({ MaxItems: 1000 });
  const { Users } = await iamClient.send(command);
  await Promise.all(Users.map(checkCredentialsForUser));
  return 'done';
};

/**
 * check to see if they have any expired credentials for the specified UserName
 *
 * @param {object} providers che providers array
 * @param {string} providers.UserName the unique identifier of the user to lookup
 */
const checkCredentialsForUser = async ({ UserName }) => {
  const command = new ListAccessKeysCommand({ UserName });
  const { AccessKeyMetadata } = await iamClient.send(command);

  const hasExpired =
    AccessKeyMetadata.map(({ CreateDate }) =>
      DateTime.fromJSDate(CreateDate),
    ).filter(
      dateObj => dateObj.startOf('day') < startOfCurrentQuarter.startOf('day'),
    ).length > 0;

  if (hasExpired) {
    console.log(`❗ ${UserName} has keys that are expired`);
  }
};

checkUsers().then(resp => {
  console.log(resp);
});
