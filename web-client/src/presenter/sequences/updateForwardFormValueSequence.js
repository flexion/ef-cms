/* eslint-disable sort-keys-fix/sort-keys-fix */
import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { setForwardFormValueAction } from '../actions/ForwardForm/setForwardFormValueAction';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { setSectionAction } from '../actions/ForwardForm/setSectionAction';
import { clearSectionAction } from '../actions/ForwardForm/clearSectionAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';

export const updateForwardFormValueSequence = [
  runKeyPathAction,
  {
    section: [
      isChambersPathAction,
      {
        yes: [set(state.workItem.showChambersSelect, true), clearSectionAction],
        no: [
          set(state.workItem.showChambersSelect, false),
          setForwardFormValueAction,
          ...getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [setSectionAction, ...getUsersInSectionSequence],
    default: [setForwardFormValueAction],
  },
];
