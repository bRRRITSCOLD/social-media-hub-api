// node_modules
import * as _ from 'lodash';

// libraries
import { env } from '../../lib/environment';
import { authentication } from '../../lib';

// models
import { APIError } from '../../models/error';

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
    const twitterOAuthClient: authentication.OAuth = authentication.oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
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
    // throw error explicitly
    throw error;
  }
}
