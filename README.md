# Electronic Filing / Case Management System

An as-yet-unnamed project by the [U.S. Tax Court](https://ustaxcourt.gov/), creating an open-source EF-CMS, which began in October 2018. **All work can be seen [in the staging branch](https://github.com/ustaxcourt/ef-cms/tree/staging).** For background, see [the RFQ to procure agile software development services](https://github.com/ustaxcourt/case-management-rfq).

#### develop

[![CircleCI](https://circleci.com/gh/flexion/ef-cms/tree/develop.svg?style=svg)](https://circleci.com/gh/flexion/ef-cms/tree/develop)

#### staging

[![CircleCI](https://circleci.com/gh/ustaxcourt/ef-cms/tree/staging.svg?style=svg)](https://circleci.com/gh/ustaxcourt/ef-cms/tree/staging)

API | Front-End | Shared Code
--- | --------- | -----------
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-api&metric=coverage)](https://sonarcloud.io/dashboard?id=ef-cms-api)<br>[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-api&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ef-cms-api)<br>[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-api&metric=security_rating)](https://sonarcloud.io/dashboard?id=ef-cms-api)<br> | [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-front-end&metric=coverage)](https://sonarcloud.io/dashboard?id=ef-cms-front-end)<br>[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-front-end&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ef-cms-front-end)<br>[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-front-end&metric=security_rating)](https://sonarcloud.io/dashboard?id=ef-cms-front-end)| [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-shared&metric=coverage)](https://sonarcloud.io/dashboard?id=ef-cms-shared)<br>[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-shared&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=ef-cms-shared)<br>[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ef-cms-shared&metric=security_rating)](https://sonarcloud.io/dashboard?id=ef-cms-shared)
    
[![Known Vulnerabilities](https://snyk.io//test/github/flexion/ef-cms/badge.svg?targetFile=package.json)](https://snyk.io//test/github/flexion/ef-cms?targetFile=package.json)

<a href="docs/images/screenshot-new-petition.png"><img src="docs/images/screenshot-new-petition.png" width="49%" style="float: left; border: 2px solid #000; margin: 0 4px;" /></a>
<a href="docs/images/screenshot-cases.png"><img src="docs/images/screenshot-cases.png" width="49%" style="float: left;" /></a>

<a href="docs/images/screenshot-docket-record.png"><img src="docs/images/screenshot-docket-record.png" width="49%" style="float: left;" /></a>
<a href="docs/images/screenshot-answer.png"><img src="docs/images/screenshot-answer.png" width="49%" style="float: left;" /></a>

The fork of this project in which the bulk of development is occurring is [Flexion’s fork](https://github.com/flexion/ef-cms).

Artifacts for ongoing development such as designs, research data, user workflows etc. are located in the [wiki](https://github.com/flexion/ef-cms/wiki).

## Technical overview

This is a React-based JavaScript application. It’s housed in a [monorepo](https://en.wikipedia.org/wiki/Monorepo) that contains the front end (`web-client/`) and the back end (`web-api/`), with a third project housing resources that are shared between the front and back ends (`shared/`). It’s architected for Amazon Web Services, with a strong reliance on [Lambda](https://aws.amazon.com/lambda/), scripted with Terraform. The project is heavily containerized, using Docker, and can be run locally, despite the serverless architecture. All CI/CD processes are found in `management/`. Deployment is done via CircleCI.

## Documentation

For documentation about the CI/CD setup, API, style guide, UX, code review, etc., see [docs/README.md](docs/README.md).

## AWS diagram

<a href="docs/images/aws-diagram.png"><img src="docs/images/aws-diagram.png" style="border: 2px solid #000; " /></a>

## Dependency diagrams

Client:
<a href="docs/images/client-dependencies.png"><img src="docs/images/client-dependencies.png" style="border: 2px solid #000; " /></a>

Server:
<a href="docs/images/server-dependencies.png"><img src="docs/images/server-dependencies.png" style="border: 2px solid #000; " /></a>

## Backlog

The backlog is stored [in GitHub Issues in Flexion’s repository](https://github.com/flexion/ef-cms/issues), _not_ on this repository. Although they can be viewed like any other GitHub issues, they are managed on a scrum board that requires the [ZenHub browser plugin](https://www.zenhub.com/) to see.

## Testing everything

To exercise the CI/CD pipeline locally, run the following:

`./test-all.sh`

This will run the linter, Shellcheck, audit, build, test, Cypress, Cerebral tests, Pa11y, etc. over all the components.

## Running / verifing the project via Docker

Assuming you have Docker installed, the following command will spin up a Docker container with the UI, API, local S3, local Dynamo, etc. all running inside it:

`./docker-run.sh`

- You can access the UI at http://localhost:1234
- You can access the API at http://localhost:3000
- You can access the DynamoDB shell at http://localhost:8000/shell
- You can access the DynamoDB admin UI at http://localhost:8001
- You can access S3 local at http://localhost:9000
- You can access the style guide at http://localhost:1234/style-guide

## Running this project locally without Docker

The EF-CMS is comprised of two components: the API and the UI. Both must be run in order to function.

### Prerequisites

- Node v10.15.3
- npm v6.4.1

### Setup

Both the front-end (`/web-client`) and API (`/web-api`) share code that exists in `/shared`. Before you can run either, you need to run `npm install` inside the top-level directory.

- `npm i`

#### Terminal A

- `npm run start:api`

##### Other Start Commands

- Run `cd web-client && npm start:client:no-scanner` to start the UI without Dynamsoft (or if you don't have a scanner)

#### Terminal B

- `npm run start:client`

## Login and test users

There are two login mechanisms available — the legacy mock login system, and a new one that emulates AWS Cognito.

### Mock login

You can log in using these usernames:

```
petitioner
petitionsclerk
petitionsclerk1
docketclerk
docketclerk1
respondent
respondent1 - respondent4
practitioner
practitioner1 - practitioner4
adc
judgeArmen
armensChambers
judgeAshford
ashfordsChambers
judgeBuch
buchsChambers
judgeCarluzzo
carluzzosChambers
judgeCohen
cohensChambers
admissionsclerk
calendarclerk
clerkofcourt
trialclerk
```

No password is required.

### AWS Cognito

To use Cognito, start the web client with `npm run dev:cognito` (instead of `npm start`) You can then log in with:

```
petitioner1@example.com – petitioner5@example.com
petitionsclerk1@example.com – petitionsclerk5@example.com
docketclerk1@example.com – docketclerk5@example.com
respondent1@example.com – respondent10@example.com
practitioner1@example.com – practitioner10@example.com
adc1@example.com – adc5@example.com
judgeArmen@example.com
judgeAshford@example.com
judgeBuch@example.com
judgeCarluzzo@example.com
judgeCohen@example.com
```

For a full list of available users, see [court_users.csv](web-api/court_users.csv)

The password for all accounts is:

`Testing1234$`

## Editor configuration

### Atom.io

Install the following for best results:

- https://atom.io/packages/language-javascript-jsx
- https://atom.io/packages/language-groovy
- https://atom.io/packages/linter-eslint
- https://atom.io/packages/prettier-atom (enable ESLint and StyleLint integrations in settings)

## Using the application with Internet Explorer 11

If using Internet Explorer 11 with Windows 7, [download and install Adobe Reader](https://get.adobe.com/reader/). This will permit PDFs to be viewed in-browser.

## Forked dependencies

The software has several dependencies that required minor modifications to suit our needs. Rather than attempt to persuade their creators to adopt our modifications, those repositories have been forked within the U.S. Tax Court's GitHub organization, and the modifications made there. Those repositories are:

- [serverless-s3-local](https://github.com/ustaxcourt/serverless-s3-local)
- [s3rver](https://github.com/ustaxcourt/s3rver)
- [serverless-plugin-bind-deployment-id](https://github.com/ustaxcourt/serverless-plugin-bind-deployment-id)
- [serverless-dynamodb-local](https://github.com/ustaxcourt/serverless-dynamodb-local)

_If these repositories are deleted, the build will fail._ To verify that these repositories are still required, see each of the `package.json` files in the repo (e.g., `find . -name package.json -exec grep "github:ustaxcourt" {} \; |awk 'BEGIN {FS=": ";}{print$2}' |uniq`). Note that `s3rver` is a dependency of `serverless-s3-local`, and so it will not be found in our `package.json` files.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Testing / Coverage Tips

- Run all tests with `npm run test`
- The web client, api, and shared code can be tested with `npm run test:client`, `npm run test:api`, and `npm run test:shared`, respectively.
- TIP: When working through a single test, you can run a single test with `jest /path/to/test/file.js` (you may need to `npm -i -g jest`). Additionally, you can use `--watch` and `--coverage` flags to to continually run the specified test on save and provide a coverage report. For example: `jest /path/to/test/file.js --watch --coverage`

Example coverage output:
```
----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |        0 |        0 |        0 |        0 |                   |
----------|----------|----------|----------|----------|-------------------|
```
- Stmts: % of statements executed in the code
- Branch: % of control structures (for example, if statements) executed in the code
- Funcs: % of functions executed in the code
- Uncovered Line #s: lines not covered by tests

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

## Creating end-of-sprint pull requests

Follow these steps for creating the end of sprint PRs for the court.

1. Create a PR from `develop` -> `staging`
2. Verify PR passed
3. Merge PR and verify staging deployed correctly in CircleCI
4. Create a PR from `staging` -> `master`
5. Verify PR passed
6. Merge PR and verify prod deployed correctly in CircleCI
7. Create a PR from `flexion/ef-cms master` -> `ustaxcourt/ef-cms staging`
8. When PR comments come in, make changes to master to fix the comments
9. After the court approves and merges PR, merge master into develop
10. Create a release in GitHub as sprint_00x against master and put the same description planned to be in the PR description for the court
