// node_modules
import fastify from 'fastify';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

// libraries
import { env } from './lib/environment';

// models
import { APIError } from './models/error';

// middleware
import { ErrorInterceptor } from './lib/middleware/error';
import { logger } from './lib/logger';
import { anyy } from './lib/utils';

// app
const fastifyApp = fastify({ logger: true });

// file constants
const GQL = require('fastify-gql');

const bootstrap = async () => {
  try {
    // errors
    fastifyApp.addHook('onError', async (_request, _reply, err) => {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}App::#onError::error=${anyy.stringify(error)}`);
    });
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
    // headers
    fastifyApp.register(require('fastify-helmet'));
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
      errorHandler: (err: any, _service: any) => {
        // build error
        const error = new APIError(err);
        // log for debugging and run support purposes
        logger.error(`{}App::graphql::#errorHandler::error=${anyy.stringify(error)}`);
      },
    });
    // return app explicitly
    return fastifyApp;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.error(`{}App::#bootstrap::error executing::error=${anyy.stringify(error)}`);
    // throw any error
    throw error;
  }
};

export { bootstrap };
