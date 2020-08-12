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
import * as twitterManager from '../../data-management/twitter.manager';

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
      // get twitter request tokens and
      // additional information
      const getOAuthRequestTokensResponse = await twitterManager.getOAuthRequestToken();
      // store the encrypted and signed values in mongo
      const twitterAccessRequestUserTwitterToken = new UserToken({
        userId,
        oAuthRequestToken: getOAuthRequestTokensResponse.oAuthRequestToken,
        oAuthRequestTokenSecret: getOAuthRequestTokensResponse.oAuthRequestTokenSecret,
        oAuthAccessAuhthorizeUrl: `https://twitter.com/oauth/authorize?oauth_token=${getOAuthRequestTokensResponse.oAuthRequestToken}`,
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
      // if no existing twitter user token
      if (!existingUserToken) throw new APIError(
        new Error('No twitter user token found.'),
        { statusCode: 404 },
      );
      // get to get twitter access tokens and
      // additional information
      const getOAuthAccessTokenResponse = await twitterManager.getOAuthAccessToken({
        oAuthRequestToken,
        oAuthRequestTokenSecret,
        oAuthVerifier,
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

  public async getUserTimeline(
    data: {
      userId: string;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getUserTimeline::initiating execution');
      // deconstruct for ease
      const {
        userId,
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
            userId,
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
      // if no existing twitter user token
      if (!existingUserToken) throw new APIError(
        new Error('No twitter user token found.'),
        { statusCode: 404 },
      );
      // get to get twitter access tokens and
      // additional information
      const getUserTimelineResponse = await twitterManager.getUserTimeline({
        oAuthAccessToken: _.get(existingUserToken, 'oAuthAccessToken', ''),
        oAuthAccessTokenSecret: _.get(existingUserToken, 'oAuthAccessTokenSecret', ''),
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#getUserTimeline::successfully executed');
      // return resulst explicitly
      return getUserTimelineResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.info(`{}TwitterService::#getUserTimeline::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
