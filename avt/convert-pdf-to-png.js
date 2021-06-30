const { fromPath } = require('pdf2pic');

(async () => {
  const files = [
    'sign-order-1.pdf',
    'sign-order-2.pdf',
    'sign-order-3.pdf',
    'sign-order-4.pdf',
    'sign-order-5.pdf',
    'sign-order-6.pdf',
    'sign-order-7.pdf',
  ];

  const options = {
    density: 100,
    format: 'png',
    height: 2200,
    saveFilename: undefined,
    savePath: './training-data/sign-order/',
    width: 1700,
  };

  files.forEach(async filename => {
    options.saveFilename = filename.split('.')[0];

    const storeAsImage = fromPath(
      `./training-data/sign-order/${filename}`,
      options,
    );

    await storeAsImage(1);
  });
})();
