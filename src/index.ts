// node_modules
import 'reflect-metadata';
const onExit = require('signal-exit')

// libraries
import { env } from './lib/environment';

// models
import { APIError } from './models/error';

// app
import { bootstrap } from './app';
import { twitter } from './lib/twitter';

// catch all possible exits in app
onExit((code: any, signal: any) => {
  // log for debugging and run support purposes
  console.log(code, signal);
});

process.on('uncaughtException', (err: any) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  console.log(error);
});

process.on('unhandledRejection', (err: any) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  console.log(error);
});

// execute file
(async () => {
  try {
    // load env
    await env.init({ ...require('./configs/environment').default });
    // initialize asynchronous libraries, connectiones, etc. here
    await Promise.all([]);
    // initialize synchronous libraries, connectiones, etc. here
    [twitter.init()];
    // build app
    const app = await bootstrap();
    // start server
    app.listen(env.PORT, (err: any, address: any) => {
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
    // exit process after timeout to let streams clear
    setTimeout(() => {
      process.exit(1);
    }, 1500)
  }
})();
