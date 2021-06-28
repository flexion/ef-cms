import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

export const associatedExternalUserViewsCaseDetailForOwnedCase =
  integrationTest => {
    return it('associated external user views case detail for owned case', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
        integrationTest.docketNumber,
      );

      const helper = runCompute(caseDetailHelper, {
        state: integrationTest.getState(),
      });
      expect(helper.showPetitionProcessingAlert).toBeFalsy();

      const headerHelper = runCompute(caseDetailHeaderHelper, {
        state: integrationTest.getState(),
      });
      expect(headerHelper.showExternalButtons).toBeTruthy();
    });
  };
