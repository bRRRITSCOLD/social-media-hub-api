// node_modules
import * as _ from 'lodash';
import Joi from '@hapi/joi';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';

// libraries
import { enumerations } from '../lib/utils';

/**
 *
 *
 * @export
 * @enum {number}
 */
export enum UserTokenTypeEnum {
  TWITTER = 'TWITTER',
  NA = 'NA',
}

/**
 *
 *
 * @export
 * @interface UserTokenInterface
 */
export interface UserTokenInterface {
  tokenId: string;
  type: UserTokenTypeEnum;
  oAuthAccessToken?: string;
  oAuthAccessTokenSecret?: string;
}

const userTokenSchema: yup.ObjectSchema<any> = yup.object().shape({
  tokenId: yup
    .string()
    .label('Token ID')
    .required(),
  type: yup
    .string()
    .label('Type')
    .oneOf(enumerations.enumerate(UserTokenTypeEnum))
    .required(),
  oAuthAccessToken: yup
    .string()
    .label('OAuth Access Token')
    .optional(),
  oAuthAccessTokenSecret: yup
    .string()
    .label('OAuth Access Token Secret')
    .optional(),
});

/**
 *
 *
 * @export
 * @class UserToken
 * @implements {UserTokenInterface}
 */
export class UserToken implements UserTokenInterface {
  public tokenId!: string;
  public type!: UserTokenTypeEnum;
  public oAuthAccessToken?: string;
  public oAuthAccessTokenSecret?: string;

  /**
   *Creates an instance of UserToken.
   * @param {Partial<UserTokenInterface>} userToken
   * @memberof UserToken
   */
  public constructor(userToken: Partial<UserTokenInterface>) {
    _.assign(this, {
      ...userToken,
      tokenId: _.get(userToken, 'tokenId', uuid()),
      type: _.get(userToken, 'type', UserTokenTypeEnum.NA),
      oAuthAccessToken: _.get(userToken, 'oAuthAccessToken'),
      oAuthAccessTokenSecret: _.get(userToken, 'oAuthAccessTokenSecret'),
    });
  }

  /**
   *
   *
   * @returns {({ value: UserToken | undefined; error: Error | yup.ValidationError | undefined })}
   * @memberof UserToken
   */
  public validate(): { value: UserToken | undefined; error: Error | yup.ValidationError | undefined } {
    try {
      let validationError;
      let validationValue: UserToken | undefined;
      try {
        validationValue = new UserToken(userTokenSchema.validateSync(
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
   * @returns {(Promise<{ value: UserToken | undefined; error: Error | yup.ValidationError | undefined }>)}
   * @memberof UserToken
   */
  public async validateAsync(): Promise<{ value: UserToken | undefined; error: Error | yup.ValidationError | undefined }> {
    try {
      let validationError;
      let validationValue: UserToken | undefined;
      try {
        validationValue = new UserToken(await userTokenSchema.validate(
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
