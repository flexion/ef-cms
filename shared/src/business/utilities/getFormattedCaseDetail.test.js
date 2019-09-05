import { applicationContext } from '../../../../web-client/src/applicationContext';
import {
  formatCase,
  formatCaseDeadlines,
  formatDocument,
  getFilingsAndProceedings,
  getFormattedCaseDetail,
  sortDocketRecords,
} from './getFormattedCaseDetail';

const mockCaseDetailBase = {
  caseId: '123-456-abc-def',
  createdAt: new Date(),
  docketNumber: '123-45',
  docketNumberSuffix: 'S',
  irsSendDate: new Date(),
  payGovDate: new Date(),
  receivedAt: new Date(),
  trialDate: new Date(),
  trialSessionId: 'ts123',
};

describe('formatCase', () => {
  let mockCaseDetail;

  beforeEach(() => {
    mockCaseDetail = {
      ...mockCaseDetailBase,
    };
  });

  it('should return an empty object if caseDetail is empty', () => {
    const applicationContext = {};
    const caseDetail = {};
    const result = formatCase(applicationContext, caseDetail);

    expect(result).toMatchObject({});
  });

  it('should format documents if the case documents array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      documents: [
        {
          createdAt: new Date(),
          documentId: 'd-1-2-3',
          documentType: 'Petition',
          servedAt: new Date(),
        },
      ],
    });

    expect(result.documents[0]).toHaveProperty('createdAtFormatted');
    expect(result.documents[0]).toHaveProperty('servedAtFormatted');
    expect(result.documents[0]).toHaveProperty('showServedAt');
    expect(result.documents[0]).toHaveProperty('isStatusServed');
    expect(result.documents[0]).toHaveProperty('isPetition');
    expect(result.documents[0]).toHaveProperty('servedPartiesCode');
  });

  it('should format docket records if the case docket record array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      docketRecord: [
        {
          createdAt: new Date(),
          index: '1',
        },
      ],
    });

    expect(result.docketRecord[0]).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('docketRecordWithDocument');
  });

  it('should format respondents if the respondents array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      respondents: [
        {
          name: 'Test Respondent',
        },
      ],
    });

    expect(result.respondents[0].formattedName).toEqual('Test Respondent');
  });

  it('should format practitioners if the respondents array is set', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      practitioners: [
        {
          barNumber: 'b1234',
          name: 'Test Practitioner',
        },
      ],
    });

    expect(result.practitioners[0].formattedName).toEqual(
      'Test Practitioner (b1234)',
    );
  });

  it('should the case details', () => {
    const result = formatCase(applicationContext, {
      ...mockCaseDetail,
      hasVerifiedIrsNotice: true,
      caseCaption: 'Test Case Caption',
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('receivedAtFormatted');
    expect(result).toHaveProperty('irsDateFormatted');
    expect(result).toHaveProperty('payGovDateFormatted');
    expect(result.docketNumberWithSuffix).toEqual('123-45S');
    expect(result.irsNoticeDateFormatted).toEqual('No notice provided');
    expect(result.datePetitionSentToIrsMessage).toEqual(
      result.irsDateFormatted,
    );
    expect(result.shouldShowIrsNoticeDate).toBeTruthy();
    expect(result.caseName).toEqual('Test Case Caption');
    expect(result.formattedTrialCity).toEqual('Not assigned');
    expect(result).toHaveProperty('formattedTrialDate');
    expect(result.formattedTrialJudge).toEqual('Not assigned');
  });
});

describe('formatCaseDeadlines', () => {
  it('should call formatCaseDeadline on the given array', () => {
    const result = formatCaseDeadlines(applicationContext, [
      {
        deadlineDate: new Date(),
      },
    ]);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toHaveProperty('deadlineDateFormatted');
  });

  it('should set the caseDeadline to overdue if the deadlineDate is before today', () => {
    const result = formatCaseDeadlines(applicationContext, [
      {
        deadlineDate: '12/7/2017',
      },
    ]);
    expect(result[0]).toHaveProperty('overdue');
    expect(result[0]).toBeTruthy();
  });
});

describe('formatDocument', () => {
  it('should format the servedAt date', () => {
    const results = formatDocument(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
    });
    expect(results).toMatchObject({
      servedAtFormatted: '03/27/19 05:53 pm',
    });
  });

  it('should set the servedPartiesCode to `B` if status is served, servedAt date exists, and servedParties is an array', () => {
    const results = formatDocument(applicationContext, {
      servedAt: '2019-03-27T21:53:00.297Z',
      servedParties: ['someone', 'someone else'],
      status: 'served',
    });
    expect(results).toMatchObject({
      servedPartiesCode: 'B',
    });
  });
});

describe('getFilingsAndProceedings', () => {
  it('returns a value based on document properties (attachments, C/S, exhibits, objections, and lodged)', () => {
    const result = getFilingsAndProceedings({
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDateFormatted: '11/12/1999',
      exhibits: true,
      lodged: true,
      objections: 'Yes',
    });

    expect(result).toEqual(
      '(C/S 11/12/1999) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)',
    );
  });
});

describe('getFormattedCaseDetail', () => {
  it('should call formatCase and add additional details on the given case', () => {
    const result = getFormattedCaseDetail({
      applicationContext,
      caseDeadlines: [
        {
          deadlineDate: new Date(),
        },
      ],
      caseDetail: { ...mockCaseDetailBase },
      docketRecordSort: 'byDate',
    });

    expect(result).toHaveProperty('createdAtFormatted');
    expect(result).toHaveProperty('docketRecordWithDocument');
    expect(result).toHaveProperty('docketRecordSort');
    expect(result).toHaveProperty('caseDeadlines');
  });
});

describe('sortDocketRecords', () => {
  it('should sort docket records by date by default', () => {
    const result = sortDocketRecords([
      {
        index: '2',
        record: {
          filingDate: new Date(),
        },
      },
      {
        index: '1',
        record: {
          filingDate: new Date(),
        },
      },
    ]);

    expect(result[0].index).toEqual('2');
  });

  it('should sort docket records by index when sortBy is byIndex', () => {
    const result = sortDocketRecords(
      [
        {
          index: '2',
          record: {
            filingDate: new Date(),
          },
        },
        {
          index: '3',
          record: {
            filingDate: new Date(),
          },
        },
        {
          index: '1',
          record: {
            filingDate: new Date(),
          },
        },
      ],
      'byIndex',
    );

    expect(result[1].index).toEqual('2');
  });

  it('should sort docket records in reverse if Desc is included in sortBy', () => {
    const result = sortDocketRecords(
      [
        {
          index: '2',
          record: {
            filingDate: new Date(),
          },
        },
        {
          index: '3',
          record: {
            filingDate: new Date(),
          },
        },
        {
          index: '1',
          record: {
            filingDate: new Date(),
          },
        },
      ],
      'byIndexDesc',
    );

    expect(result[0].index).toEqual('3');
  });
});
