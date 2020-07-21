/* eslint-disable @typescript-eslint/no-explicit-any */
import fastify from 'fastify';

const app = fastify({ logger: true });

app.register(require('fastify-cors'), {});

// Declare a route
app.get('/', async (request: any, reply: any) => {
  request;
  reply.code(200);
  reply.header('Content-Type', 'application/json');
  reply.send({ message: 'hello world!' });
  return;
});

export { app };
