require('dotenv').config({ path: './.env.test' });

import { createTestClient } from 'apollo-server-testing';
import { server } from '../../handler';
import dynamoDb from '../../config/database';
import { DBTable } from '../../enums/table-names';
import { firstOrCreateMock } from '../../../test-helpers/helpers';

const { query, mutate } = createTestClient(server);

describe('Assets requests', () => {
  it('creates an asset', async () => {
    const response = await mutate({
      mutation: `mutation {
          addAsset(data: {
              name: "USIM5",
              type: "stock"
          }) {
              id
              name
          }
        }`
    });
    const { id } = response.data.addAsset;
    const params = {
      TableName: DBTable.Assets,
      Key: { id }
    };
    const r = await dynamoDb.get(params).promise();
    expect(r.Item.name).toEqual('USIM5')
  });

  it('lists assets', async () => {
    const asset = await firstOrCreateMock(DBTable.Assets)
    const response = await query({
      query: `{
          assets {
            id
            name
          }
        }`
    });
    expect(response.data.assets).toContainEqual({ "id": asset.id, "name": asset.name });
  });

  it('shows a asset', async () => {
    const asset = await firstOrCreateMock(DBTable.Assets)
    const response = await query({
      query: `{
          asset(id: "${asset.id}") {
            id
            name
          }
        }`
    });
    expect(response.data).toEqual({ "asset": { "id": asset.id, "name": asset.name } });
  });

  it('updates a asset', async () => {
    const asset = await firstOrCreateMock(DBTable.Assets)
    const response = await mutate({
      mutation: `mutation {
          updateAsset(
            id: "${asset.id}",
            data: {
              name: "updated-test",
              type: "stock"
            }
          ) {
              id
              name
          }
        }`
    });
    expect(response.data.updateAsset.name).toBe('updated-test');
  });

  it('removes a asset', async () => {
    const asset = await firstOrCreateMock(DBTable.Assets)
    const preResult = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
    const preResultLength = preResult.Items.length;
    const response = await mutate({
      mutation: `mutation {
          removeAsset(id: "${asset.id}")
        }`
    });
    expect(response.data).toEqual({ "removeAsset": true });
    const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
    expect(result.Items.length).toBe(preResultLength - 1);
  });

  it('does not remove a asset without the correct id', async () => {
    await firstOrCreateMock(DBTable.Assets);
    const preResult = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
    const preResultLength = preResult.Items.length;
    const response = await mutate({
      mutation: `mutation {
          removeAsset(id: "wrong-id")
        }`
    });
    expect(response.data).toEqual({ "removeAsset": false });
    const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
    expect(result.Items.length).toBe(preResultLength);
  });

  it('can have an expiration date', async () => {
    const expirationDateInput = '2019-12-15';
    const response = await mutate({
      mutation: `mutation {
          addAsset(data: {
              name: "USIMA10",
              type: "stock",
              expirationDate: ${Date.parse(expirationDateInput)}
          }) {
              expirationDate
          }
        }`
    });
    const { expirationDate } = response.data.addAsset;
    expect(new Date(expirationDate).toISOString().split('T')[0]).toEqual(expirationDateInput);
  });
});
