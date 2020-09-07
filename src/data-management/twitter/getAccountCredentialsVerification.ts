// node_modules
import * as _ from 'lodash';
import Twitter from 'twitter-lite';

// libraries
import { utils } from '../../lib/utils';
import { logger } from '../../lib/logger';
import { env } from '../../lib/environment';

// models
import { APIError } from '../../models/error';

export interface GetAccountCredentialsVerificationRequestInterface {
  oAuthAccessToken: string;
  oAuthAccessTokenSecret: string;
}

export async function getAccountCredentialsVerification(getAccountCredentialsVerificationReqeust: GetAccountCredentialsVerificationRequestInterface): Promise<any> {
  try {
    // deconstruct for ease
    const {
      oAuthAccessToken,
      oAuthAccessTokenSecret,
    } = getAccountCredentialsVerificationReqeust;
    // create new twitter client
    const twitterClient = new Twitter({
      consumer_key: env.TIWTTER_CONSUMER_KEY, // from Twitter.
      consumer_secret: env.TIWTTER_CONSUMER_SECRET, // from Twitter.
      access_token_key: oAuthAccessToken, // from your User (oauth_token)
      access_token_secret: oAuthAccessTokenSecret, // from your User (oauth_token_secret)
    });

    const twitterClientResponse = await twitterClient
      .get('account/verify_credentials');
    // map response from snake keys to came keys
    const camelCaseResponse = utils.objects.camelCaseKeys(twitterClientResponse);
    // return explcitly
    return camelCaseResponse;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw error explicitly
    throw error;
  }
}
