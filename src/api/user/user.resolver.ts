// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Mutation, Arg, FieldResolver, Root,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';

// models
import { APIError } from '../../models/error';

// libraries
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// graphql type
import {
  RegisterUserInputType, UserType, UserCredentialsType, LoginUserInputType,
} from './user.types';

// services
import { UserService } from './user.service';

@Service({ transient: true })
@Resolver((_of: unknown) => UserType)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Mutation((_returns: unknown) => UserType)
  public async registerUser(@Arg('data') registerUserInputType: RegisterUserInputType): Promise<UserType> {
    try {
      // call service
      const registeredUser = await this.userService.registerUser(
        _.assign({}, registerUserInputType, { userId: uuid() }),
      );
      // return the authorization link
      return {
        userId: registeredUser.userId,
        emailAddress: registeredUser.emailAddress,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        password: undefined,
        tokens: undefined,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#registerUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  @Mutation((_returns: unknown) => UserCredentialsType)
  public async loginUser(@Arg('data') loginUserInputType: LoginUserInputType): Promise<UserCredentialsType> {
    try {
      // call service
      const userCrendtials = await this.userService.loginUser(loginUserInputType);
      // return the authorization link
      return {
        jwt: userCrendtials.jwt as string,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#loginUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  // @FieldResolver()
  // public async tokens(@Root() _user: UserType): Promise<UserToken> {
  //   try {
  //     // @ts-ignore
  //     // const tms: Teams = await this.teamService.fetchSome(_.get(match, 'teams', []).map((team: any) => team.id));
  //     // return iterate(tms.TEAMS)
  //     //   .filter((team: Team) => team.id !== null && team.id !== undefined)
  //     //   .map((team: Team) => {
  //     //     return { ...team };
  //     //   })
  //     //   .toArray();
  //     return [];
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
