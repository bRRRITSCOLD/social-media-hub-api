// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

// libraries
import { utils } from '../../../lib/utils';
import { logger } from '../../../lib/logger';
import { env } from '../../../lib/environment';
import * as authentication from '../../../lib/authentication';
import { STANDARD_USER_ROLE, TWITTER_USER_ROLE } from '../../../lib/authorization';
import * as cryptography from '../../../lib/cryptography';

// models
import { APIError } from '../../../models/error';
import { AnyObject } from '../../../models/common';
import { User, UserInterface } from '../../../models/user';
import { UserToken, UserTokenTypeEnum } from '../../../models/user-token';

// data-management
import * as userManager from '../../../data-management/user';
import * as userTokenManager from '../../../data-management/user-token';

@Service({ transient: true, global: false })
export class UserAccessService {
  public async registerUser(user: UserInterface): Promise<User> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserAccessService::#registerUser::initiating execution');
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
      logger.info('{}UserAccessService::#registerUser::successfully executed');
      // return resulst explicitly
      return putUser;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserAccessService::#registerUser::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async loginUser(loginUserReqeust: { emailAddress: string; password: string; ipAddress?: string; }): Promise<{ jwt: string | null | AnyObject; jwtRefreshToken: string; }> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserAccessService::#loginUser::initiating execution');
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
      // compare a user's password
      if (!await cryptography.password.compare(password, existingUser.password)) throw new APIError(
        new Error(`Error logging in with email address ${emailAddress}`),
      );
      // grab a user's tokens
      const { userTokens: existingUserTokens } = await userTokenManager.searchUserTokens({
        searchCriteria: { userId: existingUser.userId },
        searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER },
      });
      // find any specific tokens
      const [
        [existingUserTwitterToken],
      ] = [
        _.filter(existingUserTokens, { type: UserTokenTypeEnum.TWITTER }),
      ];
      // create a new authentication.jwt refresh user token
      const userJWTRefreshToken = new UserToken({
        userId: existingUser.userId,
        tokenId: uuid(),
        type: UserTokenTypeEnum.JWT_REFRESH,
        jwtRefreshToken: uuid(),
      });
      // update a user's authentication.jwt refresh user token in the back end system
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
      logger.info('{}UserAccessService::#loginUser::successfully executed');
      // return resulst explicitly
      return {
        jwt: authentication.jwt.sign({
          userId: existingUser.userId,
          roles: [
            STANDARD_USER_ROLE,
            existingUserTwitterToken
              ? TWITTER_USER_ROLE
              : undefined,
          ].filter((item: any) => item !== undefined) as string [],
          twitterScreenName: _.get(existingUserTwitterToken, 'twitterScreenName', ''),
          twitterUserId: _.get(existingUserTwitterToken, 'twitterUserId', ''),
        }),
        jwtRefreshToken: cryptography.sign(userJWTRefreshToken.jwtRefreshToken as string, env.COOKIE_SECRET),
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserAccessService::#loginUser::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async refreshUserJWT(refreshUserJWTRequest: { userId: string; jwtRefreshToken: string; }): Promise<{ jwt: string | null | AnyObject; jwtRefreshToken: string; }> {
    try {
      // log for debugging and run support purposes
      logger.info('{}UserAccessService::#refreshUserJWT::initiating execution');
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
        searchOptions: { pageNumber: 1, pageSize: Number.MAX_SAFE_INTEGER },
      });
      // get the users authentication.jwt refresh token
      const existingUserJWTRefreshTokens = _.filter(existingUserTokens, { type: UserTokenTypeEnum.JWT_REFRESH });
      // validate we found a refresh toke
      if (!existingUserJWTRefreshTokens || !existingUserJWTRefreshTokens.length) throw new APIError(
        new Error(`No authentication.jwt refresh tokens found for user id ${userId}`),
        { statusCode: 404 },
      );
      // find the refresh token it responds to
      const existingUserJWTRefreshToken = existingUserJWTRefreshTokens.reduce((found: UserToken | undefined, userJWTRefreshToken: UserToken) => {
        // compare a user's password
        if (cryptography.decrypt(
          userJWTRefreshToken.jwtRefreshToken as string,
        ) === cryptography.unsign(
          jwtRefreshToken, env.COOKIE_SECRET,
        )) found = userJWTRefreshToken;
        return found;
      }, undefined);
      // validate we found the refresh token
      if (!existingUserJWTRefreshToken) throw new APIError(
        new Error('Invalid authentication.jwt refresh token'),
        { statusCode: 409 },
      );
      // find any tokens you may need for things below
      const [
        [existingUserTwitterToken],
      ] = [
        _.filter(existingUserTokens, { type: UserTokenTypeEnum.TWITTER }),
      ];
      // create a new authentication.jwt refresh user token
      const userJWTRefreshToken = new UserToken({
        userId: existingUser.userId,
        tokenId: existingUserJWTRefreshToken.tokenId,
        type: UserTokenTypeEnum.JWT_REFRESH,
        jwtRefreshToken: uuid(),
      });
      // update a user's authentication.jwt refresh user token in the back end system
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
      logger.info('{}UserAccessService::#refreshUserJWT::successfully executed');
      // return resulst explicitly
      return {
        jwt: authentication.jwt.sign({
          userId: existingUser.userId,
          roles: [
            STANDARD_USER_ROLE,
            existingUserTwitterToken
              ? TWITTER_USER_ROLE
              : undefined,
          ].filter((item: any) => item !== undefined) as string [],
          twitterScreenName: _.get(existingUserTwitterToken, 'twitterScreenName', ''),
          twitterUserId: _.get(existingUserTwitterToken, 'twitterUserId', ''),
        }),
        jwtRefreshToken: cryptography.sign(userJWTRefreshToken.jwtRefreshToken as string, env.COOKIE_SECRET),
      };
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.error(`{}UserAccessService::#refreshUserJWT::error executing::error=${utils.anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }
}
