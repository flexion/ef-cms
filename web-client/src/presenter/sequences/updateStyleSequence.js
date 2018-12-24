import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

import applyStylesAction from '../actions/applyStylesAction';

export default [set(state.styles[props.key], props.value), applyStylesAction];
