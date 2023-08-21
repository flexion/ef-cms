import { TSequenceArray } from '../shared.cerebral';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const showProgressSequenceDecorator = (
  actionsList: TSequenceArray,
): TSequenceArray => {
  const wrappedActions = [
    setWaitingForResponseAction,
    ...actionsList,
    unsetWaitingForResponseAction,
  ];
  return wrappedActions;
};
