// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  Args,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
import { APIError, AnyObject } from '../../../models';
import {
  TwitterUserTimelineArgsType, TwitterTweetObjectType, TwitterHomeTimelineArgsType, TwitterMentionsTimelineArgsType,
} from '../types';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { JWTAuthorization, ScopeAuthorization } from '../../../lib/decorators';
import { authentication } from '../../../lib';

// services
import { TwitterTimelineService } from '../services';

class TwitterTimeline {}

@Service()
@Resolver((_of: unknown) => TwitterTimeline)
export class TwitterTimelineResolver {
  public constructor(private readonly twitterTimelineService: TwitterTimelineService) {}

  /**
   *
   *
   * @param {*} context
   * @param {TwitterUserTimelineArgsType} twitterUserTimelineArgsType
   * @returns {Promise<TwitterTweetObjectType[]>}
   * @memberof TwitterTimelineResolver
   */
  @JWTAuthorization()
  @ScopeAuthorization(['Twitter User'])
  @Query((_returns: unknown) => [TwitterTweetObjectType])
  public async twitterUserTimeline(@Ctx() context: any, @Args() twitterUserTimelineArgsType: TwitterUserTimelineArgsType): Promise<TwitterTweetObjectType[]> {
    try {
      // create params here for ease
      const [
        { userId: jwtUserId },
        {
          userId,
          screenName,
          sinceId,
          maxId,
          count,
          trimUser,
          excludeReplies,
          includeRts,
        },
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterUserTimelineArgsType,
      ];
      // call service to get
      // a user timeline that
      // matches the given
      // criteria
      const response = await this.twitterTimelineService.userTimeline({
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      return response;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterTimelineResolver::#twitterUserTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  /**
   *
   *
   * @param {*} context
   * @param {TwitterHomeTimelineArgsType} twitterHomeTimelineArgsType
   * @returns {Promise<TwitterTweetObjectType[]>}
   * @memberof TwitterTimelineResolver
   */
  @JWTAuthorization()
  @ScopeAuthorization(['Twitter User'])
  @Query((_returns: unknown) => [TwitterTweetObjectType])
  public async twitterHomeTimeline(@Ctx() context: any, @Args() twitterHomeTimelineArgsType: TwitterHomeTimelineArgsType): Promise<TwitterTweetObjectType[]> {
    try {
      // create params here for ease
      const [
        { userId: jwtUserId },
        {
          userId,
          screenName,
          sinceId,
          maxId,
          count,
          trimUser,
          excludeReplies,
          includeRts,
        },
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterHomeTimelineArgsType,
      ];
      // call service to get
      // a user timeline that
      // matches the given
      // criteria
      const response = await this.twitterTimelineService.homeTimeline({
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      return response;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterTimelineResolver::#twitterHomeTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  /**
   *
   *
   * @param {*} context
   * @param {TwitterMentionsTimelineArgsType} twitterMentionsTimelineArgsType
   * @returns {Promise<TwitterTweetObjectType[]>}
   * @memberof TwitterTimelineResolver
   */
  @JWTAuthorization()
  @ScopeAuthorization(['Twitter User'])
  @Query((_returns: unknown) => [TwitterTweetObjectType])
  public async twitterMentionsTimeline(@Ctx() context: any, @Args() twitterMentionsTimelineArgsType: TwitterMentionsTimelineArgsType): Promise<TwitterTweetObjectType[]> {
    try {
      // create params here for ease
      const [
        { userId: jwtUserId },
        {
          userId,
          screenName,
          sinceId,
          maxId,
          count,
          trimUser,
          excludeReplies,
          includeRts,
        },
      ]: any[] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterMentionsTimelineArgsType,
      ];
      // call service to get
      // a user timeline that
      // matches the given
      // criteria
      const response = await this.twitterTimelineService.mentionsTimeline({
        jwtUserId,
        userId,
        screenName,
        sinceId,
        maxId,
        count,
        trimUser,
        excludeReplies,
        includeRts,
      });
      return response;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterTimelineResolver::#twitterHomeTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}
