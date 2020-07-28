import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

export const petitionsClerkCreateOrder = test => {
  return it('Petitions clerk creates order', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await test.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'My Awesome Order',
    });

    await test.runSequence('submitCreateOrderModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('gotoCreateOrderSequence', {
      docketNumber: test.docketNumber,
      documentTitle: test.getState('modal.documentTitle'),
      documentType: test.getState('modal.documentType'),
      eventCode: test.getState('modal.eventCode'),
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await test.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.documents').length).toEqual(3);

    const {
      draftDocuments,
    } = applicationContext.getUtilities().getFormattedCaseDetail({
      applicationContext,
      caseDetail: test.getState('caseDetail'),
    });

    test.documentId = first(draftDocuments)
      ? first(draftDocuments).documentId
      : undefined;
  });
};
