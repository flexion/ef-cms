const { fromPath } = require('pdf2pic');

const usage = () => {
  console.log(`Converts PDF documents to PNG images.

  Usage:

  $ npm run convert-pdf <PREFIX>
  
  - PREFIX: The specific PREFIX of the training data directory.

  Example:

  $ npm run convert-pdf sign-order
`);
  process.exit();
};

if (process.argv.length < 3) {
  usage();
}

const prefix = process.argv[2];

(async () => {
  // todo: read directory
  const files = [
    `${prefix}-1.pdf`,
    `${prefix}-2.pdf`,
    `${prefix}-3.pdf`,
    `${prefix}-4.pdf`,
    `${prefix}-5.pdf`,
    `${prefix}-6.pdf`,
    `${prefix}-7.pdf`,
  ];

  const options = {
    density: 100,
    format: 'png',
    height: 2200,
    saveFilename: undefined,
    savePath: `${prefix}/training/data`,
    width: 1700,
  };

  files.forEach(async filename => {
    options.saveFilename = filename.split('.')[0];

    const storeAsImage = fromPath(
      `./${prefix}/training/data/${filename}`,
      options,
    );

    await storeAsImage(1);
  });
})();
