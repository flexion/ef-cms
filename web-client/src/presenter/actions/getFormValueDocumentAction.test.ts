import { getFormValueDocumentAction } from './getFormValueDocumentAction';
import { runAction } from 'cerebral/test';

describe('getFormValueDocumentAction', () => {
  const fakeFile = {
    name: 'petition',
    size: 100,
  };
  it('should return the document type and file as a key/value pair', async () => {
    const result = await runAction(getFormValueDocumentAction, {
      props: {
        documentType: 'petition',
        file: fakeFile,
      },
    });

    expect(result.output).toMatchObject({
      key: 'petition',
      value: fakeFile,
    });
  });
});
