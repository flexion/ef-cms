import { FunctionComponent } from 'react';
import { IReactComponent, connect as cerebralConnect } from '@cerebral/react';

type SequenceKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? R extends void
      ? K
      : never
    : never;
}[keyof T];

type ComputedKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? R extends void
      ? never
      : K
    : never;
}[keyof T];

type Computeds<T> = {
  [K in ComputedKeys<T>]: T[K] extends (...args: any[]) => infer R ? R : never;
};

type StateKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

type State<T> = Pick<T, StateKeys<T>>;
type Sequences<T> = Pick<T, SequenceKeys<T>>;

export const connect = cerebralConnect as unknown as <Deps>(
  depsMap: Deps,
  component: FunctionComponent<State<Deps> & Sequences<Deps> & Computeds<Deps>>,
) => IReactComponent;

type TPath = {
  [key: string]: TSequenceArray | Function;
};

export type TSequenceArray = Array<Function | TPath>;
