// node_modules
import * as _ from 'lodash';
import Twitter from 'twitter-lite';

// libraries
import { utils } from '../../lib/utils';
import { logger } from '../../lib/logger';
import { env } from '../../lib/environment';

// models
import { APIError } from '../../models/error';

export interface GetMentionsTimelineRequestInterface {
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

export async function getMentionsTimeline(getMentionsTimelineRequest: GetMentionsTimelineRequestInterface): Promise<any[]> {
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
    } = getMentionsTimelineRequest;
    // create new twitter client
    const twitterClient = new Twitter({
      consumer_key: env.TIWTTER_CONSUMER_KEY, // from Twitter.
      consumer_secret: env.TIWTTER_CONSUMER_SECRET, // from Twitter.
      access_token_key: oAuthAccessToken, // from your User (oauth_token)
      access_token_secret: oAuthAccessTokenSecret, // from your User (oauth_token_secret)
    });
    // call to get a users personal timeline
    const tweets = await twitterClient.get('statuses/mentions_timeline', _.omitBy({
      user_id: userId,
      screen_name: screenName,
      since_id: sinceId,
      max_id: maxId,
      count,
      trim_user: trimUser,
      exclude_replies: excludeReplies,
      include_rts: includeRts,
    }, _.isUndefined));
    // console.log(`Rate: ${tweets._headers.get('x-rate-limit-remaining')} / ${tweets._headers.get('x-rate-limit-limit')}`);
    // const delta = (tweets._headers.get('x-rate-limit-reset') * 1000) - Date.now();
    // console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);
    // return explcitly
    return tweets;
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.info(`{}TwitterManager::#getMentionsTimeline::error executing::error=${utils.anyy.stringify(error)}`);
    // throw error explicitly
    throw error;
  }
}
