// node_modules
import { Service } from 'typedi';
import * as _ from 'lodash';

// libraries
import { oAuthConnector, OAuth, jwt } from '../../lib/authentication';
import { env } from '../../lib/environment';
import { logger } from '../../lib/logger';
import { mongo } from '../../lib/mongo';
import { anyy } from '../../lib/utils';
import * as cryptography from '../../lib/cryptography';

// models
import { APIError } from '../../models/error';
import { User, UserInterface } from '../../models/user';

// data-management
import * as userManager from '../../data-management/user.manager';
import { AnyObject } from '../../models/any';

@Service({ transient: true, global: false })
export class UserService {
  public async registerUser(user: UserInterface): Promise<User> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}UserService::#registerUser::initiating execution');
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
      logger.debug('{}UserService::#registerUser::successfully executed');
      // return resulst explicitly
      return putUser;
    } catch (err) {
      // build error
      const error = new APIError(err);
      // log for debugging and run support purposes
      logger.debug(`{}UserService::#registerUser::error executing::error=${anyy.stringify(error)}`);
      // throw error explicitly
      throw error;
    }
  }

  public async loginUser(loginUserReqeust: { emailAddress: string; password: string; ipAddress?: string; }): Promise<{ jwt: string | null | AnyObject; }> {
    try {
      // log for debugging and run support purposes
      logger.debug('{}UserService::#loginUser::initiating execution');
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
      );
      // compare a user's password
      if (!await cryptography.password.compare(password, existingUser.password)) throw new APIError(
        new Error(`Error logging in with email address ${emailAddress}`),
      );
      // log for debugging and run support purposes
      logger.debug('{}UserService::#loginUser::successfully executed');
      // return resulst explicitly
      return {
        jwt: jwt.sign({
          emailAddress: existingUser.emailAddress,
        }),
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
