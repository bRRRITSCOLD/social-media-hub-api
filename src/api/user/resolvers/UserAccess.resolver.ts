// node modules
// import { Resolver, Query, FieldResolver, Root, Args } from 'type-graphql';
import {
  Resolver, Mutation, Arg, Ctx,
} from 'type-graphql';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';

// models
import { APIError } from '../../../models/error';
import { AnyObject } from '../../../models/common';
import {
  RegisterUserInputType, UserObjectType, UserCredentialsObjectType, LoginUserInputType, RefreshUserJWTInputType,
} from '../types';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { JWTAuthorization, ScopeAuthorization } from '../../../lib/decorators';
import * as authentication from '../../../lib/authentication';

// services
import { UserAccessService } from '../services';

class UserAccess {}

@Service({ transient: true })
@Resolver((_of: unknown) => UserAccess)
export class UserAccessResolver {
  public constructor(private readonly userAccessService: UserAccessService) {}

  @Mutation((_returns: unknown) => UserObjectType)
  public async registerUser(@Arg('data') registerUserInputType: RegisterUserInputType): Promise<UserObjectType> {
    try {
      // call service
      const registeredUser = await this.userAccessService.registerUser(
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
      logger.error(`{}UserAccessService::#registerUser::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  @Mutation((_returns: unknown) => UserCredentialsObjectType)
  public async loginUser(@Arg('data') loginUserInputType: LoginUserInputType): Promise<UserCredentialsObjectType> {
    try {
      // call service
      const userCrendtials = await this.userAccessService.loginUser(loginUserInputType);
      // return the authorization link
      return {
        jwt: userCrendtials.jwt as string,
        jwtRefreshToken: userCrendtials.jwtRefreshToken,
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserAccessService::#loginUser::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }

  @JWTAuthorization()
  @ScopeAuthorization(['*'])
  @Mutation((_returns: unknown) => UserCredentialsObjectType)
  public async refreshUserJWT(@Ctx() context: any, @Arg('data') refreshUserJWTInputType: RefreshUserJWTInputType): Promise<UserCredentialsObjectType> {
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
      const userCrendtials = await this.userAccessService.refreshUserJWT({
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
      logger.error(`{}UserAccessService::#refreshUserJWT::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw { errors: [error] };
    }
  }
}
