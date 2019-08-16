require('dotenv').config({ path: './.env.test' });

import { createTestClient } from 'apollo-server-testing';
import { server } from '../../handler';
import dynamoDb from '../../config/database';
import { DBTable } from '../../enums/table-names';
import { firstOrCreateMock } from '../../../test-helpers/helpers';
import { OrderType } from '../../enums/order-type';

const { query, mutate } = createTestClient(server);

describe('Orders requests', () => {
  it('creates an order', async () => {
    const asset = await firstOrCreateMock(DBTable.Assets)
    const mutation = `mutation {
      addOrder(data: {
        assetId: "${asset.id}",
        userId: "user1",
        type: "${OrderType.Buy}",
        quantity: 100,
        price: 15.3,
      }) {
        id
        type
      }
    }`;
    const response = await mutate({ mutation });
    const { id } = response.data.addOrder;
    const params = {
      TableName: DBTable.Orders,
      Key: { id }
    };
    const r = await dynamoDb.get(params).promise();
    expect(r.Item.assetId).toEqual(asset.id)
  });

  it('lists orders', async () => {
    const order = await firstOrCreateMock(DBTable.Orders);
    const response = await query({
      query: `{
          orders {
            id
            userId
          }
        }`
    });
    expect(response.data.orders).toContainEqual({ "id": order.id, "userId": order.userId });
  });

  it('shows a order', async () => {
    const order = await firstOrCreateMock(DBTable.Orders);
    const response = await query({
      query: `{
          order(id: "${order.id}") {
            id
            assetId
          }
        }`
    });
    expect(response.data).toEqual({ "order": { "id": order.id, "assetId": order.assetId } });
  });

  it('updates an order', async () => {
    const order = await firstOrCreateMock(DBTable.Orders);
    const response = await mutate({
      mutation: `mutation {
          updateOrder(
            id: "${order.id}",
            data: {
              assetId: "new-asset",
              userId: "new-user1",
              type: "${OrderType.Sell}",
              quantity: 100,
              price: 15.3,
            }
          ) {
              id
              type
          }
        }`
    });
    expect(response.data.updateOrder.type).toBe(OrderType.Sell);
  });

  it('removes a order', async () => {
    const order = await firstOrCreateMock(DBTable.Orders);
    const preResult = await dynamoDb.scan({ TableName: DBTable.Orders }).promise();
    const preResultLength = preResult.Items.length;
    const response = await mutate({
      mutation: `mutation {
          removeOrder(id: "${order.id}")
        }`
    });
    expect(response.data).toEqual({ "removeOrder": true });
    const result = await dynamoDb.scan({ TableName: DBTable.Orders }).promise();
    expect(result.Items.length).toEqual(preResultLength - 1);
  });

  it('does not remove a order without the correct id', async () => {
    await firstOrCreateMock(DBTable.Orders);
    const preResult = await dynamoDb.scan({ TableName: DBTable.Orders }).promise();
    const preResultLength = preResult.Items.length;
    const response = await mutate({
      mutation: `mutation {
          removeOrder(id: "wrong-id")
        }`
    });
    expect(response.data).toEqual({ "removeOrder": false });
    const result = await dynamoDb.scan({ TableName: DBTable.Orders }).promise();
    expect(result.Items.length).toEqual(preResultLength);
  });
});
