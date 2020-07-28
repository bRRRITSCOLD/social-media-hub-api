// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Query, Ctx, Args, ArgsType, Field,
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

// graphql type
import { RegisterUserArgs } from './user.types';

// services
import { TwitterService } from './twitter.service';
import { mongo } from '../../lib/mongo';
import { User } from '../../models/user';

/**
 *
 *
 * @export
 * @class TwitterResolver
 */
@Service()
@Resolver((_of: unknown) => Twitter)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Query((_returns: unknown) => Boolean)
  public async registerUser(@Args() registerUserArgs: RegisterUserArgs): Promise<boolean> {
    // call service to get
    // access tokens
    const registeredUser = await this.userService.getOAuthAccessToken(registerUserArgs);
    // encrypt both access tokens
    const encryptedOAuthAccessToken = cryptography.encrypt(loginTokens.oAuthAccessToken);
    const encryptedOAuthAccessTokenSecret = cryptography.encrypt(loginTokens.oAuthAccessTokenSecret);
    // get mongo connection
    const socialMediaHubDb = await mongo.getConnection(env.MONGO_SOCIAL_MEDIA_HUB_DB_NAME);
    // store the tokens in mongo so
    // that they are reusable upon login and use of
    // twitter by a verified and authenticated member -
    // no need to do the who oauth flow again

    // return the authorization link
    return true;
  }

  // // deconstruct for ease
  // const {
  //   emailAddress, password, firstName, lastName,
  // } = registerUserArgs;
  // // first build a new user instance
  // const newUser = new User({
  //   emailAddress,
  //   firstName,
  //   lastName,
  //   password,
  // });
  // // validate that the user registration
  // // information that was passed in
  // await newUser.validateAsync();

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
