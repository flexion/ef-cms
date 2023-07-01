// import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
// import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
// import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
// import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
// import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
// import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
// import { loginAs, setupTest } from './helpers';
// import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
// import { runCompute } from '@web-client/presenter/test.cerebral';
// import { viewJudgeActivityReportResults } from './journey/viewJudgeActivityReportResults';
// import { withAppContextDecorator } from '../src/withAppContext';

// const judgeActivityReportHelper = withAppContextDecorator(
//   judgeActivityReportHelperComputed,
// );

// let closedCasesBefore = 0;

// describe('Judge activity report journey - Closed Cases Search', () => {
//   const cerebralTest = setupTest();

//   afterAll(() => {
//     cerebralTest.closeSocket();
//   });

//   loginAs(cerebralTest, 'judgecolvin@example.com');
//   it('should disable the submit button on initial page load when form has not yet been completed', async () => {
//     await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

//     const { isFormPristine, reportHeader } = runCompute(
//       judgeActivityReportHelper,
//       {
//         state: cerebralTest.getState(),
//       },
//     );

//     expect(isFormPristine).toBe(true);
//     expect(reportHeader).toContain('Colvin');
//   });

//   it('should display an error message when invalid dates are entered into the form', async () => {
//     await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
//       startDate: '--_--',
//     });

//     await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
//       endDate: 'yabbadabaadooooo',
//     });

//     await cerebralTest.runSequence('submitJudgeActivityReportSequence');

//     expect(cerebralTest.getState('validationErrors')).toEqual({
//       endDate: 'Enter a valid end date.',
//       startDate: 'Enter a valid start date.',
//     });
//   });

//   viewJudgeActivityReportResults(cerebralTest);
//   it('should set the ordersCountBefore', () => {
//     closedCasesBefore = cerebralTest.closedCasesTotal;
//   });

//   loginAs(cerebralTest, 'petitionsclerk@example.com');
//   petitionsClerkCreatesNewCase(cerebralTest);

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkCreatesAnOrder(cerebralTest, {
//     documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
//     eventCode: 'ODJ',
//     expectedDocumentType: 'Order of Dismissal for Lack of Jurisdiction',
//   });
//   docketClerkViewsDraftOrder(cerebralTest);
//   docketClerkSignsOrder(cerebralTest);
//   docketClerkAddsDocketEntryFromOrder(cerebralTest, 0, 'Colvin');
//   docketClerkServesDocument(cerebralTest, 0);

//   loginAs(cerebralTest, 'judgecolvin@example.com');
//   viewJudgeActivityReportResults(cerebralTest, { judgeName: 'All Judges' });
//   it('should increase the closed cases count for closed cases for all judges', () => {
//     const ordersCountAfter = cerebralTest.closedCasesTotal;
//     expect(ordersCountAfter).toEqual(closedCasesBefore + 1);
//   });
// });
