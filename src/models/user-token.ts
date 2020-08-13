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
  userId: string;
  type: UserTokenTypeEnum;
  oAuthRequestToken?: string;
  oAuthRequestTokenSecret?: string;
  oAuthAccessToken?: string;
  oAuthAccessTokenSecret?: string;
  oAuthAccessAuhthorizeUrl?: string;
  twitterScreenName?: string;
  twitterUserId?: string;
}

const userTokenSchema: yup.ObjectSchema<any> = yup.object().shape({
  tokenId: yup
    .string()
    .label('Token ID')
    .required(),
  userId: yup
    .string()
    .label('User ID')
    .required(),
  type: yup
    .string()
    .label('Type')
    .oneOf(enumerations.enumerate(UserTokenTypeEnum))
    .required(),
  oAuthRequestToken: yup
    .string()
    .label('OAuth Request Token')
    .optional()
    .nullable(),
  oAuthRequestTokenSecret: yup
    .string()
    .label('OAuth Request Token Secret')
    .optional()
    .nullable(),
  oAuthAccessToken: yup
    .string()
    .label('OAuth Access Token')
    .optional()
    .nullable(),
  oAuthAccessTokenSecret: yup
    .string()
    .label('OAuth Access Token Secret')
    .optional()
    .nullable(),
  oAuthAccessAuhthorizeUrl: yup
    .string()
    .label('OAuth Access Auhthoriz Url')
    .optional()
    .nullable(),
  twitterUserId: yup
    .string()
    .label('Twitter User ID')
    .optional()
    .nullable(),
  twitterScreenName: yup
    .string()
    .label('Twitter Screen Name')
    .optional()
    .nullable(),
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
  public userId!: string;
  public type!: UserTokenTypeEnum;
  public oAuthRequestToken?: string;
  public oAuthRequestTokenSecret?: string;
  public oAuthAccessToken?: string;
  public oAuthAccessTokenSecret?: string;
  public oAuthAccessAuhthorizeUrl?: string;
  public twitterScreenName?: string;
  public twitterUserId?: string;

  /**
   *Creates an instance of UserToken.
   * @param {Partial<UserTokenInterface>} userToken
   * @memberof UserToken
   */
  public constructor(userToken: Partial<UserTokenInterface>) {
    _.assign(this, {
      ...userToken,
      tokenId: _.get(userToken, 'tokenId', uuid()),
      userId: _.get(userToken, 'userId', uuid()),
      type: _.get(userToken, 'type', UserTokenTypeEnum.NA),
      oAuthRequestToken: _.get(userToken, 'oAuthRequestToken'),
      oAuthRequestTokenSecret: _.get(userToken, 'oAuthRequestTokenSecret'),
      oAuthAccessToken: _.get(userToken, 'oAuthAccessToken'),
      oAuthAccessTokenSecret: _.get(userToken, 'oAuthAccessTokenSecret'),
      oAuthAccessAuhthorizeUrl: _.get(userToken, 'oAuthAccessAuhthorizeUrl'),
      twitterScreenName: _.get(userToken, 'twitterScreenName'),
      twitterUserId: _.get(userToken, 'twitterUserId'),
    });
  }

  public get isTwitterUserToken(): boolean {
    return this.type.toUpperCase() === UserTokenTypeEnum.TWITTER;
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
