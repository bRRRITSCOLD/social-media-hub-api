// node_modules
import Twit from 'twit';
import * as _ from 'lodash';

// libraries
import { env } from '../environment';
import { APIError } from '../../models/error';

export interface TwitterInitInterface {
  accessToken: string;
  accessTokenSecret: string;
}

class Twitter {
  public client!: Twit;

  init(twitterInitRequest: TwitterInitInterface) {
    if (
      !_.get(twitterInitRequest, 'accessToken')
      || _.get(twitterInitRequest, 'accessTokenSecret')
    ) {
      throw new APIError(
        new Error('Please provide an accessToken and accessTokenSecret when intializing twitter client'),
        { statusCode: 400 },
      );
    }
    // intialize client
    this.client = new Twit({
      consumer_key: env.TIWTTER_CONSUMER_KEY,
      consumer_secret: env.TIWTTER_CONSUMER_SECRET,
      access_token: _.get(twitterInitRequest, 'accessToken'),
      access_token_secret: _.get(twitterInitRequest, 'accessTokenSecret'),
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
      strictSSL: true, // optional - requires SSL certificates to be valid.
    });
    // return explicitly
  }
}

const twitter = new Twitter();

export { twitter };
