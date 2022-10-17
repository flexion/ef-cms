import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAssociatedCasesForPetitionerAction } from './setAssociatedCasesForPetitionerAction';

describe('setAssociatedCasesForPetitionerAction', () => {
  const openCaseList = [
    {},
    {
      consolidatedCases: [
        { docketNumber: '101-22' },
        { docketNumber: '105-33' },
        { docketNumber: '435-22' },
      ],
    },
    {
      consolidatedCases: [
        { docketNumber: '325-19' },
        { docketNumber: '532-20' },
      ],
    },
    {},
  ];
  const expected = ['101-22', '105-33', '435-22', '325-19', '532-20'];

  it('should set the consolidated cases in state', async () => {
    const result = await runAction(setAssociatedCasesForPetitionerAction, {
      modules: {
        presenter,
      },
      props: { openCaseList },
    });

    expect(result.state.consolidatedCaseDocketNumbers).toEqual(
      expect.arrayContaining(expected),
    );
    expect(result.state.consolidatedCaseDocketNumbers).not.toEqual(
      expect.arrayContaining([undefined]),
    );
  });
});
