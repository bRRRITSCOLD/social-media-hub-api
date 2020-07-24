// libraries
import { env } from '../lib/environment';

export default [
  {
    name: env.TWITTER_OAUTH_CLIENT_NAME,
    options: {
      requestUrl: 'https://twitter.com/oauth/request_token',
      accessUrl: 'https://twitter.com/oauth/access_token',
      consumerKey: env.TIWTTER_CONSUMER_KEY,
      consumerSecret: env.TIWTTER_CONSUMER_SECRET,
      version: '1.0A',
      authorize_callback: env.TIWTTER_OAUTH_CALLBACK_URL,
      signatureMethod: 'HMAC-SHA1',
    },
  },
];
