# How to run Artillery Performance Tests

## How to run the order tests

The order tests will only hit the order search endpoint.  Before you can run these tests, you'll need to populate the 
`tokens.csv` file.  Setup your ENV variables with the following to point to the ENV you want to test against:

- USER_POOL_ID
- CLIENT_ID
- DEFAULT_ACCOUNT_PASS
- REGION

After exporting those ENV variables, you can run the following script `cd artillery && ./generate-tokens.sh`.

This will create JWT tokens and put them in a `tokens.csv` file which is later used as an artillery payload.

`DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance:order`

## How to run the ES performance tests

The ES tests will hit a majority of our API endpoints that use elasticsearch behind the scenes.  You can run these tests via the following command:

`AUTH_TOKEN=XZYZ DEPLOYING_COLOR=green EFCMS_DOMAIN=mig.ef-cms.ustaxcourt.gov npm run test:performance`

## Further config

With each configuration `yml` file, you can define phases. With each phase, you can describe how long with `duration`, how many requests per second with `arrivalCount`, and a [fixed connection pool](https://artillery.io/docs/guides/guides/http-reference.html#Fixed-connection-pool) with `config.http.pool`. For example, the `private-advanced-order.yml` config has a `duration` of `300` with an `arrivalCount` of `50`:

```yml
  phases:
    - duration: 300
      arrivalCount: 50
      name: Sustained load
  payload:
    - path: "keywords.csv"
      fields:
        - "keyword"
    - path: "tokens.csv"
      fields:
        - "token"
  # http:
  #   pool: 10 # max number of users
```

We can uncomment out the `http` block to enable a fixed user pool size, but the requests per second will still be `50` and it will run the test for `300` seconds, or 5 minutes.

## Report

After the performance tests run, it will generate a report as well as a summary output to the console:

```
All virtual users finished
Summary report @ 10:23:54(-0500) 2021-09-03
  Scenarios launched:  50
  Scenarios completed: 50
  Requests completed:  50
  Mean response/sec: 0.18
  Response time (msec):
    min: 168
    max: 6458
    median: 1156.5
    p95: 4736
    p99: 6458
  Scenario counts:
    Advanced Order Search: 50 (100%)
  Codes:
    200: 50
  advanced-order-search:
    min: 317
    max: 6762
    median: 1366
    p95: 4940
    p99: 6762
  code 200 on advanced-order-search: 50
```

Each scenario's `flow` will have its own `name` broken down in the console below the metrics such as `response time` and `codes`. The report above shows you the following:

- `min` for minimum response time
- `max` for maxiumum response time
- `medium` for median response time
- `p95` for 95 percentile; this means that for 95% of virtual users in your report, the latency was 0.5ms or lower
- `p99` for 99 percentile; same as `p95` above, just for 99%

## Troubleshooting

If you continue to get an error with `An error occurred (NotAuthorizedException) when calling the AdminInitiateAuth operation: Incorrect username or password.`, make sure you surround the `DEFAULT_ACCOUNT_PASS` in single quotes if it has special characters. For example:

`export DEFAULT_ACCOUNT_PASS='1234$%'`