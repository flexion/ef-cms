import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export default [set(state.petition[props.key], props.value)];
