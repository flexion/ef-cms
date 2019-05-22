import { runAction } from 'cerebral/test';
import { setDocumentScenarioAction } from './setDocumentScenarioAction';

describe('setDocumentScenarioAction', () => {
  it('sets document scenario', async () => {
    const documentScenario = {
      category: 'Notice',
      documentTitle: 'Notice of Abatement of Jeopardy Assessment',
      documentType: 'Notice of Abatement of Jeopardy Assessment',
      eventCode: 'NAJA',
      labelFreeText: '',
      labelPreviousDocument: '',
      ordinalField: '',
      scenario: 'Standard',
    };

    const result = await runAction(setDocumentScenarioAction, {
      state: {
        constants: {
          CATEGORY_MAP: {
            Notice: [documentScenario],
          },
        },

        form: {
          category: 'Notice',
          documentType: 'Notice of Abatement of Jeopardy Assessment',
        },
      },
    });

    expect(result.state.form.scenario).toEqual(documentScenario.scenario);
    expect(result.state.form.documentTitle).toEqual(
      documentScenario.documentTitle,
    );
    expect(result.state.form.eventCode).toEqual(documentScenario.eventCode);
  });
});
