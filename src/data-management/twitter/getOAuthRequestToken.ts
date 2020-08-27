// node_modules
import * as _ from 'lodash';

// libraries
import { utils } from '../../lib/utils';
import { logger } from '../../lib/logger';
import { env } from '../../lib/environment';
import { authentication } from '../../lib';

// models
import { APIError } from '../../models/error';

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
    const twitterOAuthClient: authentication.OAuth = authentication.oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
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
      oAuthCallbackConfirmed: utils.booleans.fromOther(_.get(getOAuthRequestTokenResponse, 'oAuthCallbackConfirmed')),
    };
  } catch (err) {
    // build error
    const error = new APIError(err);
    // throw error explicitly
    throw error;
  }
}
