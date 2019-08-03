import { Field, ObjectType, ID } from 'type-graphql';
import { AssetType } from '../enums/asset-type';

@ObjectType()
export default class Asset {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  type: AssetType;

  @Field()
  addedAt: number;

  @Field()
  updatedAt: number;
}
