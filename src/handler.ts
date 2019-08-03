import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import AssetResolver from './resolvers/asset-resolver';
import { buildSchemaSync } from 'type-graphql';

export const server = new ApolloServer({
  schema: buildSchemaSync({
      resolvers: [AssetResolver],
      emitSchemaFile: true,
      validate: false
  })
});

export const graphql = server.createHandler();
