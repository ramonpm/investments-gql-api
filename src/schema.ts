import { buildSchema } from 'type-graphql';
import AssetResolver from './resolvers/asset-resolver';

export default async function setGlobalSchema() {
  // build TypeGraphQL executable schema
  (global as any).schema = (global as any).schema || await buildSchema({
    resolvers: [AssetResolver],
    validate: false,
  });
}
