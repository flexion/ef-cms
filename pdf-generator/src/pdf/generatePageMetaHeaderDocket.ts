import babelRegister from '@babel/register';

import { PageMetaHeaderDocket } from './PageMetaHeaderDocket.tsx';

import React from 'react';
import ReactDOM from 'react-dom/server';

babelRegister({
  extensions: [''],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

export const generatePageMetaHeaderDocket = ({ data = {} }: { data: any }) => {
  const reactComponent: any = PageMetaHeaderDocket;
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(reactComponent, data),
  );

  return componentTemplate;
};
