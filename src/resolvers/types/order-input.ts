import { InputType, Field } from 'type-graphql'
import { OrderType } from '../../enums/order-type';

@InputType()
export default class OrderInput {
  @Field()
  assetId: string;

  @Field()
  userId: string;

  @Field()
  type: OrderType;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field({ nullable: true })
  addedAt: number;

  @Field({ nullable: true })
  updatedAt: number;
}
