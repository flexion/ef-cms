var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use(
  '/api',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/api': '',
    },
    target: 'http://127.0.0.1:3001',
  }),
);

app.use(
  '/cases',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/cases': '',
    },
    target: 'http://127.0.0.1:3002',
  }),
);

app.use(
  '/users',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/users': '',
    },
    target: 'http://127.0.0.1:3003',
  }),
);

app.use(
  '/documents',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/documents': '',
    },
    target: 'http://127.0.0.1:3004',
  }),
);

app.use(
  '/work-items',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/work-items': '',
    },
    target: 'http://127.0.0.1:3005',
  }),
);

app.use(
  '/sections',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/sections': '',
    },
    target: 'http://127.0.0.1:3006',
  }),
);

app.use(
  '/trial-sessions',
  proxy({
    logLevel: 'warn',
    pathRewrite: {
      '^/trial-sessions': '',
    },
    target: 'http://127.0.0.1:3007',
  }),
);

app.listen(3000);
