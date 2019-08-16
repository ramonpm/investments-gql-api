import {
  Resolver,
  Query,
  Arg,
  Mutation,
} from 'type-graphql';
import Asset from '../models/asset';
import dynamoDb from '../config/database';
import AssetInput from './types/asset-input';
import { DBTable } from '../enums/table-names';
import { putInTable } from '../libs/dynamo';

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
    return await putInTable(DBTable.Assets, data);
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
