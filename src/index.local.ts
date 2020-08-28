/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable import/order */
// node_modules
import 'reflect-metadata';
const onExit = require('signal-exit');

// libraries
import { env } from './lib/environment';
import { mongo } from './lib/mongo';
import { logger } from './lib/logger';
import { utils } from './lib/utils';
import { authentication } from './lib';

// models
import { APIError } from './models/error';

// app
import { bootstrap } from './app';
import { dynamoDB, documentClient } from './lib/aws';

// certralize app exiting
function exit(code?: number | string | boolean | any) {
  // build exit code
  const exitCode = code || 1;
  // log for debugging and POTENTIAL run purposes
  if (exitCode === 0) logger.info(`{}App::#exit::code=${utils.anyy.stringify(exitCode)}`);
  else logger.error(`{}App::#exit::code=${utils.anyy.stringify(exitCode)}`);
  // exit process after timeout to let streams clear
  setTimeout(() => {
    process.exit(exitCode);
  }, 1500);
}

// catch all possible exits in app
onExit((code: unknown, signal: unknown) => {
  // log for debugging and run support purposes
  logger.info(`{}App::#onExit::code=${utils.anyy.stringify(code)}::signal=${utils.anyy.stringify(signal)}`);
  // return explicitly
  return;
});

process.on('uncaughtException', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  logger.error(`{}App::uncaughtException::error=${utils.anyy.stringify(error)}`);
  // exit explicitly
  exit(1);
});

process.on('unhandledRejection', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  logger.error(`{}App::unhandledRejection::error=${utils.anyy.stringify(error)}`);
  // exit explicitly
  exit(1);
});

// execute file
(async () => {
  try {
    // load env
    await env.init({ ...require('./configs/environment').default });
    // initialize asynchronous libraries, connectiones, etc. here
    await Promise.all([
      mongo.init([...require('./configs/datasources/mongo').default]),
    ]);
    // initialize synchronous libraries, connectiones, etc. here
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    [
      authentication.oAuthConnector.init([...require('./configs/oauth').default]),
      dynamoDB.init({ endpoint: env.AWS_LOCALSTACK_ENDPOINT }),
      documentClient.init({ endpoint: env.AWS_LOCALSTACK_ENDPOINT }),
    ];
    // build app
    const app = await bootstrap();
    // start server
    const serverInfo = await app.listen(env.PORT);
    // log for debugging and run support purposes
    logger.info(`{}App::server started::serverInfo=${utils.anyy.stringify(serverInfo)}`);
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.error(`{}App::error executing::error=${utils.anyy.stringify(error)}`);
    // exit explicitly
    exit(1);
  }
})();
