// node_modules
import * as _ from 'lodash';
import Twitter from 'twitter-lite';

// libraries
import { utils } from '../../lib/utils';
import { logger } from '../../lib/logger';
import { env } from '../../lib/environment';

// models
import { APIError } from '../../models/error';

export interface GetUserTimelineRequestInterface {
  oAuthAccessToken: string;
  oAuthAccessTokenSecret: string;
  userId?: string;
  screenName?: string;
  sinceId?: string;
  maxId?: string;
  count?: number;
  trimUser?: string;
  excludeReplies?: string;
  includeRts?: string;
}

export async function getUserTimeline(getUserTimelineRequest: GetUserTimelineRequestInterface): Promise<any[]> {
  try {
    // deconstruct for ease
    const {
      oAuthAccessToken,
      oAuthAccessTokenSecret,
      userId,
      screenName,
      sinceId,
      maxId,
      count,
      trimUser,
      excludeReplies,
      includeRts,
    } = getUserTimelineRequest;
    // create new twitter client
    const twitterClient = new Twitter({
      consumer_key: env.TIWTTER_CONSUMER_KEY, // from Twitter.
      consumer_secret: env.TIWTTER_CONSUMER_SECRET, // from Twitter.
      access_token_key: oAuthAccessToken, // from your User (oauth_token)
      access_token_secret: oAuthAccessTokenSecret, // from your User (oauth_token_secret)
    });
    // create the request that we will
    // send to twitter - convert camel
    // keys to snake keys
    const snakeCaseRequest = utils.objects.camelKeysToSnake(_.omitBy({
      userId,
      screenName,
      sinceId,
      maxId,
      count,
      trimUser,
      excludeReplies,
      includeRts,
    }, _.isUndefined));
    // call to get a users personal timeline
    const twitterClientResponse = await twitterClient.get('statuses/user_timeline', snakeCaseRequest);
    // map response from snake keys to came keys
    const camelCaseResponse = utils.arrays.snakeKeysToCamel(twitterClientResponse);
    // return explcitly
    return camelCaseResponse;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.info(`{}TwitterManager::#getUserTimeline::error executing::error=${utils.anyy.stringify(error)}`);
    // throw error explicitly
    throw error;
  }
}
