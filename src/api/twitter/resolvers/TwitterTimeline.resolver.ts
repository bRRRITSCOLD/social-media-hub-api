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
import { APIError } from '../../../models/error';
import { AnyObject } from '../../../models/common';
import { TwitterUserTimelineArgsType, TwitterTweetType } from '../types';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { JWTAuthorization, ScopeAuthorization } from '../../../lib/decorators';
import * as authentication from '../../../lib/authentication';

// services
import { TwitterTimelineService } from '../services';

class TwitterTimeline {}

@Service()
@Resolver((_of: unknown) => TwitterTimeline)
export class TwitterTimelineResolver {
  public constructor(private readonly twitterTimelineService: TwitterTimelineService) {}

  // TODO: put this in twitter.resolver.ts
  // TODO: add test in twitter.resolver.e2e.test.ts
  @JWTAuthorization()
  @ScopeAuthorization(['Twitter User'])
  @Query((_returns: unknown) => [TwitterTweetType])
  public async twitterUserTimeline(@Ctx() context: any, @Args() twitterUserTimelineArgsType: TwitterUserTimelineArgsType): Promise<TwitterTweetType[]> {
    try {
      // create params here for ease
      const [
        { userId },
        {
          twitterUserId,
          twitterScreenName,
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
        userId,
        twitterUserId,
        twitterScreenName,
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
      logger.error(`{}TwitterTimeline::#twitterUserTimeline::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  // TODO: put this in twitter.resolver.ts
  // TODO: add test in twitter.resolver.e2e.test.ts
  // public async getHomeTimeline() {
  //   try {
  //     const response = await client.get('statuses/user_timeline', {
  //       screen_name: 'twitterapi',
  //       count: 2,
  //     });
  //   } catch (err) {
  //     // build error
  //     const error = new APIError(err);
  //     // log for debugging and run support purposes
  //     logger.info(`{}twitterAccessService::#getOAuthRequestToken::error executing::error=${utils.anyy.stringify(error)}`);
  //     // throw error explicitly
  //     throw error;
  //   }
  // }

  // TODO: put this in twitter.resolver.ts
  // TODO: add test in twitter.resolver.e2e.test.ts
  // public async getMentionTimeline() {
  //   try {
  //     const response = await client.get('statuses/user_timeline', {
  //       screen_name: 'twitterapi',
  //       count: 2,
  //     });
  //   } catch (err) {
  //     // build error
  //     const error = new APIError(err);
  //     // log for debugging and run support purposes
  //     logger.info(`{}twitterAccessService::#getOAuthRequestToken::error executing::error=${utils.anyy.stringify(error)}`);
  //     // throw error explicitly
  //     throw error;
  //   }
  // }

  // @FieldResolver()
  // public async teams(@Root() match: Match) {
  //   try {
  //     // @ts-ignore
  //     const tms: Teams = await this.teamService.fetchSome(_.get(match, 'teams', []).map((team: unknown) => team.id));
  //     return iterate(tms.TEAMS)
  //       .filter((team: Team) => team.id !== null && team.id !== undefined)
  //       .map((team: Team) => {
  //         return { ...team };
  //       })
  //       .toArray();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
