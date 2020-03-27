import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPDFForPreviewAction } from './getPDFForPreviewAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('getPDFForPreviewAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .loadPDFForPreviewInteractor.mockResolvedValue('fake file data');
  });

  it('returns original props if we already have what appears to be an actual file', async () => {
    const props = { file: { name: 'name of a file on a real file object' } };
    const result = await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(result.props).toEqual(props);
    expect(
      applicationContext.getUseCases().loadPDFForPreviewInteractor,
    ).not.toHaveBeenCalled();
  });

  it('returns results from loadPDFForPreviewInteractor if provided a caseId and documentId', async () => {
    const props = { file: { caseId: '123', documentId: '456' } };
    await runAction(getPDFForPreviewAction, {
      modules: {
        presenter,
      },
      props,
      state: {},
    });
    expect(
      applicationContext.getUseCases().loadPDFForPreviewInteractor,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseId: '123',
      documentId: '456',
    });
  });
});
