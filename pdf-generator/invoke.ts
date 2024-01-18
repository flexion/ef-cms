#!/bin/bash

import { payload as orderPayload } from './loadtests/fixtures/out';

const payloads = [
  JSON.stringify({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      footerHtml: '<div>footer<div>',
      headerHtml: '<div>header<div>',
      overwriteFooter: true,
    }),
  }),
  JSON.stringify({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      footerHtml: undefined,
      headerHtml: '<div>header<div>',
      overwriteFooter: true,
    }),
  }),
  JSON.stringify({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      footerHtml: '<div>footer<div>',
      headerHtml: undefined,
      overwriteFooter: true,
    }),
  }),
  JSON.stringify({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      overwriteFooter: true,
    }),
  }),
  JSON.stringify({
    body: JSON.stringify(orderPayload),
  }),
];

async function main() {
  for (const payload of payloads) {
    await fetch(
      'http://localhost:8333/2015-03-31/functions/function/invocations',
      {
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
      });
  }
}

main();
