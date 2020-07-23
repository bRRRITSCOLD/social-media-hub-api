// node_modules
import fastify from 'fastify';
const GQL = require('fastify-gql');
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

// libraries
import { env } from './lib/environment';

// app
const fastifyApp = fastify({ logger: true });

const bootstrap = async () => {
  try {
    fastifyApp.register(require('fastify-cors'), {});

    const schema = await buildSchema({
      resolvers: [__dirname + `/**/*.resolver.ts`],
      container: Container,
    });

    fastifyApp.register(GQL, {
      schema,
      graphiql: env.isLocal,
      context: (request: any, response: any) => {
        // Return an object that will be available in your GraphQL resolvers
        return {
          request,
          response
        }
      }
    });

    return fastifyApp;
  } catch (error) {
    throw error;
  }
};

export { bootstrap };
