// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Mutation, Arg,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
// import { AnyObject } from '../../models/any';
import { Twitter } from '../../models/twitter';

// libraries
// import * as cryptography from '../../lib/cryptography';
// import { env } from '../../lib/environment';

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// graphql type
import { RegisterUserInputType, UserType } from './user.types';

// services
// import { TwitterService } from './twitter.service';
// import { mongo } from '../../lib/mongo';
// import { User } from '../../models/user';
import { UserService } from './user.service';

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

  @Mutation((_returns: unknown) => UserType)
  public async registerUser(@Arg('data') registerUserInputType: RegisterUserInputType): Promise<UserType> {
    // call service
    const registeredUser = await this.userService.registerUser(registerUserInputType);
    // return the authorization link
    return {
      emailAddress: registeredUser.emailAddress,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      password: undefined,
    };
  }

  // // deconstruct for ease
  // const {
  //   emailAddress, password, firstName, lastName,
  // } = RegisterUserInputType;
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
