const {
  generateNoticeOfTrialIssuedTemplate,
} = require('./generateNoticeOfTrialIssuedTemplate');

const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const applicationContext = createApplicationContext({});

describe('generateNoticeOfTrialIssuedTemplate', () => {
  const caseDetail = {
    caseCaption: 'Test Case Caption',
    caseCaptionPostfix: 'Test Caption Postfix',
    docketNumber: '123-45',
    docketNumberSuffix: 'S',
  };

  it('Returns HTML with the given case and trial session data', async () => {
    const result = await generateNoticeOfTrialIssuedTemplate({
      applicationContext,
      content: {
        caption: caseDetail.caseCaption,
        captionPostfix: caseDetail.caseCaptionPostfix,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        trialInfo: {
          address1: '123 Some Street',
          address2: 'Courtroom 2',
          city: 'City',
          courthouseName: 'Courthouse 1',
          judge: { name: 'Test Judge' },
          postalCode: '12345',
          startDate: '2/2/2020',
          startTime: '10:00',
          state: 'ST',
        },
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('Courthouse 1')).toBeGreaterThan(-1);
    expect(result.indexOf('123 Some Street')).toBeGreaterThan(-1);
    expect(result.indexOf('Courtroom 2')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Judge')).toBeGreaterThan(-1);
    expect(result.indexOf('NOTICE SETTING CASE FOR TRIAL')).toBeGreaterThan(-1);
    expect(result.indexOf('beginning at 10:00 AM on 2/2/2020')).toBeGreaterThan(
      -1,
    );
  });
});
