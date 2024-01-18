#!/bin/bash

fetch('http://localhost:8333/2015-03-31/functions/function/invocations', {
  body: JSON.stringify({
    body: JSON.stringify({
      contentHtml:
        '<div style="color: black;">hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world<div>',
      displayHeaderFooter: true,
      docketNumber: '101-23',
      footerHtml: '<div>footer<div>',
      headerHtml: '<div>header<div>',
      overwriteFooter: true,
    }),
    payload: 'hello',
  }),
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'POST',
})
  .then(response => {
    return response.json();
  })
  .then(json => {
    console.log(json);
  });
