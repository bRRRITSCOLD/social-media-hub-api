// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import { Resolver, Query, Ctx } from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
// import { AnyObject } from '../../models/any';
import { Twitter } from '../../models/twitter';
import { TwitterService } from './twitter.service';

// libraries

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// services

@Service()
@Resolver(_of => Twitter)
export class TwitterResolver {
  public constructor(private readonly twitterService: TwitterService) {}

  @Query(_returns => String)
  public async login(@Ctx() context: any) {
    const loginTokens = await this.twitterService.login();
    context.response.header('Set-Cookie', 'myvalue');
    return `https://twitter.com/oauth/authorize?oauth_token=${loginTokens.oAuthToken}`;
  }

  // @FieldResolver()
  // public async teams(@Root() match: Match) {
  //   try {
  //     // @ts-ignore
  //     const tms: Teams = await this.teamService.fetchSome(_.get(match, 'teams', []).map((team: any) => team.id));
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
