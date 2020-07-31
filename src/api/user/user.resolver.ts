// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Mutation, Arg,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';

// models
import { Twitter } from '../../models/twitter';

// libraries
// import * as cryptography from '../../lib/cryptography';
// import { env } from '../../lib/environment';

// decorators
// import { ScopeAuthorization, JWTAuthorization } from '../../decorators/security';

// graphql type
import {
  RegisterUserInputType, UserType, UserCredentialsType, LoginUserInputType,
} from './user.types';

// services
// import { TwitterService } from './twitter.service';
// import { mongo } from '../../lib/mongo';
// import { User } from '../../models/user';
import { UserService } from './user.service';
import { APIError } from '../../models/error';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';

@Service()
@Resolver((_of: unknown) => UserType)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Mutation((_returns: unknown) => UserType)
  public async registerUser(@Arg('data') registerUserInputType: RegisterUserInputType): Promise<UserType> {
    try {
      // call service
      const registeredUser = await this.userService.registerUser(registerUserInputType);
      // return the authorization link
      return {
        emailAddress: registeredUser.emailAddress,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        password: undefined,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}UserService::#registerUser::error executing::error=${anyy.stringify(error)}`);
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
      logger.debug(`{}UserService::#loginUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
