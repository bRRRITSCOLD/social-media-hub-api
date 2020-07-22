// NODE_MODULES
import Twit from 'twit';

// libraries
import { env } from '../../lib/environment';

class Twitter {
  public client!: Twit;

  init() {
    // intialize client
    this.client = new Twit({
      consumer_key:         env.TIWTTER_CONSUMER_KEY,
      consumer_secret:      env.TIWTTER_CONSUMER_SECRET,
      access_token:         env.TIWTTER_ACCESS_TOKEN,
      access_token_secret:  env.TIWTTER_ACCESS_TOKEN_SECRET,
      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
      strictSSL:            true,     // optional - requires SSL certificates to be valid.
    });
    // return explicitly
    return;
  }
}

const twitter = new Twitter();

export { twitter };