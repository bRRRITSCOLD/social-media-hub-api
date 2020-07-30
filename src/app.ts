// node_modules
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { TwitterController } from './api/twitter/twitter.controller';

// libraries
import { env } from './lib/environment';
import { ErrorInterceptor } from './lib/middleware/error';

// models
import { APIError } from './models/error';

// app
const fastifyApp = fastify({ logger: true });

// file constants
const GQL = require('fastify-gql');

const bootstrap = async () => {
  try {
    // cors
    fastifyApp.register(require('fastify-cors'), {
      // origin: 'http://127.0.0.1:3000',
      origin: (origin: string, cb: any) => {
        if (env.ALLOWED_ORIGINS.split(';').reduce((isAllowed: boolean, allowedOrigin: string) => {
          // things like swagger/graphiql
          if (origin === undefined) isAllowed = true;
          else if (allowedOrigin === '*') isAllowed = true;
          else if (origin.includes(allowedOrigin)) isAllowed = true;
          return isAllowed;
        }, false)) cb(null, true);
        else cb(new Error('Not allowed'), false);
      },
      credentials: true,
    });
    // cookies
    fastifyApp.register(require('fastify-cookie'), {
      parseOptions: {}, // options for parsing cookies
    });
    // build graphql schema
    const schema = await buildSchema({
      resolvers: [`${__dirname}/**/*.resolver.ts`],
      container: Container,
      globalMiddlewares: [ErrorInterceptor],
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
