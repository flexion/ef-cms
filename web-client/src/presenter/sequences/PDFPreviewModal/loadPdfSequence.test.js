import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

const mocks = {
  getDocumentMock: jest.fn(() => ({
    promise: Promise.resolve({
      getPage: async () => ({
        cleanup: () => null,
        getViewport: () => ({
          height: 100,
          width: 100,
        }),
        render: () => null,
      }),
      numPages: 5,
    }),
  })),
  readAsArrayBufferMock: jest.fn(function () {
    this.result = 'def';
    this.onload();
  }),
  readAsDataURLMock: jest.fn(function () {
    this.result = 'abc';
    this.onload();
  }),
};

presenter.providers.applicationContext = {
  ...applicationContext,
  getFileReader: () =>
    function () {
      this.onload = null;
      this.onerror = null;
      this.readAsDataURL = mocks.readAsDataURLMock;
      this.readAsArrayBuffer = mocks.readAsArrayBufferMock;
    },
  getPdfJs: () => ({
    getDocument: mocks.getDocumentMock,
  }),
};

test = CerebralTest(presenter);

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

describe('loadPdfSequence', () => {
  it('should load the expected objects onto the store and try to render the page into the context', async () => {
    test.setState('pdfPreviewModal', {});
    await test.runSequence('loadPdfSequence', {
      ctx: 'abc',
      file: fakeFile,
    });
    expect(test.getState('pdfPreviewModal')).toMatchObject({
      ctx: 'abc',
      currentPage: 1,
      height: 100,
      pdfDoc: { numPages: 5 },
      totalPages: 5,
      width: 100,
    });
  });
});
