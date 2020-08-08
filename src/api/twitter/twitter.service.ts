// node_modules
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { oAuthConnector, OAuth, jwt as jsonwebtoken } from '../../lib/authentication';
import { env } from '../../lib/environment';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';

// models
import { APIError } from '../../models/error';
import { UserToken, UserTokenTypeEnum } from '../../models/user-token';

// models
import * as userManager from '../../data-management/user.manager';
import * as userTokenManager from '../../data-management/user-token.manager';

@Service()
export class TwitterService {
  public async getOAuthRequestToken(): Promise<UserToken> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthRequestToken::initiating execution');
      // get twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // wrap call in promise for use in async/await
      const getOAuthRequestToken = (): Promise<{
        [key: string]: any;
        [key: number]: any;
        oAuthRequestToken: string;
        oAuthRequestTokenSecret: string;
      }> => new Promise((res: any, rej: any) => {
        twitterOAuthClient.getOAuthRequestToken((err: any, oAuthRequestToken: string, oAuthRequestTokenSecret: string, results: any) => {
          if (err) return rej(err);
          return res({
            oAuthRequestToken,
            oAuthRequestTokenSecret,
            ...results,
          });
        });
      });
      // call new wrapped function
      const getOAuthRequestTokenResponse = await getOAuthRequestToken();
      // store the encrypted and signed values in mongo
      const newPartialUserTwitterToken = new UserToken(
        _.assign(
          {},
          {
            oAuthRequestToken: getOAuthRequestTokenResponse.oAuthRequestToken,
            oAuthRequestTokenSecret: getOAuthRequestTokenResponse.oAuthRequestTokenSecret,
            oAuthAccessAuhthorizeUrl: `https://twitter.com/oauth/authorize?oauth_token=${getOAuthRequestTokenResponse.oAuthRequestToken}`,
          },
        ),
      );
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthRequestToken::successfully executed');
      // return resulst explicitly
      return newPartialUserTwitterToken;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}TwitterService::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async getOAuthAccessToken(
    data: {
      jwt: string;
      oAuthRequestToken: string;
      oAuthRequestTokenSecret: string;
      oAuthVerifier: string;
    },
  ): Promise<boolean> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthAccessToken::initiating execution');
      // deconstruct for ease
      const {
        jwt,
        oAuthRequestToken,
        oAuthRequestTokenSecret,
        oAuthVerifier,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [user] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId: _.get(jsonwebtoken.decode(jwt), 'userId', '') },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            emailAddress: { userId: _.get(jsonwebtoken.decode(jwt), 'userId', '') },
            type: UserTokenTypeEnum.TWITTER,
          },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
      ]);
      // check that the tokens
      // get twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // wrap call in promise for use in async/await
      const getOAuthAccessToken = (getOAuthAccessTokenReqeust: { oAuthReqToken: string, oAuthReqTokenSecret: string, oAuthVer: string }): Promise<{
        oAuthAccessToken: string;
        oAuthAccessTokenSecret: string;
      }> => new Promise((res: any, rej: any) => {
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
            ...results,
          });
        });
      });
      // call new wrapped function
      const getOAuthAccessTokenResponse = await getOAuthAccessToken({
        oAuthReqToken: oAuthRequestToken,
        oAuthReqTokenSecret: oAuthRequestTokenSecret,
        oAuthVer: oAuthVerifier,
      });
      // if an existing user token was found then
      // replace it with an updated UserToken
      // instance that has the new access tokens
      if (existingUserToken) {
        await userTokenManager.putUserToken({
          userToken: _.assign(
            {},
            existingUserToken || {},
            {
              oAuthAuthAccessToken: getOAuthAccessTokenResponse.oAuthAccessToken,
              oAuthAccessTokenSecret: getOAuthAccessTokenResponse.oAuthAccessTokenSecret,
            },
          ),
          putCriteria: {
            userId: user.userId,
            tokenId: existingUserToken.tokenId,
            type: UserTokenTypeEnum.TWITTER,
          },
          putOptions: {},
        });
      // else create a brand new token
      } else {
        await userTokenManager.putUserToken({
          userToken: {
            userId: user.userId,
            tokenId: uuid(),
            type: UserTokenTypeEnum.TWITTER,
            oAuthAccessToken: getOAuthAccessTokenResponse.oAuthAccessToken,
            oAuthAccessTokenSecret: getOAuthAccessTokenResponse.oAuthAccessTokenSecret,
          },
          putCriteria: {
            userId: user.userId,
            type: UserTokenTypeEnum.TWITTER,
          },
          putOptions: {},
        });
      }
      // log for debugging and run support purposes
      logger.debug('{}TwitterService::#getOAuthAccessToken::successfully executed');
      // return resulst explicitly
      return true;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}TwitterService::#getOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
