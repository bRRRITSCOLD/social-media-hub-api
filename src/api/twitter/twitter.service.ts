// node_modules
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

// libraries
import { oAuthConnector, OAuth } from '../../lib/authentication';
import { env } from '../../lib/environment';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';
import * as cryptography from '../../lib/cryptography';

// models
import { APIError } from '../../models/error';
import { UserToken, UserTokenTypeEnum } from '../../models/user-token';

// models
import * as userManager from '../../data-management/user.manager';
import * as userTokenManager from '../../data-management/user-token.manager';

@Service()
export class TwitterService {
  public async getOAuthRequestToken(data: { userId: string; }): Promise<UserToken> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getOAuthRequestToken::initiating execution');
      // deconstruct for ease
      const { userId } = data;
      // fetch the user that is requesting
      // twitter access
      const { users: [existingUser] } = await userManager.searchUsers({
        searchCriteria: { userId },
        searchOptions: {
          pageNumber: 1,
          pageSize: Number.MAX_SAFE_INTEGER,
        },
      });
      // if no user throw error
      if (!existingUser) throw new APIError(
        new Error('No user found.'),
        { statusCode: 404 },
      );
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
      const twitterAccessRequestUserTwitterToken = new UserToken({
        userId,
        oAuthRequestToken: getOAuthRequestTokenResponse.oAuthRequestToken,
        oAuthRequestTokenSecret: getOAuthRequestTokenResponse.oAuthRequestTokenSecret,
        oAuthAccessAuhthorizeUrl: `https://twitter.com/oauth/authorize?oauth_token=${getOAuthRequestTokenResponse.oAuthRequestToken}`,
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getOAuthRequestToken::successfully executed');
      // return resulst explicitly
      return twitterAccessRequestUserTwitterToken;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.info(`{}TwitterService::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async getOAuthAccessToken(
    data: {
      userId: string;
      oAuthRequestToken: string;
      oAuthRequestTokenSecret: string;
      oAuthVerifier: string;
    },
  ): Promise<boolean> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getOAuthAccessToken::initiating execution');
      // deconstruct for ease
      const {
        userId,
        oAuthRequestToken,
        oAuthRequestTokenSecret,
        oAuthVerifier,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            emailAddress: { userId },
            type: UserTokenTypeEnum.TWITTER,
          },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
      ]);
      // if no user throw error
      if (!existingUser) throw new APIError(
        new Error('No user found.'),
        { statusCode: 404 },
      );
      // check that the tokens
      // get twitter oauth client
      const twitterOAuthClient: OAuth = oAuthConnector.getClient(env.TWITTER_OAUTH_CLIENT_NAME);
      // wrap call in promise for use in async/await
      const getOAuthAccessToken = (getOAuthAccessTokenReqeust: { oAuthReqToken: string, oAuthReqTokenSecret: string, oAuthVer: string; }): Promise<{
        oAuthAccessToken: string;
        oAuthAccessTokenSecret: string;
        userId: string;
        screenName: string;
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
            userId: results.user_id,
            screenName: results.screen_name,
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
      // create the new user token
      const newTwitterAccessUserToken = new UserToken(_.assign(
        {},
        existingUserToken || {},
        _.omitBy({
          userId: existingUser.userId,
          tokenId: existingUserToken ? existingUserToken.tokenId : uuid(),
          type: UserTokenTypeEnum.TWITTER,
          oAuthAccessToken: cryptography.encrypt(getOAuthAccessTokenResponse.oAuthAccessToken),
          oAuthAccessTokenSecret: cryptography.encrypt(getOAuthAccessTokenResponse.oAuthAccessTokenSecret),
          twitterUserId: getOAuthAccessTokenResponse.userId,
          twitterScreenName: getOAuthAccessTokenResponse.screenName,
        }, _.isUndefined),
      ));
      // if an existing user token was found then
      // replace it with an updated UserToken
      // instance that has the new access tokens
      // TODO: Promise.all with putUser to add token id to user's token array
      await userTokenManager.putUserToken({
        userToken: newTwitterAccessUserToken,
        putCriteria: _.omitBy({
          userId: newTwitterAccessUserToken.userId,
          tokenId: newTwitterAccessUserToken.tokenId,
          type: UserTokenTypeEnum.TWITTER,
        }, _.isUndefined),
        putOptions: {},
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getOAuthAccessToken::successfully executed');
      // return resulst explicitly
      return true;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.info(`{}TwitterService::#getOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
