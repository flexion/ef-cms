import { sequence } from 'cerebral';
import { setModalValueAction } from '../actions/setModalValueAction';

export const updateModalValueSequence = sequence<{
  key: string;
  value: any;
}>([setModalValueAction]);
