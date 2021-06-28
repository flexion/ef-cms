import { CerebralTest } from 'cerebral/test';
import {
  applicationContextForClient as applicationContext,
  testPdfDoc,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfSequence } from '../../sequences/PDFPreviewModal/loadPdfSequence';
import { presenter } from '../../presenter-mock';

describe('loadPdfSequence', () => {
  let integrationTest;

  global.Blob = function () {};

  const base64File = `data:application/pdf;base64,${Buffer.from(
    String.fromCharCode.apply(null, testPdfDoc),
  ).toString('base64')}`;

  const mocks = {
    readAsArrayBufferMock: jest.fn(function () {
      this.result = testPdfDoc;
      this.onload();
    }),
    readAsDataURLMock: jest.fn(function () {
      this.result = base64File;
      this.onload();
    }),
  };
  /**
   * Mock FileReader Implementation
   */
  function MockFileReader() {
    this.onload = null;
    this.onerror = null;
    this.readAsDataURL = mocks.readAsDataURLMock;
    this.readAsArrayBuffer = mocks.readAsArrayBufferMock;
  }

  beforeAll(() => {
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(),
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      createObjectURL: jest.fn().mockReturnValue('some url'),
    };
    presenter.sequences = {
      loadPdfSequence,
    };
    integrationTest = CerebralTest(presenter);
  });

  it('should load the expected objects onto the store', async () => {
    integrationTest.setState('pdfPreviewModal', {});

    await integrationTest.runSequence('loadPdfSequence', {
      file: testPdfDoc,
    });

    expect(integrationTest.getState('pdfPreviewUrl')).toBe('some url');
  });
});
