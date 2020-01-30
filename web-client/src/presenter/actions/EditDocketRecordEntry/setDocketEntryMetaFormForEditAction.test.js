const {
  deconstructDate,
} = require('../../../../../shared/src/business/utilities/DateHandler');
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDocketEntryMetaFormForEditAction } from './setDocketEntryMetaFormForEditAction';

describe('setDocketEntryMetaFormForEditAction', () => {
  let caseDetail;

  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUtilities: () => ({
        deconstructDate,
      }),
    };

    caseDetail = {
      docketNumber: '123-45',
      docketRecord: [
        {
          index: 1,
        },
        {
          documentId: '123',
          index: 2,
        },
        {
          documentId: '234',
          index: 3,
        },
      ],
      documents: [
        {
          documentId: '123',
          eventCode: 'O',
          lodged: false,
        },
        {
          certificateOfService: true,
          certificateOfServiceDate: '2020-02-02',
          documentId: '234',
          eventCode: 'A',
          filingDate: '2020-01-01',
          lodged: false,
        },
      ],
    };
  });

  it('populate state.form with the docket record meta based on the provided props.index', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 1,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({ index: 1 });
  });

  it('populate state.form with the docket record meta and associated document meta if the docket record has a document', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 2,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({
      documentId: '123',
      eventCode: 'O',
      index: 2,
      lodged: false,
    });
  });

  it('populate state.form with deconstructed certificateOfServiceDate and filingDate if present', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 3,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({
      certificateOfService: true,
      certificateOfServiceDate: '2020-02-02',
      certificateOfServiceDay: '2',
      certificateOfServiceMonth: '2',
      certificateOfServiceYear: '2020',
      documentId: '234',
      eventCode: 'A',
      filingDate: '2020-01-01',
      filingDateDay: '1',
      filingDateMonth: '1',
      filingDateYear: '2020',
      index: 3,
      lodged: false,
    });
  });
});
