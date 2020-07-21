import { app } from './app';

app.listen(3000, (err: any, address: any) => {
  if (err) throw err;
  app.log.info(`server listening on ${address}`);
});
