import { IncomingMessage, ServerResponse } from 'http';

export async function TwitterController(fastify: any, _options: any) {
  fastify.get('/twitter/', async (_request: IncomingMessage, _reply: ServerResponse) => {
    return { hello: 'world' };
  });
}
