import {
  Resolver,
  Query,
  Arg,
  Mutation,
} from 'type-graphql';
import { v1 } from 'uuid';
import Order from '../models/order';
import dynamoDb from '../config/database';
import OrderInput from './types/order-input';
import { DBTable } from '../enums/table-names';

@Resolver(Order)
export default class OrderResolver {
  constructor() { }

  @Query(returns => Order)
  async order(@Arg('id') id: string) {
    const params = {
      TableName: DBTable.Orders,
      Key: { id }
    };
    const r = await dynamoDb.get(params).promise();
    return r.Item;
  }

  @Query(returns => [Order])
  async orders() {
    const result = await dynamoDb.scan({ TableName: DBTable.Orders }).promise()
    return result.Items;
  }

  @Mutation(returns => Order)
  async addOrder(
    @Arg('data') data: OrderInput,
  ): Promise<Order> {
    const params = {
      TableName: DBTable.Orders,
      Item: {
        id: v1(),
        ...data,
        addedAt: Date.now(),
        updatedAt: Date.now()
      }
    };
    await dynamoDb.put(params).promise();
    return params.Item;
  }

  @Mutation(returns => Order)
  async updateOrder(
    @Arg('id') id: string,
    @Arg('data') data: OrderInput,
  ) {
    const params = {
      TableName: DBTable.Orders,
      Item: {
        id: id,
        ...data
      }
    };

    await dynamoDb.put(params).promise();

    // Couldn't figure out a way to return the updated values with only the put action
    const paramsGet = {
      TableName: DBTable.Orders,
      Key: { id }
    }
    const r = await dynamoDb.get(paramsGet).promise();

    return r.Item;
  }

  @Mutation(returns => Boolean)
  async removeOrder(@Arg('id') id: string) {
    const params = {
      TableName: DBTable.Orders,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };
    const response = await dynamoDb.delete(params).promise();
    return !!response.Attributes;
  }
}
