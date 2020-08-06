// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Query, Ctx, Args, ArgsType, Field, Mutation,, Arg
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
// import { AnyObject } from '../../models/any';
import { Twitter } from '../../models/twitter';

// libraries
import * as cryptography from '../../lib/cryptography';
import { env } from '../../lib/environment';

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// services
import { TwitterService } from './twitter.service';
import { mongo } from '../../lib/mongo';
import { JWTAuthorization, ScopeAuthorization } from '../../decorators';

/**
 *
 *
 * @class GetOAuthAccessTokenArgs
 */
@ArgsType()
export class GetOAuthAccessTokenArgs {
  @Field((_type: unknown) => String)
  oAuthVerifier: string;
}

/**
 *
 *
 * @export
 * @class TwitterResolver
 */
@Service()
@Resolver((_of: unknown) => Twitter)
export class TwitterResolver {
  public constructor(private readonly twitterService: TwitterService) {}

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Query((_returns: unknown) => String)
  public async getOAuthRequestToken(@Ctx() context: any): Promise<string> {
    // call service
    const getOAuthRequestTokenResponse = await this.twitterService.getOAuthRequestToken();
    // oAuthRequestToken cookie
    context.response.clearCookie('oAuthRequestToken');
    context.response.setCookie(
      'oAuthRequestToken',
      cryptography.sign(
        getOAuthRequestTokenResponse.oAuthRequestToken as string,
        env.COOKIE_SECRET,
      ),
      { path: '/', httpOnly: true },
    );
    // oAuthRequestTokenSecret cookie
    context.response.clearCookie('oAuthRequestTokenSecret');
    context.response.setCookie(
      'oAuthRequestTokenSecret',
      cryptography.sign(
        getOAuthRequestTokenResponse.oAuthRequestTokenSecret as string,
        env.COOKIE_SECRET,
      ),
      { path: '/', httpOnly: true },
    );
    // return the authorization link
    return getOAuthRequestTokenResponse.oAuthAccessAuhthorizeUrl as string;
  }

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Query((_returns: unknown) => Boolean)
  public async getOAuthAccessToken(@Ctx() context: any, @Args() getOAuthAccessTokenArgs: GetOAuthAccessTokenArgs): Promise<boolean> {
    // deconstruct for ease
    const { oAuthVerifier } = getOAuthAccessTokenArgs;
    // oAuthRequestTokenSecret cookie
    const oAuthRequestToken = cryptography.unsign(
      context.request.cookies.oAuthRequestToken,
      env.COOKIE_SECRET,
    ) as string;
    // oAuthRequestTokenSecret cookie
    const oAuthRequestTokenSecret = cryptography.unsign(
      context.request.cookies.oAuthRequestTokenSecret,
      env.COOKIE_SECRET,
    ) as string;
    // call service to get
    // access tokens
    const loginTokens = await this.twitterService.getOAuthAccessToken({
      oAuthVerifier,
      oAuthRequestToken,
      oAuthRequestTokenSecret,
    });
    // encrypt both access tokens
    const encryptedOAuthAccessToken = cryptography.encrypt(loginTokens.oAuthAccessToken);
    const encryptedOAuthAccessTokenSecret = cryptography.encrypt(loginTokens.oAuthAccessTokenSecret);
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // store the tokens in mongo so
    // that they are reusable upon login and use of
    // twitter by a verified and authenticated member -
    // no need to do the who oauth flow again
    // oAuthRequestTokenSecret cookie
    context.response.clearCookie('oAuthRequestToken');
    // oAuthRequestTokenSecret cookie
    context.response.clearCookie('oAuthRequestTokenSecret');
    // return the authorization link
    return true;
  }

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
