// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import { Resolver, Query, Ctx } from 'type-graphql';
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

@Service()
@Resolver((_of: unknown) => Twitter)
export class TwitterResolver {
  public constructor(private readonly twitterService: TwitterService) {}

  @Query((_returns: unknown) => String)
  public async getOAuthRequestToken(@Ctx() context: any): Promise<string> {
    const loginTokens = await this.twitterService.getOAuthRequestToken();
    // set and sign the
    // oAuthRequestToken cookie
    context.response.setCookie(
      'oAuthRequestToken',
      cryptography.sign(
        loginTokens.oAuthRequestToken,
        env.COOKIE_SECRET,
      ),
      { path: '/' },
    );
    // set and sign the
    // oAuthRequestTokenSecret cookie
    context.response.setCookie(
      'oAuthRequestTokenSecret',
      cryptography.sign(
        loginTokens.oAuthRequestTokenSecret,
        env.COOKIE_SECRET,
      ),
      { path: '/' },
    );
    // return the authorization link
    return `https://twitter.com/oauth/authorize?oauth_token=${loginTokens.oAuthRequestToken}`;
  }

  @Query((_returns: unknown) => Boolean)
  public async getOAuthAccessToken(@Ctx() context: any): Promise<boolean> {
    const loginTokens = await this.twitterService.getOAuthAccessToken({
      oAuthRequestToken: cryptography.unsign(
        context.request.cookies.oAuthRequestToken,
        env.COOKIE_SECRET,
      ) as string,
      oAuthRequestTokenSecret: cryptography.unsign(
        context.request.cookies.oAuthRequestTokenSecret,
        env.COOKIE_SECRET,
      ) as string,
      oAuthVerifier: '',
    });
    // set and sign the
    // oAuthRequestTokenSecret cookie
    context.response.setCookie(
      'oAuthRequestTokenSecret',
      cryptography.sign(
        loginTokens.oAuthRequestTokenSecret,
        env.COOKIE_SECRET,
      ),
      { path: '/' },
    );
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
