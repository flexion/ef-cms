import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateContactAction } from '../actions/validateContactAction';

export const validateContactSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [validateContactAction, { error: [], success: [] }],
  },
];
