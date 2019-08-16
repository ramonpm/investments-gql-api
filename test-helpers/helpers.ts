import { DBTable } from "../src/enums/table-names";
import dynamoDb from "../src/config/database";
import { putInTable } from "../src/libs/dynamo";
import { OrderType } from "../src/enums/order-type";

export const firstOrCreateMock = async (table: DBTable) => {
  const result = await dynamoDb.scan({ TableName: table }).promise();
  const item = result.Items && result.Items[0];

  if (item) {
    return item
  }

  switch (table) {
    case DBTable.Assets: {
      return await putInTable(table, {
        id: 'test-id',
        name: 'test-name',
        type: 'stock'
      })
    }
    case DBTable.Orders: {
      return await putInTable(table, {
        id: 'test-id',
        userId: 'user1',
        assetId: 'test-id',
        type: OrderType.Buy,
        quantity: 100,
        price: 15.3
      })
    }
    default: {
      return null;
    }
  }
}
