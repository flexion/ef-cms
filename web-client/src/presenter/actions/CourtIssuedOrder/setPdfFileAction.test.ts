import { PDF } from '../../../../../shared/src/business/entities/documents/PDF';
import { fakeBlob1 } from '../../../../../shared/src/business/test/getFakeFile';
import { runAction } from 'cerebral/test';
import { setPdfFileAction } from './setPdfFileAction';

describe('setPdfFileAction', () => {
  it('should create a PDF entity from props.pdfFile and set it on state', async () => {
    const result = await runAction(setPdfFileAction, {
      props: {
        pdfFile: fakeBlob1,
      },
    });

    expect(result.state.form.primaryDocumentFile).toEqual(new PDF(fakeBlob1));
  });
});
