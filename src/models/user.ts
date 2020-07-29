import * as _ from 'lodash';
import Joi from '@hapi/joi';

export interface UserInterface {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export const userSchema: Joi.ObjectSchema<UserInterface> = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailAddress: Joi.string().required(),
  password: Joi.string().required(),
});

export class User implements UserInterface {
  public firstName!: string;
  public lastName!: string;
  public emailAddress!: string;
  public password!: string;

  public constructor(user: Partial<User>) {
    _.assign(this, {
      ...user,
      firstName: _.get(user, 'firstName', 'NA'),
      lastName: _.get(user, 'lastName', 'NA'),
      emailAddress: _.get(user, 'emailAddress', 'NA'),
      password: _.get(user, 'password', 'NA'),
    });
  }

  public validate(): Joi.ValidationResult {
    try {
      const validation: Joi.ValidationResult = userSchema.validate(this);
      return validation;
    } catch (err) {
      throw err;
    }
  }

  public async validateAsync(): Promise<any> {
    try {
      let validation = await userSchema.validateAsync(this).catch((error: any) => ({ value: this, error }));
      if (!validation.error) validation = { value: this };
      return validation;
    } catch (err) {
      throw err;
    }
  }
}
