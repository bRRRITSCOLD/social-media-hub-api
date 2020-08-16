// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import { STANDARD_USER_ROLE } from '../../lib/authorization';
import { jwt } from '../../lib/authentication';
import { logger } from '../../lib/logger';
import { anyy } from '../../lib/utils';
import * as cryptography from '../../lib/cryptography';

// models
import { APIError } from '../../models/error';
import { User, UserInterface } from '../../models/user';
import { UserToken, UserTokenTypeEnum } from '../../models/user-token';
import { AnyObject } from '../../models/any';

// data-management
import * as userManager from '../../data-management/user.manager';
import * as userTokenManager from '../../data-management/user-token.manager';
import { env } from '../../lib/environment';

@Service({ transient: true, global: false })
export class UserService {
  public async registerUser(user: UserInterface): Promise<User> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserService::#registerUser::initiating execution');
      // first create a new user instace
      const newUser = new User(_.assign({}, user));
      // validate that the data passed
      // in adheres to the user schema
      const schemaValidation = await newUser.validateAsync();
      // if there is an error throw said error
      if (schemaValidation.error) throw new APIError(
        schemaValidation.error,
        { statusCode: 400 },
      );
      // seach for a user with the current email address passed in
      const { users: [existingUser] } = await userManager.searchUsers({
        searchCriteria: { emailAddress: newUser.emailAddress },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // if there is an existing user throw an error -
      // only one user allowed per email address
      if (existingUser) throw new APIError(
        new Error(`A user already exists with the email address ${existingUser.emailAddress}`),
      );
      // get sal rounds for encrypting password
      const saltRounds = await cryptography.password.genSalt();
      // encrpyt a user's password
      newUser.password = await cryptography.password.hash(user.password, saltRounds);
      // not put the user into mongo
      const putUser = await userManager.putUser({
        user: _.assign({}, newUser),
        putCriteria: { emailAddress: newUser.emailAddress },
        putOptions: {},
      });
      // log for debugging and run support purposes
      logger.info('{}UserService::#registerUser::successfully executed');
      // return resulst explicitly
      return putUser;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#registerUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async loginUser(loginUserReqeust: { emailAddress: string; password: string; ipAddress?: string; }): Promise<{ jwt: string | null | AnyObject; jwtRefreshToken: string; }> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserService::#loginUser::initiating execution');
      // deconstruct for ease
      const {
        emailAddress,
        password,
        ipAddress,
      } = loginUserReqeust;
      // seach for a user with the current email address passed in
      const { users: [existingUser] } = await userManager.searchUsers({
        searchCriteria: { emailAddress },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // if there is an existing user throw an error -
      // only one user allowed per email address
      if (!existingUser) throw new APIError(
        new Error(`No user found with the email address ${emailAddress}`),
        { statusCode: 404 },
      );
      // grab a user's tokens
      const { userTokens: existingUserTokens } = await userTokenManager.searchUserTokens({
        searchCriteria: { userId: existingUser.userId },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // compare a user's password
      if (!await cryptography.password.compare(password, existingUser.password)) throw new APIError(
        new Error(`Error logging in with email address ${emailAddress}`),
      );
      // create a users roles
      const roles: string[] = [];
      // first based off user tokens
      roles.push(
        STANDARD_USER_ROLE,
        ...existingUserTokens.reduce((userRoles: string[], existingUserToken: UserToken) => {
          if (
            existingUserToken.type === UserTokenTypeEnum.TWITTER
            && existingUserToken.oAuthAccessToken
            && existingUserToken.oAuthAccessTokenSecret
          ) {
            userRoles.push('Twitter User');
          }
          return userRoles;
        }, []),
      );
      // create a new jwt refresh user token
      const userJWTRefreshToken = new UserToken({
        type: UserTokenTypeEnum.JWT_REFRESH,
        jwtRefreshToken: uuid(),
      });
      // update a user's jwt refresh user token in the back end system
      await userTokenManager.putUserToken({
        userToken: _.assign(
          {},
          userJWTRefreshToken,
          { jwtRefreshToken: cryptography.encrypt(userJWTRefreshToken.jwtRefreshToken as string) },
        ),
        putCriteria: {
          type: UserTokenTypeEnum.JWT_REFRESH,
        },
        putOptions: {},
      });
      // log for debugging and run support purposes
      logger.info('{}UserService::#loginUser::successfully executed');
      // return resulst explicitly
      return {
        jwt: jwt.sign({
          userId: existingUser.userId,
          roles,
        }),
        jwtRefreshToken: cryptography.sign(userJWTRefreshToken.jwtRefreshToken as string, env.COOKIE_SECRET),
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

  public async refreshUserJWT(refreshUserJWTRequest: { userId: string; jwtRefreshToken: string; }): Promise<{ jwt: string | null | AnyObject; jwtRefreshToken: string; }> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserService::#refreshUserJWT::initiating execution');
      // deconstruct for ease
      const {
        userId,
        jwtRefreshToken,
      } = refreshUserJWTRequest;
      // seach for a user with the current email address passed in
      const { users: [existingUser] } = await userManager.searchUsers({
        searchCriteria: { userId },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // if there is an existing user throw an error -
      // only one user allowed per email address
      if (!existingUser) throw new APIError(
        new Error(`No user found for user id ${userId}`),
        { statusCode: 404 },
      );
      // grab a user's tokens
      const { userTokens: existingUserTokens } = await userTokenManager.searchUserTokens({
        searchCriteria: { userId },
        searchOptions: { pageNumber: 1, pageSize: 1 },
      });
      // get the users jwt refresh token
      const existingUserJWTRefreshToken = _.find(existingUserTokens, { type: UserTokenTypeEnum.JWT_REFRESH });
      // validate we found a refresh toke
      if (!existingUserJWTRefreshToken) throw new APIError(
        new Error(`No jwt refresh token found for user id ${userId}`),
        { statusCode: 404 },
      );
      // compare a user's password
      if (cryptography.decrypt(
        existingUserJWTRefreshToken.jwtRefreshToken as string,
      ) !== cryptography.unsign(
        jwtRefreshToken, env.COOKIE_SECRET,
      )) throw new APIError(
        new Error('Invalid jwt refresh token'),
        { statusCode: 409 },
      );
      // create a users roles
      const roles: string[] = [];
      // first based off user tokens
      roles.push(
        STANDARD_USER_ROLE,
        ...existingUserTokens.reduce((userRoles: string[], existingUserToken: UserToken) => {
          if (
            existingUserToken.type === UserTokenTypeEnum.TWITTER
            && existingUserToken.oAuthAccessToken
            && existingUserToken.oAuthAccessTokenSecret
          ) {
            userRoles.push('Twitter User');
          }
          return userRoles;
        }, []),
      );
      // create a new jwt refresh user token
      const userJWTRefreshToken = new UserToken({
        type: UserTokenTypeEnum.JWT_REFRESH,
        jwtRefreshToken: uuid(),
      });
      // update a user's jwt refresh user token in the back end system
      await userTokenManager.putUserToken({
        userToken: _.assign(
          {},
          userJWTRefreshToken,
          { jwtRefreshToken: cryptography.encrypt(userJWTRefreshToken.jwtRefreshToken as string) },
        ),
        putCriteria: {
          type: UserTokenTypeEnum.JWT_REFRESH,
        },
        putOptions: {},
      });
      // log for debugging and run support purposes
      logger.info('{}UserService::#refreshUserJWT::successfully executed');
      // return resulst explicitly
      return {
        jwt: jwt.sign({
          userId: existingUser.userId,
          roles,
        }),
        jwtRefreshToken: cryptography.sign(userJWTRefreshToken.jwtRefreshToken as string, env.COOKIE_SECRET),
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserService::#refreshUserJWT::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
