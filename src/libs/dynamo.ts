import dynamoDb from "../config/database";
import { v1 } from "uuid";

export const putInTable = async (table, data) => {
  const params = {
    TableName: table,
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
