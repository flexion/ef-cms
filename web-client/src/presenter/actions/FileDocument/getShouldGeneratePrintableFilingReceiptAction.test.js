import { getShouldGeneratePrintableFilingReceiptAction } from './getShouldGeneratePrintableFilingReceiptAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let trueMock;
let falseMock;

describe('getShouldGeneratePrintableFilingReceiptAction', () => {
  beforeEach(() => {
    trueMock = jest.fn();
    falseMock = jest.fn();

    presenter.providers.path = {
      false: falseMock,
      true: trueMock,
    };
  });

  it('calls the false path if props.documentWithPendingAssociation is true', async () => {
    await runAction(getShouldGeneratePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentWithPendingAssociation: true,
      },
    });

    expect(falseMock).toHaveBeenCalled();
  });

  it('calls the false path if state.documentToEdit is set', async () => {
    await runAction(getShouldGeneratePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      state: {
        documentToEdit: {},
      },
    });

    expect(falseMock).toHaveBeenCalled();
  });

  it('calls the false path if props.documentsFiled is not set', async () => {
    await runAction(getShouldGeneratePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(falseMock).toHaveBeenCalled();
  });

  it('calls the true path if props.documentsFiled is set', async () => {
    await runAction(getShouldGeneratePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {},
      },
    });

    expect(trueMock).toHaveBeenCalled();
  });
});
