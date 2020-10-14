const axios = require('axios');
const parse = require('csv-parse');
const { gatherRecords, getCsvOptions } = require('../shared/src/tools/helpers');
const { getServices, getToken, readCsvFile } = require('./importHelpers');

const CSV_HEADERS = [
  'name',
  'judgeTitle',
  'judgeFullName',
  'email',
  'role',
  'section',
];

if (!process.env.ENV) {
  process.env.ENV = process.argv[1];
}

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
            endpoint = 'http://localhost:4000/judges';
          } else {
            const services = await getServices();
            endpoint = `${
              services[`gateway_api_${process.env.DEPLOYING_COLOR}`]
            }/judges`;
          }

          const result = await axios.post(
            endpoint,
            { user: row },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (result.status === 200) {
            console.log(`SUCCESS ${row.name}`);

            const lowerCaseName = row.name.toLowerCase();
            const { userId } = result.data;
            outputMap[lowerCaseName] = userId;
          } else {
            console.log(`ERROR ${row.name}`);
            console.log(result);
          }
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

(async () => {
  const file = process.argv[2];
  if (file && !process.env.test) {
    const outputMap = {};
    await init(file, outputMap);
    console.log('Judges Map: ', outputMap);
  }
})();

module.exports = {
  CSV_HEADERS,
  init,
};
