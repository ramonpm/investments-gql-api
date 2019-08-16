import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import AssetResolver from './resolvers/asset-resolver';
import { buildSchemaSync } from 'type-graphql';
import OrderResolver from './resolvers/order-resolver';

export const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [AssetResolver, OrderResolver],
    emitSchemaFile: true,
    validate: false
  })
});

export const graphql = server.createHandler();
