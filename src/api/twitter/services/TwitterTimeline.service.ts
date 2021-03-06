// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import * as cryptography from '../../../lib/cryptography';

// models
import { APIError } from '../../../models/error';
import { UserTokenTypeEnum } from '../../../models/user-token';

// models
import * as userManager from '../../../data-management/user';
import * as userTokenManager from '../../../data-management/user-token';
import * as twitterManager from '../../../data-management/twitter';

@Service()
export class TwitterTimelineService {
  public async userTimeline(
    data: {
      jwtUserId: string;
      userId?: string;
      screenName?: string;
      sinceId?: string;
      maxId?: string;
      count?: number;
      trimUser?: string;
      excludeReplies?: string;
      includeRts?: string;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#userTimeline::initiating execution');
      // deconstruct for ease
      const {
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId: jwtUserId },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            userId: jwtUserId,
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
        oAuthAccessToken: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessToken', '')),
        oAuthAccessTokenSecret: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessTokenSecret', '')),
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#userTimeline::successfully executed');
      // return resulst explicitly
      return getUserTimelineResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterService::#userTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async homeTimeline(
    data: {
      jwtUserId: string;
      userId?: string;
      screenName?: string;
      sinceId?: string;
      maxId?: string;
      count?: number;
      trimUser?: string;
      excludeReplies?: string;
      includeRts?: string;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#homeTimeline::initiating execution');
      // deconstruct for ease
      const {
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId: jwtUserId },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            userId: jwtUserId,
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
      const getHomeTimelineResponse = await twitterManager.getHomeTimeline({
        oAuthAccessToken: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessToken', '')),
        oAuthAccessTokenSecret: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessTokenSecret', '')),
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#homeTimeline::successfully executed');
      // return resulst explicitly
      return getHomeTimelineResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterService::#homeTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async mentionsTimeline(
    data: {
      jwtUserId: string;
      userId?: string;
      screenName?: string;
      sinceId?: string;
      maxId?: string;
      count?: number;
      trimUser?: string;
      excludeReplies?: string;
      includeRts?: string;
    },
  ): Promise<any> {
    try {
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#mentionsTimeline::initiating execution');
      // deconstruct for ease
      const {
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      } = data;
      // query for the user that is attempting to
      // get the oauth request token for twitter
      const [
        { users: [existingUser] },
        { userTokens: [existingUserToken] },
      ] = await Promise.all([
        userManager.searchUsers({
          searchCriteria: { userId: jwtUserId },
          searchOptions: {
            pageNumber: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        }),
        userTokenManager.searchUserTokens({
          searchCriteria: {
            userId: jwtUserId,
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
      const getMentionsTimelineResponse = await twitterManager.getMentionsTimeline({
        oAuthAccessToken: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessToken', '')),
        oAuthAccessTokenSecret: cryptography.decrypt(_.get(existingUserToken, 'oAuthAccessTokenSecret', '')),
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      // log for debugging and run support purposes
      logger.info('{}TwitterService::#mentionsTimeline::successfully executed');
      // return resulst explicitly
      return getMentionsTimelineResponse;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterService::#mentionsTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
