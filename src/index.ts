/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
/* eslint-disable import/order */
// node_modules
import 'reflect-metadata';
const onExit = require('signal-exit');

// libraries
import { env } from './lib/environment';
import { oAuthConnector } from './lib/authentication';

// models
import { APIError } from './models/error';

// app
import { bootstrap } from './app';
import { mongo } from './lib/mongo';

// import { twitter } from './lib/twitter';

// certralize app exiting
function exit(code?: number) {
  // build exit code
  const exitCode = code || 1;
  // log for debugging and run support purposes
  console.log(`{}Index::exiting::${exitCode}`);
  // exit process after timeout to let streams clear
  setTimeout(() => {
    process.exit(code);
  }, 1500);
}

// catch all possible exits in app
onExit((code: unknown, signal: unknown) => {
  // log for debugging and run support purposes
  console.log(code, signal);
  // exit explicitly
  exit(1);
});

process.on('uncaughtException', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  console.log(error);
  // exit explicitly
  exit(1);
});

process.on('unhandledRejection', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  console.log(error);
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
    [oAuthConnector.init([...require('./configs/oauth').default])];
    // build app
    const app = await bootstrap();
    // start server
    app.listen(env.PORT, (err: unknown, address: string) => {
      // if error then build and throw new api error
      if (err) throw new APIError(err);
      // log for debugging and run support purposes
      console.log(`server listening on ${address}`);
    });
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    console.log(error);
    // exit explicitly
    exit(1);
  }
})();
