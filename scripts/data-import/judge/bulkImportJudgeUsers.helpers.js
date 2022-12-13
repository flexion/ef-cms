const axios = require('axios');
const {
  gatherRecords,
  getCsvOptions,
} = require('../../../shared/src/tools/helpers');
const {
  getServices,
  getToken,
  readCsvFile,
} = require('../../../web-api/importHelpers');
const { parse } = require('csv-parse');

const CSV_HEADERS = [
  'name',
  'judgeTitle',
  'judgeFullName',
  'email',
  'role',
  'section',
];

const init = async (csvFile, outputMap) => {
  const csvOptions = getCsvOptions(CSV_HEADERS);
  let output = [];

  const token = await getToken();
  const data = readCsvFile(csvFile);
  const stream = parse(data, csvOptions);

  const processCsv = new Promise(resolve => {
    stream.on('readable', gatherRecords(CSV_HEADERS, output));
    stream.on('end', async () => {
      for (let row of output) {
        try {
          let endpoint;

          if (process.env.ENV === 'local') {
            endpoint = 'http://localhost:4000/users';
          } else {
            const services = await getServices();
            endpoint = `${
              services[`gateway_api_${process.env.DEPLOYING_COLOR}`]
            }/users`;
          }

          const result = await axios.post(
            endpoint,
            { ...row, password: process.env.DEFAULT_ACCOUNT_PASS },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          console.log(`SUCCESS ${row.name}`);
          const lowerCaseName = row.name.toLowerCase();
          const { userId } = result.data;
          outputMap[lowerCaseName] = userId;
        } catch (err) {
          console.log(`ERROR ${row.name}`);
          console.log(err);
        }
      }
      resolve();
    });
  });
  await processCsv;
};

module.exports = {
  CSV_HEADERS,
  init,
};
