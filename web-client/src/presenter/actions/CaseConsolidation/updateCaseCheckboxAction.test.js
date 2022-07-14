import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { updateCaseCheckboxAction } from './updateCaseCheckboxAction';

describe('updateCaseCheckboxAction', () => {
  it("should flip the correct case's checked state", async () => {
    const unchangedCheckValue = true;
    const changedCheckValue = false;

    const customizedDocketNumberOne = '1337-42';
    const customizedDocketNumberTwo = '1234-42';

    const result = await runAction(updateCaseCheckboxAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              docketNumber: customizedDocketNumberOne,
              leadDocketNumber: customizedDocketNumberOne,
            },
            {
              ...MOCK_CASE,
              checked: changedCheckValue,
              leadDocketNumber: customizedDocketNumberOne,
            },
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              docketNumber: customizedDocketNumberTwo,
              leadDocketNumber: customizedDocketNumberOne,
            },
          ],
        },
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...MOCK_CASE,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          checked: unchangedCheckValue,
          docketNumber: customizedDocketNumberOne,
          leadDocketNumber: customizedDocketNumberOne,
        },
        {
          ...MOCK_CASE,
          checked: !changedCheckValue,
          leadDocketNumber: customizedDocketNumberOne,
        },
        {
          ...MOCK_CASE,
          checked: unchangedCheckValue,
          docketNumber: customizedDocketNumberTwo,
          leadDocketNumber: customizedDocketNumberOne,
        },
      ],
    });
  });

  it('should not flip the checked value of the lead case', async () => {
    const unchangedCheckValue = true;

    const customizedDocketNumberOne = '1337-42';

    const result = await runAction(updateCaseCheckboxAction, {
      props: {
        docketNumber: customizedDocketNumberOne,
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              docketNumber: customizedDocketNumberOne,
              leadDocketNumber: customizedDocketNumberOne,
            },
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              leadDocketNumber: customizedDocketNumberOne,
            },
          ],
        },
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...MOCK_CASE,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          checked: unchangedCheckValue,
          docketNumber: customizedDocketNumberOne,
          leadDocketNumber: customizedDocketNumberOne,
        },
        {
          ...MOCK_CASE,
          checked: unchangedCheckValue,
          leadDocketNumber: customizedDocketNumberOne,
        },
      ],
    });
  });
});
