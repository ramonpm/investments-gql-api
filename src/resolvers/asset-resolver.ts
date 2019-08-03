import {
  Resolver,
  Query,
  Arg,
  Mutation,
} from 'type-graphql';
import { v1 } from 'uuid';
import Asset from '../models/asset';
import dynamoDb from '../config/database';
import AssetInput from './types/asset-input';
import { DBTable } from '../enums/table-names';

@Resolver(Asset)
export default class AssetResolver {
  constructor() { }

  @Query(returns => Asset)
  async asset(@Arg('id') id: string) {
    const params = {
      TableName: DBTable.Assets,
      Key: { id }
    };
    const r = await dynamoDb.get(params).promise();
    return r.Item;
  }

  @Query(returns => [Asset])
  async assets() {
    const result = await dynamoDb.scan({ TableName: DBTable.Assets }).promise()
    return result.Items;
  }

  @Mutation(returns => Asset)
  async addAsset(
    @Arg('data') data: AssetInput,
  ): Promise<Asset> {
    const params = {
      TableName: DBTable.Assets,
      Item: {
        id: v1(),
        name: data.name,
        type: data.type,
        addedAt: Date.now(),
        updatedAt: Date.now()
      }
    };
    await dynamoDb.put(params).promise();
    return params.Item;
  }

  @Mutation(returns => Asset)
  async updateAsset(
    @Arg('id') id: string,
    @Arg('data') data: AssetInput,
  ) {
    const { name, type, updatedAt, addedAt } = data;
    const params = {
      TableName: DBTable.Assets,
      Item: {
        id: id,
        name,
        type,
        addedAt,
        updatedAt
      }
    };

    await dynamoDb.put(params).promise();

    // Couldn't figure out a way to return the updated values with only the put action
    const paramsGet = {
      TableName: DBTable.Assets,
      Key: { id }
    }
    const r = await dynamoDb.get(paramsGet).promise();

    return r.Item;
  }

  @Mutation(returns => Boolean)
  async removeAsset(@Arg('id') id: string) {
    const params = {
      TableName: DBTable.Assets,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };
    const response = await dynamoDb.delete(params).promise();
    return !!response.Attributes;
  }
}
