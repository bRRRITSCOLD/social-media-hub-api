// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Mutation, Arg, Ctx,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';

// models
import { APIError } from '../../models/error';

// libraries
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';
import { JWTAuthorization, ScopeAuthorization } from '../../lib/decorators';
import * as authentication from '../../lib/authentication';

// graphql type
import {
  RegisterUserInputType, UserType, UserCredentialsType, LoginUserInputType, RefreshUserJWTInputType,
} from './user.types';

// services
import { UserService } from './user.service';
import { AnyObject } from '../../models/any';

class UserAccess {}

@Service({ transient: true })
@Resolver((_of: unknown) => UserAccess)
export class UserAccessResolver {
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
      throw { errors: [error] };
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
        jwtRefreshToken: userCrendtials.jwtRefreshToken,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#loginUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => UserCredentialsType)
  public async refreshUserJWT(@Ctx() context: any, @Arg('data') refreshUserJWTInputType: RefreshUserJWTInputType): Promise<UserCredentialsType> {
    try {
      // get params from reqeust for ease
      const [
        { userId },
        { jwtRefreshToken },
      ] = [
        authentication.jwt.decode(context.request.headers.authorization) as AnyObject,
        refreshUserJWTInputType,
      ];
      // call service
      const userCrendtials = await this.userService.refreshUserJWT({
        userId: userId as string,
        jwtRefreshToken,
      });
      // return the authorization link
      return {
        jwt: userCrendtials.jwt as string,
        jwtRefreshToken: userCrendtials.jwtRefreshToken,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#refreshUserJWT::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}
