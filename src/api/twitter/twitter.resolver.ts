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
import { AnyObject } from '../../models/any';
import { TwitterOAuthAccessTokenInputType, TwitterUserTimelineArgsType, TwitterTweetType } from './twitter.types';

// libraries
import * as cryptography from '../../lib/cryptography';
import { env } from '../../lib/environment';
import { JWTAuthorization, ScopeAuthorization } from '../../lib/decorators';
import { jwt } from '../../lib/authentication';

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// services
import { TwitterAccessService, TwitterTimelineService } from './twitter.service';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';
import { APIError } from '../../models/error';

class TwitterAccess {}

/**
 *
 *
 * @export
 * @class TwitterResolver
 */
@Service()
@Resolver((_of: unknown) => TwitterAccess)
export class TwitterAccessResolver {
  public constructor(private readonly twitterAccessService: TwitterAccessService) {}

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => String)
  public async twitterOAuthRequestToken(@Ctx() context: any): Promise<string> {
    try {
    // create params here for ease
      const [
        { userId },
      ]: any[] = [
        jwt.decode(context.request.headers.authorization) as AnyObject,
      ];
      // call service
      const oAuthRequestTokenResponse = await this.twitterAccessService.oAuthRequestToken({
        userId,
      });
      // oAuthRequestToken cookie
      context.response.clearCookie('oAuthRequestToken');
      context.response.setCookie(
        'oAuthRequestToken',
        cryptography.sign(
          oAuthRequestTokenResponse.oAuthRequestToken as string,
          env.COOKIE_SECRET,
        ),
        { path: '/', httpOnly: true },
      );
      // oAuthRequestTokenSecret cookie
      context.response.clearCookie('oAuthRequestTokenSecret');
      context.response.setCookie(
        'oAuthRequestTokenSecret',
        cryptography.sign(
          oAuthRequestTokenResponse.oAuthRequestTokenSecret as string,
          env.COOKIE_SECRET,
        ),
        { path: '/', httpOnly: true },
      );
      // return the authorization link
      return oAuthRequestTokenResponse.oAuthAccessAuhthorizeUrl as string;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterAccessService::#twitterOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => Boolean)
  public async twitterOAuthAccessToken(@Ctx() context: any, @Arg('data') twitterOAuthAccessTokenInputType: TwitterOAuthAccessTokenInputType): Promise<boolean> {
    try {
      // create params here for ease
      const [
        { userId },
        { oAuthVerifier },
        oAuthRequestToken,
        oAuthRequestTokenSecret,
      ]: any[] = [
        jwt.decode(context.request.headers.authorization) as AnyObject,
        twitterOAuthAccessTokenInputType,
        cryptography.unsign(
          context.request.cookies.oAuthRequestToken,
          env.COOKIE_SECRET,
        ) as string,
        cryptography.unsign(
          context.request.cookies.oAuthRequestTokenSecret,
          env.COOKIE_SECRET,
        ) as string,
      ];
      // call service to get
      // access tokens
      await this.twitterAccessService.oAuthAccessToken({
        userId,
        oAuthVerifier,
        oAuthRequestToken,
        oAuthRequestTokenSecret,
      });
      // clear oAuthRequestToken cookie if we
      // have gotten this far - if we have we have been successful
      context.response.clearCookie('oAuthRequestToken');
      // clear oAuthRequestTokenSecret cookie if we
      // have gotten this far - if we have we have been successful
      context.response.clearCookie('oAuthRequestTokenSecret');
      // return true indicating
      // we have authed with twitter
      return true;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}TwitterAccessService::#twitterOAuthAccessToken::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}

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
        jwt.decode(context.request.headers.authorization) as AnyObject,
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
      logger.error(`{}TwitterTimeline::#twitterUserTimeline::error executing::error=${anyy.stringify(error)}`);
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
  //     logger.info(`{}twitterAccessService::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
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
  //     logger.info(`{}twitterAccessService::#getOAuthRequestToken::error executing::error=${anyy.stringify(error)}`);
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
