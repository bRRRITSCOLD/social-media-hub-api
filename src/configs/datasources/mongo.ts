// libraries
import { env } from '../../lib/environment';

export default [
  {
    name: env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME,
    database: env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME,
    options: {
      poolSize: 20,
      // authMechanism: 'DEFAULT',
      // authSource: 'admin',
      auth: {
        user: env.MONGO_SOCIAL_MEDIA_HUB_API_USER,
        password: env.MONGO_SOCIAL_MEDIA_HUB_API_PASSWORD,
      },
      keepAlive: true,
      connectTimeoutMS: 500000,
      socketTimeoutMS: 500000,
      reconnectTries: 3,
      reconnectInterval: 500,
    },
    connectionStaleTimeframe: 15,
    host: env.MONGO_SOCIAL_MEDIA_HUB_DB_HOST,
  },
];
