const FormData = require('form-data');

global.FormData = FormData;

global.FakeFile = (data, name) => {
  const fakeFile = new Buffer(data || []);
  fakeFile.name = name;
  return fakeFile;
};
global.Blob = Buffer;
