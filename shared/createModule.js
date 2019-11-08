/* eslint-disable spellcheck/spell-checker */
const fs = require('fs');

// USAGE EXAMPLE: node createModule.js path1/file1 path2/file2
const targets = [
  'shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.handlebars',
  'shared/src/business/useCaseHelper/caseConfirmation/caseConfirmation.scss',
  'shared/static/images/ustc_seal.png',
];

// const TEXT_FILES = ['txt', 'scss', 'html', 'hbars', 'handlebars'];
const BINARY_BASE64 = ['png'];

const createModule = filePath => {
  const contents = readFile(filePath);
  if (contents.indexOf("'") !== -1) {
    console.warn(
      `Content of ${filePath} contains single-quotes. Output is probably broken.`,
    );
    // maybe should escape them before writing module?
  }
  const theCode = `// This is a generated file, do not edit\nmodule.exports =\n  '${contents}';\n`;
  const outputPath = `${filePath}_.js`;
  console.info(outputPath);
  fs.writeFileSync(outputPath, theCode);
};

const readFile = filePath => {
  const isBase64 = BINARY_BASE64.some(extension =>
    filePath.endsWith(extension),
  );
  return fs.readFileSync(filePath, {
    encoding: isBase64 ? 'base64' : 'utf8',
  });
};

const files = [...targets, ...process.argv.slice(2)];
files.forEach(createModule);
// files.forEach(f => console.log(f));
