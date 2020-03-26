import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { archiveDraftDocumentAction } from './archiveDraftDocumentAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('archiveDraftDocumentAction', () => {
  it('archives a drafted document successfully', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          caseId: 'abc-123ghadsf-zdasdf',
          documentId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'document-title-123',
      title: 'This document has been deleted:',
    });
  });

  it('archives a drafted document successfully, saves alerts for navigation, and returns caseId if state.archiveDraftDocument.redirectToCaseDetail is true', async () => {
    const result = await runAction(archiveDraftDocumentAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        archiveDraftDocument: {
          caseId: 'abc-123ghadsf-zdasdf',
          documentId: 'def-gfed213-441-abce-312f',
          documentTitle: 'document-title-123',
          redirectToCaseDetail: true,
        },
      },
    });

    expect(
      applicationContext.getUseCases().archiveDraftDocumentInteractor,
    ).toHaveBeenCalled();
    expect(result.state.alertSuccess).toMatchObject({
      message: 'document-title-123',
      title: 'This document has been deleted:',
    });
    expect(result.state.saveAlertsForNavigation).toEqual(true);
    expect(result.output.caseId).toEqual('abc-123ghadsf-zdasdf');
  });
});
