import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsNoticeToCase = integrationTest => {
  return it('Petitions clerk adds Notice to case', async () => {
    await integrationTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'eventCode',
        value: 'NOT',
      },
    );

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Notice to Need a Nap',
      },
    );

    expect(integrationTest.getState('modal.documentType')).toEqual('Notice');

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test notice.</p>',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    // skip signing and go back to caseDetail
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: integrationTest.getState('caseDetail'),
      });

    const firstDraftDocument = first(draftDocuments);
    integrationTest.docketEntryId = firstDraftDocument
      ? firstDraftDocument.docketEntryId
      : undefined;

    if (firstDraftDocument) {
      expect(firstDraftDocument.signedAt).toBeTruthy(); // Notice should be implicitly signed.
    }

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
  });
};
