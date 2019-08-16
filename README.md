# typescript-serverless-graphql
Starting point for building a `Lambda + GraphQL + DynamoDB + Typescript + Webpack + TypeGraphQL` based application

```bash
yarn install
sls dynamodb install
yarn start
```

# CRUD Operations sample
Check resolvers' test files for samples.

# Tests

First start dynamodb locally if it's not running
`sls dynamodb start`

Then
`yarn test`

```
yarn run v1.16.0
$ yarn test
yarn run v1.16.0
warning package.json: No license field
$ jest
 PASS  src/config/__tests__/database.test.ts
 PASS  src/__tests__/requests/asset-resolver.test.ts
 PASS  src/__tests__/requests/order-resolver.test.ts
---------------------|----------|----------|----------|----------|-------------------|
File                 |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------------|----------|----------|----------|----------|-------------------|
All files            |      100 |      100 |      100 |      100 |                   |
 src                 |      100 |      100 |      100 |      100 |                   |
  handler.ts         |      100 |      100 |      100 |      100 |                   |
 src/config          |      100 |      100 |      100 |      100 |                   |
  database.ts        |      100 |      100 |      100 |      100 |                   |
 src/enums           |      100 |      100 |      100 |      100 |                   |
  asset-type.ts      |      100 |      100 |      100 |      100 |                   |
  order-type.ts      |      100 |      100 |      100 |      100 |                   |
  table-names.ts     |      100 |      100 |      100 |      100 |                   |
 src/libs            |      100 |      100 |      100 |      100 |                   |
  dynamo.ts          |      100 |      100 |      100 |      100 |                   |
 src/models          |      100 |      100 |      100 |      100 |                   |
  asset.ts           |      100 |      100 |      100 |      100 |                   |
  order.ts           |      100 |      100 |      100 |      100 |                   |
 src/resolvers       |      100 |      100 |      100 |      100 |                   |
  asset-resolver.ts  |      100 |      100 |      100 |      100 |                   |
  order-resolver.ts  |      100 |      100 |      100 |      100 |                   |
 src/resolvers/types |      100 |      100 |      100 |      100 |                   |
  asset-input.ts     |      100 |      100 |      100 |      100 |                   |
  order-input.ts     |      100 |      100 |      100 |      100 |                   |
---------------------|----------|----------|----------|----------|-------------------|

Test Suites: 3 passed, 3 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        2.064s, estimated 53s
Ran all test suites.
Done in 2.47s.
```
