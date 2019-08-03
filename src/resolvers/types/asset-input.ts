import { InputType, Field } from 'type-graphql'
import { AssetType } from '../../enums/asset-type';

@InputType()
export default class AssetInput {
  @Field()
  name: string;

  @Field()
  type: AssetType;

  @Field({ nullable: true })
  addedAt: number;

  @Field({ nullable: true })
  updatedAt: number;
}
