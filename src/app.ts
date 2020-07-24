// node_modules
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { TwitterController } from './api/twitter/twitter.controller';

// libraries
import { env } from './lib/environment';
import { APIError } from './models/error';

const GQL = require('fastify-gql');

// app
const fastifyApp = fastify({ logger: true });

const bootstrap = async () => {
  try {
    // cors
    fastifyApp.register(require('fastify-cors'), {});
    // cookies
    fastifyApp.register(require('fastify-cookie'), {
      parseOptions: {}, // options for parsing cookies
    });
    // build graphql schema
    const schema = await buildSchema({
      resolvers: [`${__dirname}/**/*.resolver.ts`],
      container: Container,
    });
    // register graphql
    fastifyApp.register(GQL, {
      schema,
      graphiql: env.isLocal,
      context: (request: unknown, response: unknown) => {
        // Return an object that will be available in your GraphQL resolvers
        return {
          request,
          response,
        };
      },
    });
    // register any non-graphql routes
    fastifyApp.register(TwitterController);
    // return app explicitly
    return fastifyApp;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw and errors
    throw error;
  }
};

export { bootstrap };
