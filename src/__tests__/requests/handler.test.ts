require('dotenv').config({ path: './.env.test' });

import { createTestClient } from 'apollo-server-testing';
import { server } from '../../handler';
import dynamoDb from '../../config/database';
import { DBTable } from '../../enums/table-names';

const { query, mutate } = createTestClient(server);

describe('The Function Requests', () => {
  describe('Assets requests', () => {
    beforeEach(async () => {
      const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
      for (const item of result.Items) {
        const id = item.id;
        const params = {
          TableName: DBTable.Assets,
          Key: { id }
        };
        await dynamoDb.delete(params).promise();
      }
    });
  
    it('creates an asset', async () => {
      const response = await mutate({
        mutation: `mutation {
          addAsset(data: {
              name: "USIM5",
              type: "stock"
          }) {
              name
          }
        }`
      });
      expect(response.data).toEqual({ "addAsset": { "name": "USIM5" } });
      const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
      expect(result.Items.length).toBe(1);
    });
  
    it('lists assets', async () => {
      await addAssetTest({
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
      const response = await query({
        query: `{
          assets {
            id
            name
          }
        }`
      });
      expect(response.data).toEqual({ "assets": [{ "id": "test-id", "name": "test-name" }] });
    });
  
    it('shows a asset', async () => {
      await addAssetTest({
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
      const response = await query({
        query: `{
          asset(id: "test-id") {
            id
            name
          }
        }`
      });
      expect(response.data).toEqual({ "asset": { "id": "test-id", "name": "test-name" } });
    });
  
    it('updates a asset', async () => {
      await addAssetTest({
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
      const response = await mutate({
        mutation: `mutation {
          updateAsset(
            id: "test-id",
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
      await addAssetTest({
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
      const response = await mutate({
        mutation: `mutation {
          removeAsset(id: "test-id")
        }`
      });
      expect(response.data).toEqual({ "removeAsset": true });
      const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
      expect(result.Items.length).toBe(0);
    });
  
    it('does not remove a asset without the correct id', async () => {
      await addAssetTest({
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
      const response = await mutate({
        mutation: `mutation {
          removeAsset(id: "wrong-id")
        }`
      });
      expect(response.data).toEqual({ "removeAsset": false });
      const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise();
      expect(result.Items.length).toBe(1);
    });
  });
});

const addAssetTest = async (data) => {
  const params = {
    TableName: DBTable.Assets,
    Item: {
      id: data.id,
      name: data.name,
      type: data.type,
      addedAt: Date.now(),
      updatedAt: Date.now()
    }
  };
  await dynamoDb.put(params).promise();
}
