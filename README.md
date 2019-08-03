# typescript-serverless-graphql
Starting point for building a `Lambda + GraphQL + DynamoDB + Typescript + Webpack + TypeGraphQL` based application

```bash
yarn install
sls dynamodb install
yarn start
```

# CRUD Operations sample
All HTTP Post requests.

## Create Assets
```
mutation {
  addAsset(data: {
      name: "Teste",
      quantity: 10
  }) {
      name
  }
}
```

## List Assets
```
{
  assets {
    id
    name
  }
}
```

## Show Asset
```
{
  asset(id: "602a12c0-942d-11e9-951c-bb18edc8c9c2") {
    id
    name
  }
}
```

## Update Asset
```
mutation {
  updateAsset(
    id: "602a12c0-942d-11e9-951c-bb18edc8c9c2",
    data: {
      name: "deugood",
      quantity: 10
  }) {
      name
  }
}
```

## Delete Asset
```
mutation {
  removeAsset(id: "602a12c0-942d-11e9-951c-bb18edc8c9c2")
}
```

# Tests

First start dynamodb locally if it's not running
`sls dynamodb start`

Then
`yarn test`

```
yarn run v1.16.0
$ jest
 PASS  src/config/__tests__/database.test.ts
 PASS  src/__tests__/requests/handler.test.ts (7.849s)
----------------------|----------|----------|----------|----------|-------------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------------------|----------|----------|----------|----------|-------------------|
All files             |      100 |      100 |      100 |      100 |                   |
 src                  |      100 |      100 |      100 |      100 |                   |
  handler.ts          |      100 |      100 |      100 |      100 |                   |
 src/config           |      100 |      100 |      100 |      100 |                   |
  database.ts         |      100 |      100 |      100 |      100 |                   |
 src/models           |      100 |      100 |      100 |      100 |                   |
  asset.ts          |      100 |      100 |      100 |      100 |                   |
 src/resolvers        |      100 |      100 |      100 |      100 |                   |
  asset-resolver.ts |      100 |      100 |      100 |      100 |                   |
 src/resolvers/types  |      100 |      100 |      100 |      100 |                   |
  asset-input.ts    |      100 |      100 |      100 |      100 |                   |
----------------------|----------|----------|----------|----------|-------------------|

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        9.933s
Ran all test suites.
Done in 12.34s.
```
