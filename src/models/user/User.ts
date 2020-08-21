// node_modules
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

// libraries

/**
 *
 *
 * @export
 * @interface UserInterface
 */
export interface UserInterface {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  tokens?: string[];
}

const userSchema: yup.ObjectSchema<any> = yup.object().shape({
  userId: yup
    .string()
    .label('User ID')
    .required(),
  firstName: yup
    .string()
    .label('First Name')
    .required(),
  lastName: yup
    .string()
    .label('Last Name')
    .required(),
  emailAddress: yup
    .string()
    .label('Email')
    .email()
    .required(),
  password: yup
    .string()
    .label('Password')
    .required(),
  tokens: yup
    .array()
    .of(yup.string()),
});

/**
 *
 *
 * @export
 * @class User
 * @implements {UserInterface}
 */
export class User implements UserInterface {
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public emailAddress!: string;
  public password!: string;
  public tokens?: string[];

  /**
   *Creates an instance of User.
   * @param {Partial<UserInterface>} user
   * @memberof User
   */
  public constructor(user: Partial<UserInterface>) {
    _.assign(this, {
      ...user,
      userId: _.get(user, 'userId', uuid()),
      firstName: _.get(user, 'firstName'),
      lastName: _.get(user, 'lastName'),
      emailAddress: _.get(user, 'emailAddress'),
      password: _.get(user, 'password'),
      tokens: _.get(user, 'tokens', []),
    });
  }

  /**
   *
   *
   * @returns {({ value: User | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof User
   */
  public validate(): { value: User | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: User | undefined;
      try {
        validationValue = new User(userSchema.validateSync(
          _.assign({}, this),
          { strict: true },
        ));
      } catch (err) {
        validationError = err;
      }
      return { value: validationValue, error: validationError };
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof User
   */
  public async validateAsync(): Promise<{ value: User | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: User | undefined;
      try {
        validationValue = new User(await userSchema.validate(
          _.assign({}, this),
          { strict: true },
        ));
      } catch (err) {
        validationError = err;
      }
      return { value: validationValue, error: validationError };
    } catch (err) {
      throw err;
    }
  }
}
