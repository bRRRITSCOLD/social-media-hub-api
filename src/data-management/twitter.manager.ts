// node_modules
import * as _ from 'lodash';
import Twitter from 'twitter-lite';

// libraries
import { OAuth, oAuthConnector } from '../lib/authentication';
import { env } from '../lib/environment';
import { logger } from '../lib/logger';
import { anyy, booleans } from '../lib/utils';

// models
import { APIError } from '../models/error';

/**
 *
 *
 * @export
 * @interface GetOAuthRequestTokenResponseInterface
 */
export interface GetOAuthRequestTokenResponseInterface {
  oAuthRequestToken: string;
  oAuthRequestTokenSecret: string;
  oAuthCallbackConfirmed: boolean;
}

/**
 *
 *
 * @export
 * @returns {Promise<GetOAuthRequestTokenResponseInterface>}
 */
export async function getOAuthRequestToken(): Promise<GetOAuthRequestTokenResponseInterface> {
  try {
    // get twitter oauth client
    const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
    // wrap call in promise for use in async/await
    const getOAuthRequestTokenPromise = (): Promise<{
      [key: string]: any;
      [key: number]: any;
      oAuthRequestToken: string;
      oAuthRequestTokenSecret: string;
    }> => new Promise((res: any, rej: any) => {
      twitterOAuthClient.getOAuthRequestToken((err: any, oAuthReqToken: string, oAuthRqTokenSecret: string, results: any) => {
        if (err) return rej(err);
        return res({
          oAuthRequestToken: oAuthReqToken,
          oAuthRequestTokenSecret: oAuthRqTokenSecret,
          oAuthCallbackConfirmed: results.oauth_callback_confirmed,
          ...results,
        });
      });
    });
    // call new wrapped function
    const getOAuthRequestTokenResponse = await getOAuthRequestTokenPromise();
    // return explcitly
    return {
      ...getOAuthRequestTokenResponse,
      oAuthRequestToken: _.get(getOAuthRequestTokenResponse, 'oAuthRequestToken'),
      oAuthRequestTokenSecret: _.get(getOAuthRequestTokenResponse, 'oAuthRequestTokenSecret'),
      oAuthCallbackConfirmed: booleans.fromOther(_.get(getOAuthRequestTokenResponse, 'oAuthCallbackConfirmed')),
    };
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.info(`{}TwitterManager::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
    // throw error explicitly
    throw error;
  }
}

/**
 *
 *
 * @export
 * @interface GetOAuthAccessTokenRequestInterface
 */
export interface GetOAuthAccessTokenRequestInterface {
  oAuthRequestToken: string;
  oAuthRequestTokenSecret: string;
  oAuthVerifier: string;
}

/**
 *
 *
 * @export
 * @interface GetOAuthAccessTokenResponseInterface
 */
export interface GetOAuthAccessTokenResponseInterface {
  oAuthAccessToken: string;
  oAuthAccessTokenSecret: string;
  userId: string;
  screenName: string;
}

/**
 *
 *
 * @export
 * @param {GetOAuthAccessTokenRequestInterface} getOAuthAccessTokenRequest
 * @returns {Promise<GetOAuthAccessTokenResponseInterface>}
 */
export async function getOAuthAccessToken(getOAuthAccessTokenRequest: GetOAuthAccessTokenRequestInterface): Promise<GetOAuthAccessTokenResponseInterface> {
  try {
    // deconstruct for ease
    const {
      oAuthRequestToken,
      oAuthRequestTokenSecret,
      oAuthVerifier,
    } = getOAuthAccessTokenRequest;
    // check that the tokens
    // get twitter oauth client
    const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
    // wrap call in promise for use in async/await
    const getOAuthAccessTokenPromise = (getOAuthAccessTokenReqeust: { oAuthReqToken: string, oAuthReqTokenSecret: string, oAuthVer: string; }): Promise<GetOAuthAccessTokenResponseInterface> => new Promise((res: any, rej: any) => {
      // deconstruct for easr
      const {
        oAuthReqToken,
        oAuthReqTokenSecret,
        oAuthVer,
      } = getOAuthAccessTokenReqeust;
        // use twitter client to get tokens
      twitterOAuthClient.getOAuthAccessToken(oAuthReqToken, oAuthReqTokenSecret, oAuthVer, (err, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
        if (err) return rej(err);
        return res({
          oAuthAccessToken,
          oAuthAccessTokenSecret,
          userId: results.user_id,
          screenName: results.screen_name,
          ...results,
        });
      });
    });
      // call new wrapped function
    const getOAuthAccessTokenResponse = await getOAuthAccessTokenPromise({
      oAuthReqToken: oAuthRequestToken,
      oAuthReqTokenSecret: oAuthRequestTokenSecret,
      oAuthVer: oAuthVerifier,
    });
    // return explcitly
    return {
      ...getOAuthAccessTokenResponse,
      oAuthAccessToken: _.get(getOAuthAccessTokenResponse, 'oAuthAccessToken'),
      oAuthAccessTokenSecret: _.get(getOAuthAccessTokenResponse, 'oAuthAccessTokenSecret'),
      userId: _.get(getOAuthAccessTokenResponse, 'userId'),
      screenName: _.get(getOAuthAccessTokenResponse, 'screenName'),
    };
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.info(`{}TwitterManager::#getOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
    // throw error explicitly
    throw error;
  }
}

export interface GetUserTimelineRequestInterface {
  oAuthAccessToken: string;
  oAuthAccessTokenSecret: string;
  userId?: string;
  screenName?: string;
  sinceId?: string;
  count?: string;
  maxId?: string;
  trimUser?: string;
  excludeReplies?: string;
  includeRts?: string;
}

export interface GetUserTimelineResponseInterface {
  tweets: any[]
  moreTweets: boolean;
}

export async function getUserTimeline(getUserTimelineRequest: GetUserTimelineRequestInterface): Promise<GetUserTimelineResponseInterface> {
  try {
    // deconstruct for ease
    const {
      oAuthAccessToken,
      oAuthAccessTokenSecret,
    } = getUserTimelineRequest;
    // create new twitter client
    const twitterClient = new Twitter({
      consumer_key: env.TIWTTER_CONSUMER_KEY, // from Twitter.
      consumer_secret: env.TIWTTER_CONSUMER_SECRET, // from Twitter.
      access_token_key: oAuthAccessToken, // from your User (oauth_token)
      access_token_secret: oAuthAccessTokenSecret, // from your User (oauth_token_secret)
    });
    // call to get a users personal timeline
    const tweets = await twitterClient.get('statuses/user_timeline');
    // console.log(`Rate: ${tweets._headers.get('x-rate-limit-remaining')} / ${tweets._headers.get('x-rate-limit-limit')}`);
    // const delta = (tweets._headers.get('x-rate-limit-reset') * 1000) - Date.now();
    // console.log(`Reset: ${Math.ceil(delta / 1000 / 60)} minutes`);
    // return explcitly
    return {
      tweets,
      moreTweets: true,
    };
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.info(`{}TwitterManager::#getOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
    // throw error explicitly
    throw error;
  }
}