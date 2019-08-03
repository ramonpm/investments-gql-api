import { Field, ObjectType, ID } from 'type-graphql';
import { OrderType } from '../enums/order-type';

@ObjectType()
export default class Order {
  @Field(type => ID)
  id: string;

  @Field()
  assetId: number;

  @Field()
  userId: number;

  @Field()
  type: OrderType;

  @Field()
  quantity: number;

  @Field()
  price: number;

  @Field()
  addedAt: number;

  @Field()
  updatedAt: number;
}
