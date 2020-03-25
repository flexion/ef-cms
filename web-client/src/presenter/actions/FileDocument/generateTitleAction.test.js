import { generateTitleAction } from './generateTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';

const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;
const { generateDocumentTitleInteractor } = applicationContext.getUseCases();

describe('generateTitleAction', () => {
  it('should call generateDocumentTitle with correct data for only a primary document', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
    await runAction(generateTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(generateDocumentTitleInteractor.mock.calls.length).toEqual(1);
    expect(
      generateDocumentTitleInteractor.mock.calls[0][0].documentMetadata
        .documentType,
    ).toEqual('Motion for Judgment on the Pleadings');
  });

  it('should call generateDocumentTitle with correct data for all documents', async () => {
    generateDocumentTitleInteractor.mockReturnValue(null);
    await runAction(generateTitleAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Protective Order Pursuant to Rule 103',
          secondaryDocument: {
            category: 'Motion',
            documentType: 'Motion for Entry of Decision',
          },
          secondarySupportingDocumentMetadata: {
            category: 'Application',
            documentType: 'Application for Waiver of Filing Fee',
          },
          supportingDocumentMetadata: {
            category: 'Motion',
            documentType: 'Motion for a New Trial',
          },
        },
      },
    });

    expect(
      generateDocumentTitleInteractor.mock.calls[0][0].documentMetadata
        .documentType,
    ).toEqual('Motion for Protective Order Pursuant to Rule 103');
    expect(
      generateDocumentTitleInteractor.mock.calls[1][0].documentMetadata
        .documentType,
    ).toEqual('Motion for Entry of Decision');
    expect(
      generateDocumentTitleInteractor.mock.calls[2][0].documentMetadata
        .documentType,
    ).toEqual('Motion for a New Trial');
    expect(
      generateDocumentTitleInteractor.mock.calls[3][0].documentMetadata
        .documentType,
    ).toEqual('Application for Waiver of Filing Fee');
  });
});
